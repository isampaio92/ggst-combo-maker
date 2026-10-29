import { useCallback, useEffect, useState } from 'react';
import { type CharacterName } from '../config/config';
import { runDatabaseMigrations } from '../database/migrations';
import {
  type LocalLogEntry,
  clearSessionLogs,
  dismissLocalLog,
  getSessionLogs,
  subscribeToLocalLogs,
} from '../logs';
import {
  type Combo,
  type ComboInputToken,
  ComboModel,
  type Folder,
  FolderModel,
  type MigrationControlState,
  type SaveComboResult,
  type Settings,
  SettingsModel,
  type VisualPreference,
} from '../models';

/**
 * Camada Controller (MVC)
 * Hooks customizados e controladores que acionam silenciosamente as migrations na inicialização
 * da aplicação React e conectam a View aos Models de pastas, combos, configurações e logs locais.
 */

export interface AppControllerState {
  isInitialized: boolean;
  migrationState: MigrationControlState | null;
  folders: Folder[];
  combos: Combo[];
  settings: Settings;
  logs: readonly LocalLogEntry[];
}

export interface AppControllerActions {
  refreshAll: () => void;
  setVisualPreference: (preference: VisualPreference) => Settings | null;
  toggleVisualPreference: () => Settings | null;
  createFolder: (name: string) => Folder | null;
  renameFolder: (folderId: string, newName: string) => Folder | null;
  deleteFolder: (folderId: string) => boolean;
  saveCombo: (params: {
    id?: string;
    name: string;
    character: CharacterName;
    sequence: readonly ComboInputToken[];
    folderId?: string;
    allowOverwrite?: boolean;
  }) => SaveComboResult;
  renameCombo: (comboId: string, newName: string) => Combo | null;
  moveComboToFolder: (comboId: string, targetFolderId: string) => Combo | null;
  deleteCombo: (comboId: string) => boolean;
  dismissLog: (logId: string) => void;
  clearLogs: () => void;
}

export type UseAppControllerReturn = AppControllerState & AppControllerActions;

/**
 * Hook principal do Controller que inicializa o banco local via migrations
 * e fornece estado sincronizado e ações para configurações, pastas, combos e logs.
 */
export function useAppController(): UseAppControllerReturn {
  const [migrationState, setMigrationState] = useState<MigrationControlState | null>(() =>
    runDatabaseMigrations()
  );
  const [folders, setFolders] = useState<Folder[]>(() => FolderModel.getAll());
  const [combos, setCombos] = useState<Combo[]>(() => ComboModel.getAll());
  const [settings, setSettings] = useState<Settings>(() => SettingsModel.getSettings());
  const [logs, setLogs] = useState<readonly LocalLogEntry[]>(() => getSessionLogs());

  useEffect(() => {
    const currentMigrations = runDatabaseMigrations();
    setMigrationState(currentMigrations);
    setFolders(FolderModel.getAll());
    setCombos(ComboModel.getAll());
    setSettings(SettingsModel.getSettings());
  }, []);

  useEffect(() => {
    return subscribeToLocalLogs((updatedLogs) => {
      setLogs(updatedLogs);
    });
  }, []);

  const refreshAll = useCallback(() => {
    setFolders(FolderModel.getAll());
    setCombos(ComboModel.getAll());
    setSettings(SettingsModel.getSettings());
  }, []);

  const setVisualPreference = useCallback((preference: VisualPreference): Settings | null => {
    const updated = SettingsModel.updateVisualPreference(preference);
    if (updated) {
      setSettings(updated);
    }
    return updated;
  }, []);

  const toggleVisualPreference = useCallback((): Settings | null => {
    const nextPreference: VisualPreference =
      settings.visual_preference === 'arrows' ? 'numpad' : 'arrows';
    return setVisualPreference(nextPreference);
  }, [settings.visual_preference, setVisualPreference]);

  const createFolder = useCallback((name: string): Folder | null => {
    const created = FolderModel.create(name);
    if (created) {
      setFolders(FolderModel.getAll());
    }
    return created;
  }, []);

  const renameFolder = useCallback((folderId: string, newName: string): Folder | null => {
    const updated = FolderModel.rename(folderId, newName);
    if (updated) {
      setFolders(FolderModel.getAll());
    }
    return updated;
  }, []);

  const deleteFolder = useCallback((folderId: string): boolean => {
    const deleted = FolderModel.delete(folderId);
    if (deleted) {
      setFolders(FolderModel.getAll());
      setCombos(ComboModel.getAll());
    }
    return deleted;
  }, []);

  const saveCombo = useCallback(
    (params: {
      id?: string;
      name: string;
      character: CharacterName;
      sequence: readonly ComboInputToken[];
      folderId?: string;
      allowOverwrite?: boolean;
    }): SaveComboResult => {
      const result = ComboModel.save(params);
      if (result.status === 'saved') {
        setFolders(FolderModel.getAll());
        setCombos(ComboModel.getAll());
      }
      return result;
    },
    []
  );

  const renameCombo = useCallback((comboId: string, newName: string): Combo | null => {
    const updated = ComboModel.rename(comboId, newName);
    if (updated) {
      setCombos(ComboModel.getAll());
    }
    return updated;
  }, []);

  const moveComboToFolder = useCallback(
    (comboId: string, targetFolderId: string): Combo | null => {
      const moved = ComboModel.moveToFolder(comboId, targetFolderId);
      if (moved) {
        setCombos(ComboModel.getAll());
      }
      return moved;
    },
    []
  );

  const deleteCombo = useCallback((comboId: string): boolean => {
    const deleted = ComboModel.delete(comboId);
    if (deleted) {
      setCombos(ComboModel.getAll());
    }
    return deleted;
  }, []);

  const dismissLog = useCallback((logId: string): void => {
    dismissLocalLog(logId);
  }, []);

  const clearLogs = useCallback((): void => {
    clearSessionLogs();
  }, []);

  return {
    isInitialized: migrationState !== null,
    migrationState,
    folders,
    combos,
    settings,
    logs,
    refreshAll,
    setVisualPreference,
    toggleVisualPreference,
    createFolder,
    renameFolder,
    deleteFolder,
    saveCombo,
    renameCombo,
    moveComboToFolder,
    deleteCombo,
    dismissLog,
    clearLogs,
  };
}
