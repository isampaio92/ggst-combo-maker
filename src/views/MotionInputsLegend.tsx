import React from 'react';
import {
  INPUT_TOKEN_METADATA,
  MOTION_INPUT_TOKENS,
  type VisualPreference,
} from '../models';

export interface MotionInputsLegendProps {
  visualPreference: VisualPreference;
}

/**
 * Extrai o nome explicativo do movimento a partir da descrição catalogada em `INPUT_TOKEN_METADATA`,
 * removendo o sufixo redundante entre parênteses (ex.: `"Meia-lua para frente (236 / ↓↘→)"` -> `"Meia-lua para frente"`).
 */
function extractMotionMovementName(description: string): string {
  return description.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

/**
 * Legenda explicativa discreta para os Comandos Especiais Completos (Motions) de Guilty Gear -Strive-.
 * Consome diretamente `MOTION_INPUT_TOKENS` e `INPUT_TOKEN_METADATA` (`src/models/inputMetadata.ts`)
 * e respeita a preferência visual ativa no cabeçalho (`Setas` vs. `Numpad`), exibindo a equivalência
 * entre os dois formatos e o nome do movimento sem competir visualmente com a trilha principal do combo.
 */
export const MotionInputsLegend: React.FC<MotionInputsLegendProps> = ({
  visualPreference,
}) => {
  return (
    <div
      className="motions-legend"
      role="region"
      aria-label="Legenda de Comandos Especiais (Motions)"
      data-testid="motions-legend"
    >
      <div className="motions-legend__header">
        <span className="motions-legend__title">
          LEGENDA DE COMANDOS ESPECIAIS (MOTIONS)
        </span>
        <span className="motions-legend__hint">
          [4]/[←] e [2]/[↓] = Segurar direção (Carga)
        </span>
      </div>

      <ul className="motions-legend__grid">
        {MOTION_INPUT_TOKENS.map((token) => {
          const meta = INPUT_TOKEN_METADATA[token];
          const primaryLabel =
            visualPreference === 'arrows' ? meta.arrowsLabel : meta.numpadLabel;
          const secondaryLabel =
            visualPreference === 'arrows' ? meta.numpadLabel : meta.arrowsLabel;
          const movementName = extractMotionMovementName(meta.description);

          return (
            <li
              key={token}
              className="motions-legend__item"
              data-motion-token={token}
            >
              <span
                className="motions-legend__notation"
                aria-label={`${primaryLabel} equivalente a ${secondaryLabel}`}
              >
                <span className="motions-legend__primary-code">
                  {primaryLabel}
                </span>
                <span
                  className="motions-legend__separator"
                  aria-hidden="true"
                >
                  ·
                </span>
                <span className="motions-legend__secondary-code">
                  {secondaryLabel}
                </span>
              </span>
              <span className="motions-legend__description">
                {movementName}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
