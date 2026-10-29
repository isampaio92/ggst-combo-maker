import { APP_CONFIG, type CharacterName } from '../config/config';
import { ensureDatabaseInitialized } from '../database/migrations';
import { recordLocalLog } from '../logs';
import { FolderModel } from './folderModel';
import {
  readRawJsonKey,
  validateAndNormalizeCombos,
  writeRawJsonKey,
} from './storage';
import {
  type Combo,
  type ComboInputToken,
  MAX_COMBO_SEQUENCE_LENGTH,
  generateUUID,
  isValidCharacterName,
  isValidComboInputToken,
  isValidEntityId,
  sanitizeUserText,
} from './types';

/**
 * Ordena combos pela data da última edição em ordem decrescente (mais recentes primeiro),
 * conforme FSD seções 11, 14 e 22.
 */
export function sortCombosByUpdatedAtDesc(combos: readonly Combo[]): Combo[] {
  return [...combos].sort((a, b) => b.updated_at - a.updated_at);
}

/**
 * Resultado da tentativa de salvar um combo quando há verificação de duplicidade na mesma pasta.
 */
export type SaveComboResult =
  | { status: 'saved'; combo: Combo; overwritten: boolean }
  | { status: 'duplicate_warning'; existingCombo: Combo; message: string }
  | { status: 'error'; message: string };

/**
 * Model da entidade Combo (`combos` no Local Storage).
 * Gerencia criação, leitura ordenada, atualização, renomeação, movimentação entre pastas e exclusão definitiva.
 */
