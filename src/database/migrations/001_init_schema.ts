import { APP_CONFIG } from '../../config/config';
import { recordLocalLog } from '../../logs';
import {
  readRawJsonKey,
  validateAndNormalizeCombos,
  validateAndNormalizeFolders,
  validateAndNormalizeSettings,
  writeRawJsonKey,
} from '../../models/storage';

/**
 * Migration 001: Inicialização e validação estrutural das tabelas lógicas no Local Storage.
 * Cria ou repara `folders`, `combos` e `settings` garantindo as constraints do schema JSON (FSD seção 11).
 */
export const migration001InitSchema = {
  version: 1,
  name: '001_init_local_storage_schema',
  up(): boolean {
    const { folders: foldersKey, combos: combosKey, settings: settingsKey } =
      APP_CONFIG.storageKeys;

    // 1. Inicializar / validar tabela lógica `folders`
    const rawFolders = readRawJsonKey(foldersKey);
    const { folders, hadInvalidItems: invalidFolders } = validateAndNormalizeFolders(
      rawFolders.value
    );

    if (!rawFolders.exists || rawFolders.corrupted || invalidFolders) {
      if (invalidFolders && rawFolders.exists && !rawFolders.corrupted) {
        recordLocalLog({
          level: 'warning',
          code: 'STORAGE_SCHEMA_INVALID',
          userMessage: 'Registros inválidos de pastas foram higienizados automaticamente.',
          context: 'migration001InitSchema(folders)',
        });
      }
      if (!writeRawJsonKey(foldersKey, folders)) {
        return false;
      }
    }

    // 2. Inicializar / validar tabela lógica `combos` (com integridade referencial para `folders`)
    const rawCombos = readRawJsonKey(combosKey);
    const { combos, hadInvalidItems: invalidCombos } = validateAndNormalizeCombos(
      rawCombos.value,
      folders
    );

    if (!rawCombos.exists || rawCombos.corrupted || invalidCombos) {
      if (invalidCombos && rawCombos.exists && !rawCombos.corrupted) {
        recordLocalLog({
          level: 'warning',
          code: 'STORAGE_SCHEMA_INVALID',
          userMessage: 'Registros inválidos de combos foram higienizados automaticamente.',
          context: 'migration001InitSchema(combos)',
        });
      }
      if (!writeRawJsonKey(combosKey, combos)) {
        return false;
      }
    }

    // 3. Inicializar / validar tabela lógica `settings`
    const rawSettings = readRawJsonKey(settingsKey);
    const { settings, wasNormalized: settingsNormalized } = validateAndNormalizeSettings(
      rawSettings.value
    );

    if (!rawSettings.exists || rawSettings.corrupted || settingsNormalized) {
      if (!writeRawJsonKey(settingsKey, settings)) {
        return false;
      }
    }

    return true;
  },
};
