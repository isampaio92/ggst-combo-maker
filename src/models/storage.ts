import { APP_CONFIG } from '../config/config';
import { recordLocalLog, recordStorageError } from '../logs';
import {
  type Combo,
  type ComboInputToken,
  type Folder,
  type MigrationControlState,
  type MigrationEntry,
  type Settings,
  isValidCharacterName,
  isValidComboInputToken,
  isValidVisualPreference,
  sanitizeUserText,
} from './types';

/**
 * Camada de acesso direto e validação de schema no Local Storage.
 * Garante que leituras e escritas tratem JSON inválido, chaves corrompidas ou QuotaExceededError
 * sem derrubar a aplicação React (FSD seções 11, 19 e 24).
 */

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Lê uma chave bruta do Local Storage e faz o parse seguro do JSON.
 */
export function readRawJsonKey(key: string): { exists: boolean; value: unknown; corrupted: boolean } {
  if (!isLocalStorageAvailable()) {
    return { exists: false, value: null, corrupted: false };
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return { exists: false, value: null, corrupted: false };
    }
    const parsed: unknown = JSON.parse(raw);
    return { exists: true, value: parsed, corrupted: false };
  } catch (error) {
    recordLocalLog({
      level: 'error',
      code: 'STORAGE_INVALID_JSON',
      userMessage: 'Dados locais em formato inválido foram detectados e restaurados com segurança.',
      context: `readRawJsonKey(${key})`,
      technicalDetails: error,
    });
    return { exists: true, value: null, corrupted: true };
  }
}

/**
 * Escreve um valor serializado em JSON no Local Storage de forma segura.
 */
export function writeRawJsonKey<T>(key: string, data: T): boolean {
  if (!isLocalStorageAvailable()) {
    recordLocalLog({
      level: 'error',
      code: 'STORAGE_UNAVAILABLE',
      userMessage: 'O armazenamento local (Local Storage) não está disponível neste navegador.',
      context: `writeRawJsonKey(${key})`,
    });
    return false;
  }

  try {
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    recordStorageError(`writeRawJsonKey(${key})`, error);
    return false;
  }
}

/**
 * Valida e normaliza a lista de pastas (`folders`), garantindo chaves primárias únicas e nomes sanitizados.
 */
export function validateAndNormalizeFolders(input: unknown): {
  folders: Folder[];
  hadInvalidItems: boolean;
} {
  if (!Array.isArray(input)) {
    return { folders: [], hadInvalidItems: input !== null && input !== undefined };
  }

  const folders: Folder[] = [];
  const seenIds = new Set<string>();
  const seenNamesLower = new Set<string>();
  let hadInvalidItems = false;

  for (const item of input) {
    if (!item || typeof item !== 'object') {
      hadInvalidItems = true;
      continue;
    }

    const candidate = item as Record<string, unknown>;
    const rawId = typeof candidate.id === 'string' ? candidate.id.trim() : '';
    const rawName = typeof candidate.name === 'string' ? candidate.name : '';
    const sanitizedName = sanitizeUserText(rawName);

    if (!rawId || !sanitizedName) {
      hadInvalidItems = true;
      continue;
    }

    const lowerName = sanitizedName.toLowerCase();
    if (seenIds.has(rawId) || seenNamesLower.has(lowerName)) {
      hadInvalidItems = true;
      continue;
    }

    seenIds.add(rawId);
    seenNamesLower.add(lowerName);
    folders.push({
      id: rawId,
      name: sanitizedName,
    });
  }

  return { folders, hadInvalidItems };
}

/**
 * Valida e normaliza a lista de combos (`combos`), assegurando integridade referencial com `folders`,
 * personagem válido da lista fixa, tokens de input válidos e sanitização contra XSS.
 */
export function validateAndNormalizeCombos(
  input: unknown,
  validFolders: readonly Folder[]
): {
  combos: Combo[];
  hadInvalidItems: boolean;
} {
  if (!Array.isArray(input)) {
    return { combos: [], hadInvalidItems: input !== null && input !== undefined };
  }

  const validFolderIds = new Set(validFolders.map((folder) => folder.id));
  const combos: Combo[] = [];
  const seenIds = new Set<string>();
  let hadInvalidItems = false;

  for (const item of input) {
    if (!item || typeof item !== 'object') {
      hadInvalidItems = true;
      continue;
    }

    const candidate = item as Record<string, unknown>;
    const rawId = typeof candidate.id === 'string' ? candidate.id.trim() : '';
    const rawFolderId = typeof candidate.folder_id === 'string' ? candidate.folder_id.trim() : '';
    const rawName = typeof candidate.name === 'string' ? candidate.name : '';
    const sanitizedName = sanitizeUserText(rawName);
    const rawCharacter = candidate.character;
    const rawSequence = candidate.sequence;
    const rawUpdatedAt = candidate.updated_at;

    if (
      !rawId ||
      seenIds.has(rawId) ||
      !rawFolderId ||
      !validFolderIds.has(rawFolderId) ||
      !sanitizedName ||
      !isValidCharacterName(rawCharacter) ||
      !Array.isArray(rawSequence)
    ) {
      hadInvalidItems = true;
      continue;
    }

    const sanitizedSequence: ComboInputToken[] = [];
    for (const token of rawSequence) {
      if (isValidComboInputToken(token)) {
        sanitizedSequence.push(token);
      } else {
        hadInvalidItems = true;
      }
    }

    const updatedAt =
      typeof rawUpdatedAt === 'number' && Number.isFinite(rawUpdatedAt) && rawUpdatedAt > 0
        ? rawUpdatedAt
        : Date.now();

    seenIds.add(rawId);
    combos.push({
      id: rawId,
      folder_id: rawFolderId,
      name: sanitizedName,
      character: rawCharacter,
      sequence: sanitizedSequence,
      updated_at: updatedAt,
    });
  }

  return { combos, hadInvalidItems };
}

/**
 * Valida e normaliza o objeto de configurações (`settings`).
 */
export function validateAndNormalizeSettings(input: unknown): {
  settings: Settings;
  wasNormalized: boolean;
} {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      settings: { visual_preference: APP_CONFIG.defaults.visualPreference },
      wasNormalized: true,
    };
  }

  const candidate = input as Record<string, unknown>;
  if (!isValidVisualPreference(candidate.visual_preference)) {
    return {
      settings: { visual_preference: APP_CONFIG.defaults.visualPreference },
      wasNormalized: true,
    };
  }

  return {
    settings: { visual_preference: candidate.visual_preference },
    wasNormalized: false,
  };
}

/**
 * Valida e normaliza a estrutura de controle de migrations (`migrations`).
 */
export function validateAndNormalizeMigrationState(input: unknown): MigrationControlState {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      current_version: 0,
      executed: [],
    };
  }

  const candidate = input as Record<string, unknown>;
  const currentVersion =
    typeof candidate.current_version === 'number' &&
    Number.isInteger(candidate.current_version) &&
    candidate.current_version >= 0
      ? candidate.current_version
      : 0;

  const executed: MigrationEntry[] = [];
  if (Array.isArray(candidate.executed)) {
    for (const entry of candidate.executed) {
      if (!entry || typeof entry !== 'object') {
        continue;
      }
      const record = entry as Record<string, unknown>;
      if (
        typeof record.version === 'number' &&
        Number.isInteger(record.version) &&
        typeof record.name === 'string' &&
        typeof record.executed_at === 'string'
      ) {
        executed.push({
          version: record.version,
          name: record.name,
          executed_at: record.executed_at,
        });
      }
    }
  }

  return {
    current_version: currentVersion,
    executed,
  };
}
