import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  copyComboNotationToClipboard,
  formatComboSequenceToNumpadText,
} from '../controllers';
import {
  type Combo,
  type Folder,
  type VisualPreference,
} from '../models';
import { GameInputTokenBadge } from './GameInputTokenBadge';

export interface ComboReadOnlyViewProps {
  combo: Combo;
  folder: Folder | null;
  visualPreference: VisualPreference;
  onStartEditing: (combo: Combo) => void;
}

/**
 * View do Módulo de Leitura Protegida e Compartilhamento (Fase 5 — FSD seções 6, 12, 13 e 22; DESIGN.md seções 2, 6, 8 e 9).
 *
 * Responsabilidades:
 * 1. Exibir o combo selecionado em linha de forma estática e protegida (sem paleta de edição ativa).
 * 2. Permitir desbloquear a edição apenas mediante clique explícito no botão "Editar".
 * 3. Permitir exportar a sequência para a área de transferência em formato Numpad com 1 clique ("Copiar como Texto")
 *    e exibir feedback visual semântico de sucesso (`#00E676`) ou erro (`#FF3333`).
 */
export const ComboReadOnlyView: React.FC<ComboReadOnlyViewProps> = ({
  combo,
  folder,
  visualPreference,
  onStartEditing,
}) => {
  const [copyFeedback, setCopyFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Limpa o feedback de cópia ao trocar de combo selecionado
  useEffect(() => {
    setCopyFeedback(null);
  }, [combo.id, combo.updated_at]);

  // Limpa automaticamente o feedback de sucesso após 4 segundos
  useEffect(() => {
    if (!copyFeedback) {
      return;
    }
    const timer = window.setTimeout(() => {
      setCopyFeedback(null);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [copyFeedback]);

  const numpadNotationPreview = useMemo(
    () => formatComboSequenceToNumpadText(combo.sequence),
    [combo.sequence]
  );

  const handleCopyAsText = useCallback(async () => {
    const result = await copyComboNotationToClipboard(combo.sequence);
    setCopyFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });
  }, [combo.sequence]);

  return (
    <div className="combo-readonly" data-testid="combo-readonly-view">
      {/* Cabeçalho do Modo de Leitura Protegido */}
      <div className="combo-readonly__header">
        <div className="combo-readonly__identity">
          <div className="combo-readonly__meta-row">
            <span
              className="combo-readonly__mode-badge"
              data-testid="readonly-protected-badge"
            >
              MODO DE LEITURA PROTEGIDO
            </span>
            <span className="combo-editor__separator" aria-hidden="true">
              /
            </span>
            <span className="combo-readonly__breadcrumb">
              {folder?.name ?? 'PASTA'}
            </span>
            <span className="combo-editor__separator" aria-hidden="true">
              /
            </span>
            <span className="combo-readonly__character">{combo.character}</span>
          </div>

          <h2 className="combo-readonly__title">{combo.name}</h2>

          <span className="combo-readonly__timestamp">
            Última alteração:{' '}
            {new Date(combo.updated_at).toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="combo-readonly__actions">
          <button
            type="button"
            className="btn-system-secondary"
            onClick={handleCopyAsText}
            data-testid="btn-copy-combo-text"
            title="Copiar sequência do combo em formato Numpad para a área de transferência"
          >
            Copiar como Texto
          </button>

          <button
            type="button"
            className="btn-system-primary"
            onClick={() => onStartEditing(combo)}
            data-testid="btn-edit-combo"
            title="Destravar a paleta interativa para editar este combo"
          >
            Editar
          </button>
        </div>
      </div>

      {/* Feedback visual de cópia para a área de transferência */}
      {copyFeedback && (
        <div
          role={copyFeedback.type === 'error' ? 'alert' : 'status'}
          data-testid="copy-feedback-banner"
          className={
            copyFeedback.type === 'success'
              ? 'combo-editor__feedback-success'
              : 'sidebar__feedback-error'
          }
        >
          {copyFeedback.message}
        </div>
      )}

      {/* Área de Sequência Visual Estática (com rolagem horizontal e sem quebra de linha) */}
      <section
        className="combo-sequence-section"
        aria-label="Sequência Visual em Modo de Leitura"
      >
        <div className="combo-sequence-section__header">
          <h3 className="combo-sequence-section__title">
            SEQUÊNCIA VISUAL ({combo.sequence.length}{' '}
            {combo.sequence.length === 1 ? 'INPUT' : 'INPUTS'})
          </h3>
          <span className="combo-sequence-section__hint">
            Exibição estática protegida ({visualPreference === 'arrows' ? 'SETAS' : 'NUMPAD'}) • Clique em &ldquo;Editar&rdquo; para alterar
          </span>
        </div>

        <div className="combo-sequence-track" data-testid="combo-readonly-track">
          {combo.sequence.map((token, index) => (
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
          ))}
        </div>
      </section>

      {/* Prévia da Notação Textual Numpad pronta para compartilhamento */}
      <section
        className="combo-notation-preview"
        aria-label="Notação em Texto Numpad"
      >
        <div className="combo-notation-preview__header">
          <span className="ggst-label" style={{ marginBottom: 0 }}>
            NOTAÇÃO TEXTUAL (FORMATO NUMPAD PARA COMPARTILHAMENTO)
          </span>
        </div>
        <code
          className="combo-notation-preview__code"
          data-testid="combo-numpad-preview"
        >
          {numpadNotationPreview}
        </code>
      </section>
    </div>
  );
};
