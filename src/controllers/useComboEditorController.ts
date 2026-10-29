import { useCallback, useState } from 'react';
import { type CharacterName } from '../config/config';
import { recordLocalLog } from '../logs';
import {
  type Combo,
  type ComboInputToken,
  type Folder,
  MAX_COMBO_SEQUENCE_LENGTH,
  type SaveComboResult,
  isValidComboInputToken,
  sanitizeCharacterSelection,
  sanitizeUserText,
} from '../models';

/**
 * Estado do rascunho de um combo aberto na área de Criação / Edição.
 */
export interface ComboDraftState {
  id?: string;
  folderId?: string;
  name: string;
  character: CharacterName;
  sequence: ComboInputToken[];
}

/**
 * Estado do aviso de duplicidade de nome na mesma pasta (FSD seção 14),
 * aguardando confirmação do usuário para sobrescrever o combo existente.
 */
export interface DuplicateComboWarningState {
  existingCombo: Combo;
  folderName: string;
  message: string;
}

/**
 * Valida os campos do Modal Inicial de Novo Combo (nome obrigatório + personagem válido da lista fixa de 33).
 */
export function validateNewComboMetadata(
  rawName: string,
  rawCharacter: string
):
  | { valid: true; cleanName: string; character: CharacterName }
  | { valid: false; errorMessage: string } {
  const cleanName = sanitizeUserText(rawName);
  if (!cleanName) {
    return {
      valid: false,
      errorMessage: 'Informe um nome válido para o combo antes de continuar.',
    };
  }

  const cleanCharacter = sanitizeCharacterSelection(rawCharacter);
  if (!cleanCharacter) {
    return {
      valid: false,
      errorMessage: 'Selecione um personagem válido da lista oficial de 33 personagens.',
    };
  }

  return {
    valid: true,
    cleanName,
    character: cleanCharacter,
  };
}

/**
 * Função pura que insere um token válido sempre ao final da fila sequencial (FSD seção 6 e 7).
 */
export function appendInputToken(
  sequence: readonly ComboInputToken[],
  token: ComboInputToken
): ComboInputToken[] {
  if (!isValidComboInputToken(token) || sequence.length >= MAX_COMBO_SEQUENCE_LENGTH) {
    return [...sequence];
  }
  return [...sequence, token];
}

/**
 * Função pura para a ação "Desfazer": remove o último token inserido,
 * um a um, de trás para frente, incluindo modificadores (FSD seção 6).
 */
export function undoLastInputToken(
  sequence: readonly ComboInputToken[]
): ComboInputToken[] {
  if (sequence.length === 0) {
    return [];
  }
  return sequence.slice(0, -1);
}

export interface UseComboEditorControllerParams {
  folders: readonly Folder[];
  saveCombo: (params: {
    id?: string;
    name: string;
    character: CharacterName;
    sequence: readonly ComboInputToken[];
    folderId?: string;
    allowOverwrite?: boolean;
  }) => SaveComboResult;
  onComboSaved: (savedCombo: Combo) => void;
}

/**
 * Hook Controller do Módulo de Criação e Edição de Combos (Fase 4).
 * Gerencia o popup obrigatório inicial de Novo Combo, a montagem sequencial via paleta visual,
 * a ação de Desfazer e o salvamento com criação automática da pasta do personagem e confirmação de sobrescrita.
 */
