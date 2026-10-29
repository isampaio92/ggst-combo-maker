import React, { useEffect } from 'react';
import { APP_CONFIG } from '../config/config';

export interface NewComboModalProps {
  isOpen: boolean;
  comboName: string;
  selectedCharacter: string;
  errorMessage: string | null;
  onComboNameChange: (value: string) => void;
  onCharacterChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal / Popup Inicial Obrigatório de Criação de Combo (FSD seções 6, 12 e 13; DESIGN.md seções 5, 7 e 8).
 * Exige a escolha do personagem da lista fixa de 33 personagens em ordem alfabética e o nome do combo
 * antes de liberar a paleta interativa, impedindo combos órfãos.
 */
export const NewComboModal: React.FC<NewComboModalProps> = ({
  isOpen,
  comboName,
  selectedCharacter,
  errorMessage,
  onComboNameChange,
  onCharacterChange,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onConfirm();
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-combo-modal-title"
      onClick={onCancel}
    >
      <div
        className="modal-card modal-card--new-combo"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-card__header">
          <span className="modal-card__kicker">CRIAR NOVO COMBO</span>
          <h2 id="new-combo-modal-title" className="modal-card__title modal-card__title--primary">
            IDENTIFICAÇÃO E PERSONAGEM
          </h2>
        </div>

        <p className="modal-card__description">
          Escolha o personagem oficial e defina o nome do combo para destravar a paleta de inputs.
          Ao salvar, a pasta do personagem será criada automaticamente caso ainda não exista.
        </p>

        <form className="new-combo-form" onSubmit={handleSubmit} noValidate>
          <div className="new-combo-form__field">
            <label htmlFor="new-combo-character-select" className="ggst-label">
              PERSONAGEM (OBRIGATÓRIO — {APP_CONFIG.characters.length} OFICIAIS)
            </label>
            <select
              id="new-combo-character-select"
              className="ggst-select"
              value={selectedCharacter}
              onChange={(event) => onCharacterChange(event.target.value)}
              required
            >
              <option value="">-- Selecione o personagem --</option>
              {APP_CONFIG.characters.map((character) => (
                <option key={character} value={character}>
                  {character}
                </option>
              ))}
            </select>
          </div>

          <div className="new-combo-form__field">
            <label htmlFor="new-combo-name-input" className="ggst-label">
              NOME DO COMBO (OBRIGATÓRIO)
            </label>
            <input
              id="new-combo-name-input"
              type="text"
              className="ggst-input"
              placeholder="Ex.: Corner BnB c.S > Red RC > Wallbreak"
              value={comboName}
              maxLength={80}
              autoFocus
              onChange={(event) => onComboNameChange(event.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className="sidebar__feedback-error" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="modal-card__actions">
            <button
              type="button"
              className="btn-system-secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-system-primary">
              Iniciar Montagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
