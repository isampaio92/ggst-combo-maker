import React from 'react';
import {
  type ComboDraftState,
  type DuplicateComboWarningState,
} from '../controllers';
import {
  ATTACK_INPUT_TOKENS,
  type ComboInputToken,
  DIRECTIONAL_INPUT_TOKENS,
  MODIFIER_INPUT_TOKENS,
  MOTION_INPUT_TOKENS,
  type VisualPreference,
} from '../models';
import { DuplicateComboModal } from './DuplicateComboModal';
import { GameInputTokenBadge } from './GameInputTokenBadge';
import { MotionInputsLegend } from './MotionInputsLegend';

export interface ComboEditorViewProps {
  draft: ComboDraftState;
  visualPreference: VisualPreference;
  errorMessage: string | null;
  successMessage: string | null;
  duplicateWarning: DuplicateComboWarningState | null;
  onAddInput: (token: ComboInputToken) => void;
  onUndoLastInput: () => void;
  onUpdateDraftName: (newName: string) => void;
  onSaveDraft: () => void;
  onConfirmOverwrite: () => void;
  onCancelOverwrite: () => void;
  onCloseEditor: () => void;
}

/**
 * View do Módulo de Criação e Edição de Combos (Fase 4 — FSD seções 6, 12 e 13; DESIGN.md seções 2, 5 e 6).
 * Renderiza:
 * 1. Cabeçalho do combo em edição (personagem fixado, nome editável, botões Desfazer, Salvar e Fechar).
 * 2. Área de renderização sequencial com rolagem horizontal fluida (`overflow-x: auto`) e sem quebra de linha.
 * 3. Paleta interativa de botões visuais circulares em 3D (Ataques + Dash SVG, Red RC, Direcionais + Jump, Motions e Modificadores).
 */
