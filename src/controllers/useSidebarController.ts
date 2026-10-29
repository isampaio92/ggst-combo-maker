import { useCallback, useMemo, useState } from 'react';
import { recordLocalLog } from '../logs';
import {
  type Combo,
  type Folder,
  sanitizeUserText,
  sortCombosByUpdatedAtDesc,
  sortFoldersAlphabetically,
} from '../models';

/**
 * Representa uma pasta indexada com sua lista de combos internos já ordenada.
 */
export interface IndexedFolderWithCombos {
  folder: Folder;
  combos: Combo[];
}

/**
 * Estado do item em edição de nome (via ícone de lápis na Sidebar).
 */
export interface EditingEntityState {
  type: 'folder' | 'combo';
  id: string;
  draftName: string;
  errorMessage: string | null;
}

/**
 * Estado da solicitação de exclusão definitiva aguardando confirmação obrigatória.
 */
export interface PendingDeletionState {
  type: 'folder' | 'combo';
  id: string;
  name: string;
  combosCount?: number;
}

/**
 * Função pura que constrói o índice de pastas em ordem alfabética
 * e seus combos internos em ordem decrescente de `updated_at` (FSD seções 11, 14 e 22).
 */
export function buildIndexedFolderTree(
  folders: readonly Folder[],
  combos: readonly Combo[]
): IndexedFolderWithCombos[] {
  const sortedFolders = sortFoldersAlphabetically(folders);
  const combosByFolder = new Map<string, Combo[]>();

  for (const folder of sortedFolders) {
    combosByFolder.set(folder.id, []);
  }

  for (const combo of combos) {
    const bucket = combosByFolder.get(combo.folder_id);
    if (bucket) {
      bucket.push(combo);
    }
  }

  return sortedFolders.map((folder) => ({
    folder,
    combos: sortCombosByUpdatedAtDesc(combosByFolder.get(folder.id) ?? []),
  }));
}

/**
 * Valida se o nome de uma pasta (para criação ou renomeação) é válido e único no mesmo nível.
 */