export const ComboModel = {
  /**
   * Retorna todos os combos válidos do Local Storage ordenados por `updated_at` decrescente.
   */
  getAll(): Combo[] {
    ensureDatabaseInitialized();
    const validFolders = FolderModel.getAll();
    const raw = readRawJsonKey(APP_CONFIG.storageKeys.combos);
    const { combos, hadInvalidItems } = validateAndNormalizeCombos(
      raw.value,
      validFolders
    );

    if (!raw.exists || raw.corrupted || hadInvalidItems) {
      writeRawJsonKey(APP_CONFIG.storageKeys.combos, combos);
    }

    return sortCombosByUpdatedAtDesc(combos);
  },

  /**
   * Retorna os combos pertencentes a uma pasta específica, ordenados por `updated_at` decrescente.
   */
  getByFolderId(folderId: string): Combo[] {
    return this.getAll().filter((combo) => combo.folder_id === folderId);
  },

  /**
   * Busca um combo pelo seu identificador UUID.
   */
  getById(comboId: string): Combo | null {
    return this.getAll().find((combo) => combo.id === comboId) ?? null;
  },

  /**
   * Verifica se já existe um combo com o mesmo nome dentro da mesma pasta (excluindo opcionalmente o próprio ID).
   */
  findDuplicateInFolder(
    folderId: string,
    name: string,
    excludeComboId?: string
  ): Combo | null {
    const cleanName = sanitizeUserText(name);
    if (!cleanName) {
      return null;
    }
    const lowerTarget = cleanName.toLowerCase();
    return (
      this.getAll().find(
        (combo) =>
          combo.folder_id === folderId &&
          combo.id !== excludeComboId &&
          combo.name.toLowerCase() === lowerTarget
      ) ?? null
    );
  },

  /**
   * Salva um combo (criação ou edição de conteúdo).
   * - Se `folderId` não for informado, cria ou localiza automaticamente a pasta com o nome do personagem (FSD seção 6 e 13).
   * - Se já existir outro combo com o mesmo nome na pasta de destino e `allowOverwrite` for `false`,
   *   retorna `duplicate_warning` para que o Controller/View pergunte ao usuário se deseja sobrescrever (FSD seção 14).
   */
  save(params: {
    id?: string;
    name: string;
    character: CharacterName;
    sequence: readonly ComboInputToken[];
    folderId?: string;
    allowOverwrite?: boolean;
  }): SaveComboResult {
    const cleanName = sanitizeUserText(params.name);
    if (!cleanName) {
      const message = 'O nome do combo é obrigatório.';
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: message,
        context: 'ComboModel.save',
      });
      return { status: 'error', message };
    }

    if (!isValidCharacterName(params.character)) {
      const message = 'Selecione um personagem válido da lista oficial.';
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: message,
        context: 'ComboModel.save',
      });
      return { status: 'error', message };
    }

    const sanitizedSequence = params.sequence
      .filter((token) => isValidComboInputToken(token))
      .slice(0, MAX_COMBO_SEQUENCE_LENGTH);

    if (sanitizedSequence.length === 0) {
      const message = 'Adicione pelo menos um botão à sequência antes de salvar o combo.';
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: message,
        context: 'ComboModel.save',
      });
      return { status: 'error', message };
    }

    if (params.id && !isValidEntityId(params.id)) {
      const message = 'Identificador do combo em formato inválido.';
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: message,
        context: 'ComboModel.save(id)',
      });
      return { status: 'error', message };
    }

    // Determinar pasta de destino (fornecida ou automática com o nome do personagem)
    let targetFolder = params.folderId
      ? FolderModel.getById(params.folderId)
      : null;

    if (!targetFolder) {
      targetFolder = FolderModel.getOrCreateByName(params.character);
    }

    if (!targetFolder) {
      const message = 'Não foi possível preparar a pasta do personagem para salvar o combo.';
      return { status: 'error', message };
    }

    const allCombos = this.getAll();
    const duplicate = this.findDuplicateInFolder(
      targetFolder.id,
      cleanName,
      params.id
    );

    if (duplicate && !params.allowOverwrite) {
      const warningMessage = `Já existe um combo chamado "${cleanName}" na pasta "${targetFolder.name}". Deseja sobrescrevê-lo?`;
      recordLocalLog({
        level: 'warning',
        code: 'DUPLICATE_NAME_ERROR',
        userMessage: warningMessage,
        context: 'ComboModel.save',
      });
      return {
        status: 'duplicate_warning',
        existingCombo: duplicate,
        message: warningMessage,
      };
    }

    const now = Date.now();
    let savedCombo: Combo;
    let nextCombos: Combo[];
    let overwritten = false;

    if (duplicate && params.allowOverwrite) {
      // Sobrescreve o combo existente na pasta e remove o registro antigo se estivesse editando outro ID
      savedCombo = {
        id: duplicate.id,
        folder_id: targetFolder.id,
        name: cleanName,
        character: params.character,
        sequence: sanitizedSequence,
        updated_at: now,
      };
      nextCombos = allCombos
        .filter((item) => item.id !== duplicate.id && item.id !== params.id)
        .concat(savedCombo);
      overwritten = true;
    } else if (params.id) {
      const existingIndex = allCombos.findIndex((item) => item.id === params.id);
      savedCombo = {
        id: params.id,
        folder_id: targetFolder.id,
        name: cleanName,
        character: params.character,
        sequence: sanitizedSequence,
        updated_at: now,
      };
      if (existingIndex !== -1) {
        nextCombos = [...allCombos];
        nextCombos[existingIndex] = savedCombo;
        overwritten = true;
      } else {
        nextCombos = [...allCombos, savedCombo];
      }
    } else {
      savedCombo = {
        id: generateUUID(),
        folder_id: targetFolder.id,
        name: cleanName,
        character: params.character,
        sequence: sanitizedSequence,
        updated_at: now,
      };
      nextCombos = [...allCombos, savedCombo];
    }

    const sorted = sortCombosByUpdatedAtDesc(nextCombos);
    const persisted = writeRawJsonKey(APP_CONFIG.storageKeys.combos, sorted);
    if (!persisted) {
      return {
        status: 'error',
        message: 'Não foi possível salvar o combo no armazenamento local.',
      };
    }

    return {
      status: 'saved',
      combo: savedCombo,
      overwritten,
    };
  },

  /**
   * Renomeia um combo existente via ícone de lápis na listagem.
   * Bloqueia com erro caso o nome já esteja em uso na mesma pasta (FSD seção 14).
   */
  rename(comboId: string, newName: string): Combo | null {
    const cleanName = sanitizeUserText(newName);
    if (!cleanName) {
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: 'O novo nome do combo não pode ficar vazio.',
        context: 'ComboModel.rename',
      });
      return null;
    }

    const allCombos = this.getAll();
    const targetIndex = allCombos.findIndex((combo) => combo.id === comboId);
    if (targetIndex === -1) {
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: 'Combo não encontrado para renomeação.',
        context: 'ComboModel.rename',
      });
      return null;
    }

    const currentCombo = allCombos[targetIndex];
    const duplicate = this.findDuplicateInFolder(
      currentCombo.folder_id,
      cleanName,
      comboId
    );

    if (duplicate) {
      recordLocalLog({
        level: 'error',
        code: 'DUPLICATE_NAME_ERROR',
        userMessage: `Já existe um combo chamado "${cleanName}" nesta pasta. Escolha um nome único.`,
        context: 'ComboModel.rename',
      });
      return null;
    }

    const updatedCombo: Combo = {
      ...currentCombo,
      name: cleanName,
      updated_at: Date.now(),
    };

    const nextCombos = [...allCombos];
    nextCombos[targetIndex] = updatedCombo;

    const sorted = sortCombosByUpdatedAtDesc(nextCombos);
    const saved = writeRawJsonKey(APP_CONFIG.storageKeys.combos, sorted);
    return saved ? updatedCombo : null;
  },

  /**
   * Move um combo para outra pasta (Drag and Drop).
   * Conforme FSD seção 14: "O ato de arrastar um combo de uma pasta para outra não altera essa data de edição (updated_at)".
   */
  moveToFolder(comboId: string, targetFolderId: string): Combo | null {
    const targetFolder = FolderModel.getById(targetFolderId);
    if (!targetFolder) {
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: 'Pasta de destino não encontrada.',
        context: 'ComboModel.moveToFolder',
      });
      return null;
    }

    const allCombos = this.getAll();
    const targetIndex = allCombos.findIndex((combo) => combo.id === comboId);
    if (targetIndex === -1) {
      return null;
    }

    const currentCombo = allCombos[targetIndex];
    if (currentCombo.folder_id === targetFolderId) {
      return currentCombo;
    }

    const duplicateInTarget = this.findDuplicateInFolder(
      targetFolderId,
      currentCombo.name,
      comboId
    );

    if (duplicateInTarget) {
      recordLocalLog({
        level: 'error',
        code: 'DUPLICATE_NAME_ERROR',
        userMessage: `A pasta "${targetFolder.name}" já possui um combo chamado "${currentCombo.name}".`,
        context: 'ComboModel.moveToFolder',
      });
      return null;
    }

    // Preserva rigorosamente o `updated_at` original durante o Drag and Drop
    const movedCombo: Combo = {
      ...currentCombo,
      folder_id: targetFolderId,
      updated_at: currentCombo.updated_at,
    };

    const nextCombos = [...allCombos];
    nextCombos[targetIndex] = movedCombo;

    const sorted = sortCombosByUpdatedAtDesc(nextCombos);
    const saved = writeRawJsonKey(APP_CONFIG.storageKeys.combos, sorted);
    return saved ? movedCombo : null;
  },

  /**
   * Exclui definitivamente um combo do Local Storage (sem soft delete, FSD seção 18).
   */
  delete(comboId: string): boolean {
    const allCombos = this.getAll();
    const exists = allCombos.some((combo) => combo.id === comboId);
    if (!exists) {
      return false;
    }

    const remaining = allCombos.filter((combo) => combo.id !== comboId);
    return writeRawJsonKey(APP_CONFIG.storageKeys.combos, remaining);
  },
};