export const ComboEditorView: React.FC<ComboEditorViewProps> = ({
  draft,
  visualPreference,
  errorMessage,
  successMessage,
  duplicateWarning,
  onAddInput,
  onUndoLastInput,
  onUpdateDraftName,
  onSaveDraft,
  onConfirmOverwrite,
  onCancelOverwrite,
  onCloseEditor,
}) => {
  return (
    <div className="combo-editor" data-testid="combo-editor-view">
      {/* Cabeçalho do Editor */}
      <div className="combo-editor__header">
        <div className="combo-editor__identity">
          <div className="combo-editor__meta-row">
            <span className="combo-editor__mode-badge">
              {draft.id ? 'MODO DE EDIÇÃO' : 'NOVO COMBO'}
            </span>
            <span className="combo-editor__separator" aria-hidden="true">
              /
            </span>
            <span className="combo-editor__character">{draft.character}</span>
          </div>

          <div className="combo-editor__name-row">
            <label htmlFor="combo-editor-name-input" className="ggst-label">
              NOME DO COMBO
            </label>
            <input
              id="combo-editor-name-input"
              type="text"
              className="ggst-input combo-editor__name-input"
              value={draft.name}
              maxLength={80}
              onChange={(event) => onUpdateDraftName(event.target.value)}
            />
          </div>
        </div>

        <div className="combo-editor__actions">
          <button
            type="button"
            className="btn-system-secondary"
            onClick={onUndoLastInput}
            disabled={draft.sequence.length === 0}
            title="Remover o último botão ou modificador inserido (Desfazer)"
          >
            ↶ Desfazer
          </button>

          <button
            type="button"
            className="btn-system-primary"
            onClick={onSaveDraft}
            title="Salvar combo na pasta do personagem"
          >
            Salvar Combo
          </button>

          <button
            type="button"
            className="btn-system-secondary"
            onClick={onCloseEditor}
            title="Fechar modo de edição"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Mensagens de erro ou sucesso na edição */}
      {errorMessage && (
        <div className="sidebar__feedback-error" role="alert">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="combo-editor__feedback-success" role="status">
          {successMessage}
        </div>
      )}

      {/* Área de Renderização Sequencial do Combo (overflow-x: auto, sem quebra de linha) */}
      <section
        className="combo-sequence-section"
        aria-label="Sequência Visual do Combo"
      >
        <div className="combo-sequence-section__header">
          <h3 className="combo-sequence-section__title">
            SEQUÊNCIA DO COMBO ({draft.sequence.length}{' '}
            {draft.sequence.length === 1 ? 'INPUT' : 'INPUTS'})
          </h3>
          <span className="combo-sequence-section__hint">
            Inserção sequencial no fim da fila • Rolagem horizontal ativa
          </span>
        </div>

        <div
          className="combo-sequence-track"
          data-testid="combo-sequence-track"
        >
          {draft.sequence.length === 0 ? (
            <div className="combo-sequence-track__empty">
              Clique nos botões da paleta abaixo para montar a sequência visual do combo.
            </div>
          ) : (
            draft.sequence.map((token, index) => (
              <div
                key={`${token}-${index}`}
                className="combo-sequence-track__item"
              >
                <GameInputTokenBadge
                  token={token}
                  visualPreference={visualPreference}
                  size="md"
                />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Paleta Interativa de Botões Visuais do Jogo */}
      <section
        className="input-palette"
        aria-label="Paleta Interativa de Inputs de Guilty Gear -Strive-"
      >
        {/* Grupo 1: Botões de Ataque, Dash SVG e Red Roman Cancel */}
        <div className="input-palette__group">
          <h3 className="input-palette__group-title">
            ATAQUES / DASH / RED ROMAN CANCEL
          </h3>
          <div className="input-palette__buttons">
            {ATTACK_INPUT_TOKENS.map((token) => (
              <GameInputTokenBadge
                key={token}
                token={token}
                visualPreference={visualPreference}
                size="lg"
                interactive
                onClick={() => onAddInput(token)}
              />
            ))}
            <GameInputTokenBadge
              token="RC"
              visualPreference={visualPreference}
              size="lg"
              interactive
              onClick={() => onAddInput('RC')}
            />
          </div>
        </div>

        {/* Grupo 2: Modificadores de Ligação e Counter Hit */}
        <div className="input-palette__group">
          <h3 className="input-palette__group-title">
            MODIFICADORES DE LIGAÇÃO E COUNTER HIT
          </h3>
          <div className="input-palette__buttons">
            {MODIFIER_INPUT_TOKENS.map((token) => (
              <GameInputTokenBadge
                key={token}
                token={token}
                visualPreference={visualPreference}
                size="md"
                interactive
                onClick={() => onAddInput(token)}
              />
            ))}
          </div>
        </div>

        {/* Grupo 3: Direcionais Básicos (8 direções) */}
        <div className="input-palette__group">
          <h3 className="input-palette__group-title">
            DIRECIONAIS BÁSICOS (8 DIREÇÕES)
          </h3>
          <div className="input-palette__buttons">
            {DIRECTIONAL_INPUT_TOKENS.map((token) => (
              <GameInputTokenBadge
                key={token}
                token={token}
                visualPreference={visualPreference}
                size="md"
                interactive
                onClick={() => onAddInput(token)}
              />
            ))}
          </div>
        </div>

        {/* Grupo 4: Comandos Especiais Completos (Motions) */}
        <div className="input-palette__group input-palette__group--full">
          <h3 className="input-palette__group-title">
            COMANDOS ESPECIAIS COMPLETOS (MOTIONS)
          </h3>
          <div className="input-palette__buttons">
            {MOTION_INPUT_TOKENS.map((token) => (
              <GameInputTokenBadge
                key={token}
                token={token}
                visualPreference={visualPreference}
                size="md"
                interactive
                onClick={() => onAddInput(token)}
              />
            ))}
          </div>
          <MotionInputsLegend visualPreference={visualPreference} />
        </div>
      </section>

      {/* Modal de Aviso de Duplicidade (Sobrescrita) */}
      <DuplicateComboModal
        warningState={duplicateWarning}
        onConfirmOverwrite={onConfirmOverwrite}
        onCancel={onCancelOverwrite}
      />
    </div>
  );
};
