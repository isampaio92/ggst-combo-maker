import { APP_CONFIG } from '../../config/config';
import { recordLocalLog } from '../../logs';
import {
  readRawJsonKey,
  validateAndNormalizeCombos,
  validateAndNormalizeFolders,
  validateAndNormalizeMigrationState,
  validateAndNormalizeSettings,
  writeRawJsonKey,
} from '../../models/storage';
import type { MigrationControlState } from '../../models/types';
import { migration001InitSchema } from './001_init_schema';

/**
 * Arquitetura de Migrations para Local Storage (FSD seção 11).
 * Scripts versionados acionados silenciosamente pelo ciclo de inicialização da aplicação React,
 * garantindo a criação, versão e integridade das chaves lógicas sem execuções duplicadas.
 */

export interface MigrationScript {
  version: number;
  name: string;
  up: () => boolean;
}

const REGISTERED_MIGRATIONS: readonly MigrationScript[] = [migration001InitSchema];

let hasInitializedInMemory = false;

/**
 * Verifica se todas as chaves lógicas obrigatórias (`folders`, `combos`, `settings`) existem e são íntegras.
 */
function ensureLogicalTablesIntegrity(): boolean {
  const { folders: foldersKey, combos: combosKey, settings: settingsKey } =
    APP_CONFIG.storageKeys;

  const rawFolders = readRawJsonKey(foldersKey);
  const rawCombos = readRawJsonKey(combosKey);
  const rawSettings = readRawJsonKey(settingsKey);

  const { folders, hadInvalidItems: invalidFolders } = validateAndNormalizeFolders(
    rawFolders.value
  );
  const { combos, hadInvalidItems: invalidCombos } = validateAndNormalizeCombos(
    rawCombos.value,
    folders
  );
  const { settings, wasNormalized: invalidSettings } = validateAndNormalizeSettings(
    rawSettings.value
  );

  let ok = true;

  if (!rawFolders.exists || rawFolders.corrupted || invalidFolders) {
    ok = writeRawJsonKey(foldersKey, folders) && ok;
  }

  if (!rawCombos.exists || rawCombos.corrupted || invalidCombos) {
    ok = writeRawJsonKey(combosKey, combos) && ok;
  }

  if (!rawSettings.exists || rawSettings.corrupted || invalidSettings) {
    ok = writeRawJsonKey(settingsKey, settings) && ok;
  }

  return ok;
}

/**
 * Executa silenciosamente as migrations pendentes e valida a integridade das chaves lógicas.
 * Evita execuções duplicadas através da chave de controle `ggst_cm_migrations` no Local Storage.
 */
export function runDatabaseMigrations(): MigrationControlState {
  const migrationsKey = APP_CONFIG.storageKeys.migrations;
  const rawMigrationState = readRawJsonKey(migrationsKey);
  const state = validateAndNormalizeMigrationState(rawMigrationState.value);

  const executedVersions = new Set(state.executed.map((item) => item.version));
  const pendingMigrations = REGISTERED_MIGRATIONS.filter(
    (migration) =>
      migration.version > state.current_version || !executedVersions.has(migration.version)
  ).sort((a, b) => a.version - b.version);

  let stateUpdated = !rawMigrationState.exists || rawMigrationState.corrupted;

  for (const migration of pendingMigrations) {
    try {
      const success = migration.up();
      if (!success) {
        recordLocalLog({
          level: 'error',
          code: 'MIGRATION_FAILED',
          userMessage: 'Não foi possível inicializar a estrutura de armazenamento local.',
          context: `runDatabaseMigrations(${migration.name})`,
        });
        break;
      }

      if (!executedVersions.has(migration.version)) {
        state.executed.push({
          version: migration.version,
          name: migration.name,
          executed_at: new Date().toISOString(),
        });
        executedVersions.add(migration.version);
      }

      if (migration.version > state.current_version) {
        state.current_version = migration.version;
      }

      stateUpdated = true;
    } catch (error) {
      recordLocalLog({
        level: 'error',
        code: 'MIGRATION_FAILED',
        userMessage: 'Erro inesperado ao atualizar a estrutura de dados local.',
        context: `runDatabaseMigrations(${migration.name})`,
        technicalDetails: error,
      });
      break;
    }
  }

  // Mesmo quando as migrations já foram executadas anteriormente, garante que nenhuma chave lógica
  // tenha sido apagada ou corrompida manualmente no navegador (FSD seção 11 e AGENTS.md seção 7.4).
  ensureLogicalTablesIntegrity();

  if (stateUpdated) {
    writeRawJsonKey(migrationsKey, state);
  }

  hasInitializedInMemory = true;
  return state;
}

/**
 * Garante que o banco local foi inicializado na sessão atual antes de operações de leitura/escrita.
 */
export function ensureDatabaseInitialized(): void {
  if (!hasInitializedInMemory) {
    runDatabaseMigrations();
  }
}
