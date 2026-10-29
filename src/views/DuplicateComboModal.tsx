import React, { useEffect } from 'react';
import { type DuplicateComboWarningState } from '../controllers';

export interface DuplicateComboModalProps {
  warningState: DuplicateComboWarningState | null;
  onConfirmOverwrite: () => void;
  onCancel: () => void;
}

/**
 * Modal de aviso de duplicidade de nome ao salvar um combo na mesma pasta (FSD seção 14 e DESIGN.md seção 9).
 * Bloqueia o salvamento imediato e pergunta ao usuário se deseja sobrescrever o combo existente.
 */
export const DuplicateComboModal: React.FC<DuplicateComboModalProps> = ({
  warningState,
  onConfirmOverwrite,
  onCancel,
}) => {
  useEffect(() => {
    if (!warningState) {
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
  }, [warningState, onCancel]);

  if (!warningState) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="duplicate-combo-title"
      onClick={onCancel}
    >
      <div
        className="modal-card modal-card--warning"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="duplicate-combo-title" className="modal-card__title modal-card__title--warning">
          COMBO COM NOME DUPLICADO
        </h2>

        <p className="modal-card__description">
          Já existe um combo chamado{' '}
          <strong>&ldquo;{warningState.existingCombo.name}&rdquo;</strong> na pasta{' '}
          <strong>&ldquo;{warningState.folderName}&rdquo;</strong>.
        </p>

        <div className="modal-card__warning modal-card__warning--orange">
          <strong>AVISO DE SOBRESCRITA:</strong> Se você confirmar, a sequência atual substituirá
          permanentemente o combo existente na pasta.
        </div>

        <div className="modal-card__actions">
          <button
            type="button"
            className="btn-system-secondary"
            onClick={onCancel}
          >
            Cancelar e Renomear
          </button>
          <button
            type="button"
            className="btn-system-warning"
            onClick={onConfirmOverwrite}
          >
            Sobrescrever Combo
          </button>
        </div>
      </div>
    </div>
  );
};
