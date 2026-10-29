import React from 'react';
import {
  type ComboInputToken,
  type VisualPreference,
  formatInputTokenLabel,
  getInputTokenMetadata,
} from '../models';

export interface GameInputTokenBadgeProps {
  token: ComboInputToken;
  visualPreference: VisualPreference;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
  title?: string;
}

/**
 * Ícone vetorial SVG do botão Dash (boneco correndo e aro interno em branco `#F5F5F5`),
 * reproduzido em código seguindo fielmente `docs/ggst_inputs.png`, `docs/FSD.md` e `docs/DESIGN.md`.
 */
export const DashRunnerSvgIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Aro interno branco do botão Dash */}
    <circle
      cx="24"
      cy="24"
      r="20"
      stroke="var(--input-dash)"
      strokeWidth="2.5"
    />
    {/* Cabeça do boneco correndo */}
    <circle cx="30.5" cy="13.5" r="3.5" fill="var(--input-dash)" />
    {/* Tronco inclinado para frente */}
    <path
      d="M27.5 17.5L21.5 25.5"
      stroke="var(--input-dash)"
      strokeWidth="3.6"
      strokeLinecap="round"
    />
    {/* Braço traseiro/dianteiro em posição de arrancada */}
    <path
      d="M18.5 21L25.5 17.5L30 23.5L35.5 23.5"
      stroke="var(--input-dash)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Perna traseira esticada e perna dianteira dobrada */}
    <path
      d="M14.5 34.5L21.5 25.5L28 29.5L23.5 35.5"
      stroke="var(--input-dash)"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Retorna a classe CSS específica de cor/estilo para o token de input do jogo,
 * obedecendo estritamente ao mapeamento de `docs/DESIGN.md` seção 2 e seção 6.B.
 */
export function getInputTokenVariantClass(token: ComboInputToken): string {
  switch (token) {
    case 'P':
      return 'ggst-token--punch';
    case 'K':
      return 'ggst-token--kick';
    case 'c.S':
    case 'f.S':
      return 'ggst-token--slash';
    case 'HS':
      return 'ggst-token--heavy-slash';
    case 'D':
      return 'ggst-token--dust';
    case 'Dash':
      return 'ggst-token--dash';
    case 'RC':
      return 'ggst-token--rc';
    case '1':
    case '2':
    case '3':
    case '4':
    case '6':
    case '7':
    case '8':
    case '9':
    case 'j.':
      return 'ggst-token--directional';
    case '236':
    case '214':
    case '623':
    case '41236':
    case '63214':
    case '632146':
    case '236236':
    case '[4]6':
    case '[2]8':
      return 'ggst-token--motion';
    case 'CH':
      return 'ggst-token--ch';
    case '+':
    case '>':
    case '~':
      return 'ggst-token--connector';
  }
}

/**
 * Componente visual que renderiza um botão circular 3D de input do jogo ou conector
 * tanto na Paleta Interativa quanto na Área de Sequência do Combo.
 */
export const GameInputTokenBadge: React.FC<GameInputTokenBadgeProps> = ({
  token,
  visualPreference,
  size = 'md',
  interactive = false,
  onClick,
  title,
}) => {
  const meta = getInputTokenMetadata(token);
  const label = formatInputTokenLabel(token, visualPreference);
  const variantClass = getInputTokenVariantClass(token);
  const sizeClass = `ggst-token--${size}`;
  const isLongLabel = label.length >= 4;

  const content =
    token === 'Dash' ? (
      <>
        <DashRunnerSvgIcon className="ggst-token__dash-svg" />
        <span className="sr-only">Dash</span>
      </>
    ) : (
      <span
        className={`ggst-token__text ${
          isLongLabel ? 'ggst-token__text--compact' : ''
        }`}
      >
        {label}
      </span>
    );

  const tooltip = title ?? `${meta.description} (${meta.numpadLabel})`;

  if (interactive) {
    return (
      <button
        type="button"
        className={`ggst-token ggst-token--interactive ${variantClass} ${sizeClass}`}
        onClick={onClick}
        title={tooltip}
        aria-label={`Inserir ${meta.description} (${label})`}
        data-token={token}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={`ggst-token ${variantClass} ${sizeClass}`}
      title={tooltip}
      data-token={token}
    >
      {content}
    </span>
  );
};
