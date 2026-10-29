import React, { useEffect } from 'react';
import { type PendingDeletionState } from '../controllers';

export interface ConfirmDeleteModalProps {
  pendingDeletion: PendingDeletionState | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal obrigatório de confirmação de exclusão definitiva (FSD seção 18 e DESIGN.md seções 5, 8 e 9).
 * Não há soft delete ou lixeira: a exclusão remove permanentemente o registro do Local Storage.
 */
export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  pendingDeletion,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!pendingDeletion) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pendingDeletion, onCancel]);

  if (!pendingDeletion) {
    return null;
  }

  const isFolder = pendingDeletion.type === 'folder';
  const combosCount = pendingDeletion.combosCount ?? 0;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      onClick={onCancel}
    >
      <div
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-delete-title" className="modal-card__title">
          {isFolder ? 'EXCLUIR PASTA DEFINITIVAMENTE?' : 'EXCLUIR COMBO DEFINITIVAMENTE?'}
        </h2>

        <p className="modal-card__description">
          {isFolder ? (
            <>
              Você está prestes a excluir a pasta{' '}
              <strong>&ldquo;{pendingDeletion.name}&rdquo;</strong>.
              {combosCount > 0 && (
                <>
                  {' '}
                  Esta ação também excluirá permanentemente{' '}
                  <strong>
                    {combosCount} {combosCount === 1 ? 'combo interno' : 'combos internos'}
                  </strong>
                  .
                </>
              )}
            </>
          ) : (
            <>
              Você está prestes a excluir o combo{' '}
              <strong>&ldquo;{pendingDeletion.name}&rdquo;</strong>.
            </>
          )}
        </p>

        <div className="modal-card__warning">
          <strong>ATENÇÃO:</strong> Esta ação é definitiva e não pode ser desfeita (não há lixeira).
        </div>

        <div className="modal-card__actions">
          <button
            type="button"
            className="btn-system-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-system-danger"
            onClick={onConfirm}
          >
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
};
