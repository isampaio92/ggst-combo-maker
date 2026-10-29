import { APP_CONFIG } from '../config/config';
import { ensureDatabaseInitialized } from '../database/migrations';
import { recordLocalLog } from '../logs';
import {
  readRawJsonKey,
  validateAndNormalizeSettings,
  writeRawJsonKey,
} from './storage';
import {
  type Settings,
  type VisualPreference,
  isValidVisualPreference,
} from './types';

/**
 * Model da entidade Configurações (`settings` no Local Storage).
 * Gerencia a leitura e atualização da preferência visual ativa ("arrows" | "numpad").
 */
export const SettingsModel = {
  /**
   * Retorna as configurações salvas no Local Storage (ou o padrão configurado se ausente/inválido).
   */
  getSettings(): Settings {
    ensureDatabaseInitialized();
    const raw = readRawJsonKey(APP_CONFIG.storageKeys.settings);
    const { settings, wasNormalized } = validateAndNormalizeSettings(raw.value);

    if (!raw.exists || raw.corrupted || wasNormalized) {
      writeRawJsonKey(APP_CONFIG.storageKeys.settings, settings);
    }

    return settings;
  },

  /**
   * Atualiza e persiste a preferência visual de exibição (Setas ou Numpad).
   */
  updateVisualPreference(preference: VisualPreference): Settings | null {
    ensureDatabaseInitialized();

    if (!isValidVisualPreference(preference)) {
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: 'Preferência de exibição visual inválida.',
        context: 'SettingsModel.updateVisualPreference',
      });
      return null;
    }

    const updated: Settings = {
      visual_preference: preference,
    };

    const saved = writeRawJsonKey(APP_CONFIG.storageKeys.settings, updated);
    return saved ? updated : null;
  },
};
