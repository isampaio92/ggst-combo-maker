import { APP_CONFIG } from '../config/config';
import { ensureDatabaseInitialized } from '../database/migrations';
import { recordLocalLog } from '../logs';
import {
  readRawJsonKey,
  validateAndNormalizeCombos,
  validateAndNormalizeFolders,
  writeRawJsonKey,
} from './storage';
import {
  type Folder,
  generateUUID,
  sanitizeUserText,
} from './types';

/**
 * Ordena pastas em ordem alfabética (índice funcional conforme FSD seções 11, 14 e 22).
 */
export function sortFoldersAlphabetically(folders: readonly Folder[]): Folder[] {
  return [...folders].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  );
}

/**
 * Model da entidade Pasta (`folders` no Local Storage).
 * Responsável pela persistência, índice de ordenação alfabética, unicidade de nomes e exclusão em cascata.
 */
export const FolderModel = {
  /**
   * Retorna todas as pastas salvas, ordenadas alfabeticamente.
   */
  getAll(): Folder[] {
    ensureDatabaseInitialized();
    const raw = readRawJsonKey(APP_CONFIG.storageKeys.folders);
    const { folders, hadInvalidItems } = validateAndNormalizeFolders(raw.value);

    if (!raw.exists || raw.corrupted || hadInvalidItems) {
      writeRawJsonKey(APP_CONFIG.storageKeys.folders, folders);
    }

    return sortFoldersAlphabetically(folders);
  },

  /**
   * Busca uma pasta pelo seu identificador UUID.
   */
  getById(folderId: string): Folder | null {
    const folders = this.getAll();
    return folders.find((folder) => folder.id === folderId) ?? null;
  },

  /**
   * Busca uma pasta pelo nome (comparação case-insensitive com nome sanitizado).
   */
  findByName(name: string): Folder | null {
    const cleanName = sanitizeUserText(name);
    if (!cleanName) {
      return null;
    }
    const lowerTarget = cleanName.toLowerCase();
    const folders = this.getAll();
    return folders.find((folder) => folder.name.toLowerCase() === lowerTarget) ?? null;
  },

  /**
   * Cria uma nova pasta garantindo nome obrigatório, sanitizado e único.
   */
  create(name: string): Folder | null {
    const cleanName = sanitizeUserText(name);
    if (!cleanName) {
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: 'O nome da pasta é obrigatório.',
        context: 'FolderModel.create',
      });
      return null;
    }

    const existingFolders = this.getAll();
    const duplicate = existingFolders.some(
      (folder) => folder.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
      recordLocalLog({
        level: 'error',
        code: 'DUPLICATE_NAME_ERROR',
        userMessage: `Já existe uma pasta com o nome "${cleanName}". Escolha um nome único.`,
        context: 'FolderModel.create',
      });
      return null;
    }

    const newFolder: Folder = {
      id: generateUUID(),
      name: cleanName,
    };

    const nextFolders = sortFoldersAlphabetically([...existingFolders, newFolder]);
    const saved = writeRawJsonKey(APP_CONFIG.storageKeys.folders, nextFolders);
    return saved ? newFolder : null;
  },

  /**
   * Obtém a pasta com o nome informado (ex.: nome do personagem) ou a cria automaticamente se não existir (FSD seção 6 e 13).
   */
  getOrCreateByName(name: string): Folder | null {
    const existing = this.findByName(name);
    if (existing) {
      return existing;
    }
    return this.create(name);
  },

  /**
   * Renomeia uma pasta existente, bloqueando nomes já em uso no mesmo nível (FSD seção 14).
   */
  rename(folderId: string, newName: string): Folder | null {
    const cleanName = sanitizeUserText(newName);
    if (!cleanName) {
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: 'O novo nome da pasta não pode ficar vazio.',
        context: 'FolderModel.rename',
      });
      return null;
    }

    const folders = this.getAll();
    const targetIndex = folders.findIndex((folder) => folder.id === folderId);

    if (targetIndex === -1) {
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: 'Pasta não encontrada para renomeação.',
        context: 'FolderModel.rename',
      });
      return null;
    }

    const duplicate = folders.some(
      (folder) =>
        folder.id !== folderId && folder.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
      recordLocalLog({
        level: 'error',
        code: 'DUPLICATE_NAME_ERROR',
        userMessage: `Já existe outra pasta chamada "${cleanName}". Escolha um nome único.`,
        context: 'FolderModel.rename',
      });
      return null;
    }

    const updatedFolder: Folder = {
      ...folders[targetIndex],
      name: cleanName,
    };

    const nextFolders = [...folders];
    nextFolders[targetIndex] = updatedFolder;

    const sorted = sortFoldersAlphabetically(nextFolders);
    const saved = writeRawJsonKey(APP_CONFIG.storageKeys.folders, sorted);
    return saved ? updatedFolder : null;
  },

  /**
   * Exclui definitivamente uma pasta e todos os seus combos internos do Local Storage (sem soft delete, FSD seção 18).
   */
  delete(folderId: string): boolean {
    const folders = this.getAll();
    const exists = folders.some((folder) => folder.id === folderId);
    if (!exists) {
      return false;
    }

    const remainingFolders = folders.filter((folder) => folder.id !== folderId);
    const rawCombos = readRawJsonKey(APP_CONFIG.storageKeys.combos);
    const { combos } = validateAndNormalizeCombos(rawCombos.value, folders);
    const remainingCombos = combos.filter((combo) => combo.folder_id !== folderId);

    const combosSaved = writeRawJsonKey(APP_CONFIG.storageKeys.combos, remainingCombos);
    if (!combosSaved) {
      return false;
    }

    return writeRawJsonKey(APP_CONFIG.storageKeys.folders, remainingFolders);
  },
};