export function validateFolderNameUniqueness(
  rawName: string,
  existingFolders: readonly Folder[],
  excludeFolderId?: string
): { valid: true; cleanName: string } | { valid: false; errorMessage: string } {
  const cleanName = sanitizeUserText(rawName);
  if (!cleanName) {
    return {
      valid: false,
      errorMessage: 'O nome da pasta não pode ficar vazio.',
    };
  }

  const duplicate = existingFolders.some(
    (folder) =>
      folder.id !== excludeFolderId &&
      folder.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (duplicate) {
    return {
      valid: false,
      errorMessage: `Já existe uma pasta chamada "${cleanName}". Escolha um nome único.`,
    };
  }

  return { valid: true, cleanName };
}

/**
 * Valida se o novo nome de um combo é válido e único dentro da mesma pasta (FSD seção 14).
 */
export function validateComboRenameUniqueness(
  rawName: string,
  folderId: string,
  existingCombos: readonly Combo[],
  excludeComboId: string
): { valid: true; cleanName: string } | { valid: false; errorMessage: string } {
  const cleanName = sanitizeUserText(rawName);
  if (!cleanName) {
    return {
      valid: false,
      errorMessage: 'O nome do combo não pode ficar vazio.',
    };
  }

  const duplicate = existingCombos.some(
    (combo) =>
      combo.folder_id === folderId &&
      combo.id !== excludeComboId &&
      combo.name.toLowerCase() === cleanName.toLowerCase()
  );

  if (duplicate) {
    return {
      valid: false,
      errorMessage: `Já existe um combo chamado "${cleanName}" nesta pasta. Escolha um nome único.`,
    };
  }

  return { valid: true, cleanName };
}

export interface UseSidebarControllerParams {
  folders: readonly Folder[];
  combos: readonly Combo[];
  selectedComboId: string | null;
  onSelectCombo: (comboId: string | null) => void;
  createFolder: (name: string) => Folder | null;
  renameFolder: (folderId: string, newName: string) => Folder | null;
  deleteFolder: (folderId: string) => boolean;
  renameCombo: (comboId: string, newName: string) => Combo | null;
  moveComboToFolder: (comboId: string, targetFolderId: string) => Combo | null;
  deleteCombo: (comboId: string) => boolean;
}

/**
 * Hook Controller dedicado ao Módulo de Organização (Sidebar):
 * Gerencia criação manual de pastas, renomeação com bloqueio de duplicidade,
 * exclusão definitiva com modal de confirmação e Drag and Drop de combos entre pastas.
 */
export function useSidebarController(params: UseSidebarControllerParams) {
  const {
    folders,
    combos,
    selectedComboId,
    onSelectCombo,
    createFolder,
    renameFolder,
    deleteFolder,
    renameCombo,
    moveComboToFolder,
    deleteCombo,
  } = params;

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [createFolderError, setCreateFolderError] = useState<string | null>(null);

  const [collapsedFolderIds, setCollapsedFolderIds] = useState<Record<string, boolean>>({});
  const [editingEntity, setEditingEntity] = useState<EditingEntityState | null>(null);
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletionState | null>(null);

  const [draggedComboId, setDraggedComboId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  // Índice computado: pastas em ordem alfabética e combos internos por updated_at decrescente
  const indexedTree = useMemo(
    () => buildIndexedFolderTree(folders, combos),
    [folders, combos]
  );

  const isEmptyState = folders.length === 0 && combos.length === 0;

  // --- Controle de expansão/recolhimento de pastas ---
  const toggleFolderExpand = useCallback((folderId: string) => {
    setCollapsedFolderIds((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  }, []);

  const isFolderExpanded = useCallback(
    (folderId: string): boolean => !collapsedFolderIds[folderId],
    [collapsedFolderIds]
  );

  // --- Criação manual de pastas livres ---
  const openCreateFolderForm = useCallback(() => {
    setIsCreatingFolder(true);
    setNewFolderName('');
    setCreateFolderError(null);
    setEditingEntity(null);
  }, []);

  const cancelCreateFolderForm = useCallback(() => {
    setIsCreatingFolder(false);
    setNewFolderName('');
    setCreateFolderError(null);
  }, []);

  const handleNewFolderNameChange = useCallback((value: string) => {
    setNewFolderName(value);
    setCreateFolderError(null);
  }, []);

  const submitCreateFolder = useCallback((): Folder | null => {
    const validation = validateFolderNameUniqueness(newFolderName, folders);
    if (!validation.valid) {
      setCreateFolderError(validation.errorMessage);
      recordLocalLog({
        level: 'error',
        code: 'DUPLICATE_NAME_ERROR',
        userMessage: validation.errorMessage,
        context: 'useSidebarController.submitCreateFolder',
      });
      return null;
    }

    const created = createFolder(validation.cleanName);
    if (!created) {
      setCreateFolderError('Não foi possível criar a pasta. Verifique o nome informado.');
      return null;
    }

    setNewFolderName('');
    setCreateFolderError(null);
    setIsCreatingFolder(false);
    setCollapsedFolderIds((prev) => ({
      ...prev,
      [created.id]: false,
    }));
    return created;
  }, [newFolderName, folders, createFolder]);

  // --- Renomeação via ícone de lápis (Pastas e Combos) ---
  const startRenameFolder = useCallback((folder: Folder) => {
    setIsCreatingFolder(false);
    setEditingEntity({
      type: 'folder',
      id: folder.id,
      draftName: folder.name,
      errorMessage: null,
    });
  }, []);

  const startRenameCombo = useCallback((combo: Combo) => {
    setIsCreatingFolder(false);
    setEditingEntity({
      type: 'combo',
      id: combo.id,
      draftName: combo.name,
      errorMessage: null,
    });
  }, []);

  const updateEditingDraftName = useCallback((value: string) => {
    setEditingEntity((prev) =>
      prev
        ? {
            ...prev,
            draftName: value,
            errorMessage: null,
          }
        : null
    );
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingEntity(null);
  }, []);

  const submitRename = useCallback((): boolean => {
    if (!editingEntity) {
      return false;
    }

    if (editingEntity.type === 'folder') {
      const validation = validateFolderNameUniqueness(
        editingEntity.draftName,
        folders,
        editingEntity.id
      );

      if (!validation.valid) {
        setEditingEntity((prev) =>
          prev ? { ...prev, errorMessage: validation.errorMessage } : null
        );
        recordLocalLog({
          level: 'error',
          code: 'DUPLICATE_NAME_ERROR',
          userMessage: validation.errorMessage,
          context: 'useSidebarController.submitRename(folder)',
        });
        return false;
      }

      const updated = renameFolder(editingEntity.id, validation.cleanName);
      if (!updated) {
        setEditingEntity((prev) =>
          prev
            ? {
                ...prev,
                errorMessage: 'Não foi possível renomear a pasta. Escolha um nome único.',
              }
            : null
        );
        return false;
      }

      setEditingEntity(null);
      return true;
    }

    // Renomeação de combo
    const targetCombo = combos.find((combo) => combo.id === editingEntity.id);
    if (!targetCombo) {
      setEditingEntity(null);
      return false;
    }

    const validation = validateComboRenameUniqueness(
      editingEntity.draftName,
      targetCombo.folder_id,
      combos,
      targetCombo.id
    );

    if (!validation.valid) {
      setEditingEntity((prev) =>
        prev ? { ...prev, errorMessage: validation.errorMessage } : null
      );
      recordLocalLog({
        level: 'error',
        code: 'DUPLICATE_NAME_ERROR',
        userMessage: validation.errorMessage,
        context: 'useSidebarController.submitRename(combo)',
      });
      return false;
    }

    const updated = renameCombo(targetCombo.id, validation.cleanName);
    if (!updated) {
      setEditingEntity((prev) =>
        prev
          ? {
              ...prev,
              errorMessage: 'Não foi possível renomear o combo. Escolha um nome único.',
            }
          : null
      );
      return false;
    }

    setEditingEntity(null);
    return true;
  }, [editingEntity, folders, combos, renameFolder, renameCombo]);

  // --- Exclusão definitiva com confirmação obrigatória ---
  const requestDeleteFolder = useCallback(
    (folder: Folder) => {
      const folderCombosCount = combos.filter((c) => c.folder_id === folder.id).length;
      setPendingDeletion({
        type: 'folder',
        id: folder.id,
        name: folder.name,
        combosCount: folderCombosCount,
      });
    },
    [combos]
  );

  const requestDeleteCombo = useCallback((combo: Combo) => {
    setPendingDeletion({
      type: 'combo',
      id: combo.id,
      name: combo.name,
    });
  }, []);

  const cancelPendingDeletion = useCallback(() => {
    setPendingDeletion(null);
  }, []);

  const confirmPendingDeletion = useCallback((): boolean => {
    if (!pendingDeletion) {
      return false;
    }

    if (pendingDeletion.type === 'folder') {
      const selectedComboInFolder = combos.some(
        (c) => c.id === selectedComboId && c.folder_id === pendingDeletion.id
      );
      const deleted = deleteFolder(pendingDeletion.id);
      if (deleted && selectedComboInFolder) {
        onSelectCombo(null);
      }
      setPendingDeletion(null);
      return deleted;
    }

    const deleted = deleteCombo(pendingDeletion.id);
    if (deleted && selectedComboId === pendingDeletion.id) {
      onSelectCombo(null);
    }
    setPendingDeletion(null);
    return deleted;
  }, [pendingDeletion, combos, selectedComboId, deleteFolder, deleteCombo, onSelectCombo]);

  // --- Drag and Drop de combos entre pastas (preservando updated_at) ---
  const handleComboDragStart = useCallback((comboId: string) => {
    setDraggedComboId(comboId);
  }, []);

  const handleComboDragEnd = useCallback(() => {
    setDraggedComboId(null);
    setDragOverFolderId(null);
  }, []);

  const handleFolderDragOver = useCallback((folderId: string) => {
    setDragOverFolderId((prev) => (prev === folderId ? prev : folderId));
  }, []);

  const handleFolderDragLeave = useCallback((folderId: string) => {
    setDragOverFolderId((prev) => (prev === folderId ? null : prev));
  }, []);

  const handleFolderDrop = useCallback(
    (targetFolderId: string, explicitComboId?: string): Combo | null => {
      const sourceComboId = explicitComboId || draggedComboId;
      setDraggedComboId(null);
      setDragOverFolderId(null);

      if (!sourceComboId) {
        return null;
      }

      const moved = moveComboToFolder(sourceComboId, targetFolderId);
      if (moved) {
        // Garante que a pasta de destino esteja expandida ao receber o combo
        setCollapsedFolderIds((prev) => ({
          ...prev,
          [targetFolderId]: false,
        }));
      }
      return moved;
    },
    [draggedComboId, moveComboToFolder]
  );

  return {
    indexedTree,
    isEmptyState,
    isCreatingFolder,
    newFolderName,
    createFolderError,
    editingEntity,
    pendingDeletion,
    draggedComboId,
    dragOverFolderId,
    isFolderExpanded,
    toggleFolderExpand,
    openCreateFolderForm,
    cancelCreateFolderForm,
    handleNewFolderNameChange,
    submitCreateFolder,
    startRenameFolder,
    startRenameCombo,
    updateEditingDraftName,
    cancelEditing,
    submitRename,
    requestDeleteFolder,
    requestDeleteCombo,
    cancelPendingDeletion,
    confirmPendingDeletion,
    handleComboDragStart,
    handleComboDragEnd,
    handleFolderDragOver,
    handleFolderDragLeave,
    handleFolderDrop,
  };
}