export function useComboEditorController(params: UseComboEditorControllerParams) {
  const { folders, saveCombo, onComboSaved } = params;

  // Estado do Modal Obrigatório Inicial ("Novo Combo")
  const [isNewComboModalOpen, setIsNewComboModalOpen] = useState(false);
  const [modalComboName, setModalComboName] = useState('');
  const [modalCharacter, setModalCharacter] = useState<string>('');
  const [modalError, setModalError] = useState<string | null>(null);

  // Estado do Editor ativo (liberado somente após aprovação do modal ou início de edição de um combo existente)
  const [activeDraft, setActiveDraft] = useState<ComboDraftState | null>(null);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [editorSuccessMessage, setEditorSuccessMessage] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] =
    useState<DuplicateComboWarningState | null>(null);

  // --- Fluxo do Modal Obrigatório Inicial ("Novo Combo") ---
  const openNewComboModal = useCallback((defaultCharacter?: CharacterName) => {
    setModalComboName('');
    setModalCharacter(defaultCharacter ?? '');
    setModalError(null);
    setIsNewComboModalOpen(true);
  }, []);

  const closeNewComboModal = useCallback(() => {
    setIsNewComboModalOpen(false);
    setModalError(null);
  }, []);

  const handleModalComboNameChange = useCallback((value: string) => {
    setModalComboName(value);
    setModalError(null);
  }, []);

  const handleModalCharacterChange = useCallback((value: string) => {
    setModalCharacter(value);
    setModalError(null);
  }, []);

  const confirmNewComboModal = useCallback((): boolean => {
    const validation = validateNewComboMetadata(modalComboName, modalCharacter);
    if (!validation.valid) {
      setModalError(validation.errorMessage);
      recordLocalLog({
        level: 'error',
        code: 'VALIDATION_ERROR',
        userMessage: validation.errorMessage,
        context: 'useComboEditorController.confirmNewComboModal',
      });
      return false;
    }

    setActiveDraft({
      name: validation.cleanName,
      character: validation.character,
      sequence: [],
    });
    setEditorError(null);
    setEditorSuccessMessage(null);
    setDuplicateWarning(null);
    setIsNewComboModalOpen(false);
    return true;
  }, [modalComboName, modalCharacter]);

  // --- Carregar um combo existente para edição ---
  const startEditingExistingCombo = useCallback((combo: Combo) => {
    setActiveDraft({
      id: combo.id,
      folderId: combo.folder_id,
      name: combo.name,
      character: combo.character,
      sequence: [...combo.sequence],
    });
    setEditorError(null);
    setEditorSuccessMessage(null);
    setDuplicateWarning(null);
    setIsNewComboModalOpen(false);
  }, []);

  // --- Fechar/Cancelar o editor ativo ---
  const closeEditor = useCallback(() => {
    setActiveDraft(null);
    setEditorError(null);
    setEditorSuccessMessage(null);
    setDuplicateWarning(null);
  }, []);

  // --- Inserção no final da sequência e Desfazer ---
  const addInputToSequence = useCallback((token: ComboInputToken) => {
    setActiveDraft((prev) => {
      if (!prev) {
        return null;
      }
      return {
        ...prev,
        sequence: appendInputToken(prev.sequence, token),
      };
    });
    setEditorError(null);
    setEditorSuccessMessage(null);
  }, []);

  const undoLastInput = useCallback(() => {
    setActiveDraft((prev) => {
      if (!prev || prev.sequence.length === 0) {
        return prev;
      }
      return {
        ...prev,
        sequence: undoLastInputToken(prev.sequence),
      };
    });
    setEditorError(null);
    setEditorSuccessMessage(null);
  }, []);

  const updateDraftName = useCallback((newName: string) => {
    setActiveDraft((prev) => (prev ? { ...prev, name: newName } : null));
    setEditorError(null);
    setEditorSuccessMessage(null);
  }, []);

  // --- Salvamento e tratamento de aviso de duplicidade (sobrescrita) ---
  const handleSaveDraft = useCallback(
    (allowOverwrite = false): SaveComboResult | null => {
      if (!activeDraft) {
        return null;
      }

      const cleanName = sanitizeUserText(activeDraft.name);
      if (!cleanName) {
        const message = 'O nome do combo não pode ficar vazio.';
        setEditorError(message);
        recordLocalLog({
          level: 'error',
          code: 'VALIDATION_ERROR',
          userMessage: message,
          context: 'useComboEditorController.handleSaveDraft(emptyName)',
        });
        return { status: 'error', message };
      }

      if (activeDraft.sequence.length === 0) {
        const message =
          'Adicione pelo menos um botão na paleta antes de salvar o combo.';
        setEditorError(message);
        recordLocalLog({
          level: 'error',
          code: 'VALIDATION_ERROR',
          userMessage: message,
          context: 'useComboEditorController.handleSaveDraft(emptySequence)',
        });
        return { status: 'error', message };
      }

      const result = saveCombo({
        id: activeDraft.id,
        folderId: activeDraft.folderId,
        name: cleanName,
        character: activeDraft.character,
        sequence: activeDraft.sequence,
        allowOverwrite,
      });

      if (result.status === 'duplicate_warning') {
        const targetFolder = folders.find(
          (f) => f.id === result.existingCombo.folder_id
        );
        setDuplicateWarning({
          existingCombo: result.existingCombo,
          folderName: targetFolder?.name ?? activeDraft.character,
          message: result.message,
        });
        return result;
      }

      if (result.status === 'error') {
        setEditorError(result.message);
        return result;
      }

      // Salvo com sucesso
      setDuplicateWarning(null);
      setEditorError(null);
      setActiveDraft({
        id: result.combo.id,
        folderId: result.combo.folder_id,
        name: result.combo.name,
        character: result.combo.character,
        sequence: [...result.combo.sequence],
      });
      setEditorSuccessMessage(
        result.overwritten
          ? `Combo "${result.combo.name}" atualizado com sucesso!`
          : `Combo "${result.combo.name}" salvo na pasta "${result.combo.character}"!`
      );
      onComboSaved(result.combo);
      return result;
    },
    [activeDraft, folders, saveCombo, onComboSaved]
  );

  const confirmOverwriteDuplicate = useCallback((): SaveComboResult | null => {
    return handleSaveDraft(true);
  }, [handleSaveDraft]);

  const cancelOverwriteDuplicate = useCallback(() => {
    setDuplicateWarning(null);
  }, []);

  return {
    isNewComboModalOpen,
    modalComboName,
    modalCharacter,
    modalError,
    activeDraft,
    editorError,
    editorSuccessMessage,
    duplicateWarning,
    openNewComboModal,
    closeNewComboModal,
    handleModalComboNameChange,
    handleModalCharacterChange,
    confirmNewComboModal,
    startEditingExistingCombo,
    closeEditor,
    addInputToSequence,
    undoLastInput,
    updateDraftName,
    handleSaveDraft,
    confirmOverwriteDuplicate,
    cancelOverwriteDuplicate,
  };
}
