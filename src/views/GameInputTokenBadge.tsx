import React, { useId } from 'react';
import {
  type ComboInputToken,
  type DirectionalInput,
  type MotionInput,
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
 * Ângulo de rotação (em graus, a partir do topo = 0°) para cada uma das 8 direções do D-Pad.
 */
const DPAD_DIRECTION_ANGLE: Record<Exclude<DirectionalInput, 'j.'>, number> = {
  '8': 0,
  '9': 45,
  '6': 90,
  '3': 135,
  '2': 180,
  '1': 225,
  '4': 270,
  '7': 315,
};

/**
 * Componente base da cruz 3D escura do D-Pad de Guilty Gear -Strive- (conforme `docs/ggst_inputs.png`),
 * com definições de gradiente laranja-amarelo (`#FF6600` a `#FFCC00`) de alto contraste.
 */
const DpadCrossDefsAndBase: React.FC<{
  gradId: string;
  chargeGradId?: string;
}> = ({ gradId, chargeGradId }) => (
  <>
    <defs>
      <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFEE55" />
        <stop offset="45%" stopColor="var(--input-directional-end)" />
        <stop offset="100%" stopColor="var(--input-directional-start)" />
      </linearGradient>
      {chargeGradId && (
        <linearGradient id={chargeGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#999999" />
          <stop offset="100%" stopColor="#555555" />
        </linearGradient>
      )}
    </defs>

    {/* Cruz 3D do D-Pad ao fundo */}
    <path
      d="M19 6 H29 V19 H42 V29 H29 V42 H19 V29 H6 V19 H19 Z"
      fill="#262626"
      stroke="#111111"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    {/* Brilho interno chanfrado da cruz do D-Pad */}
    <path
      d="M20.2 7.5 H27.8 V20.2 H40.5 V27.8 H27.8 V40.5 H20.2 V27.8 H7.5 V20.2 H20.2 Z"
      fill="#383838"
      stroke="#525252"
      strokeWidth="0.9"
      strokeLinejoin="round"
    />
    {/* Cavidade central sutil do D-Pad */}
    <circle cx="24" cy="24" r="3.2" fill="#2B2B2B" />
  </>
);

/**
 * Renderiza os botões direcionais e motions com base fiel em `docs/ggst_inputs.png`:
 * Cruz D-Pad escura 3D ao fundo + setas e curvas de comando em gradiente laranja/amarelo vibrante
 * com contorno branco/escuro para máximo contraste.
 */
export const DpadDirectionalSvgIcon: React.FC<{
  token: DirectionalInput | MotionInput;
  className?: string;
}> = ({ token, className }) => {
  const rawId = useId().replace(/:/g, '');
  const gradId = `ggst-dir-grad-${rawId}`;
  const chargeGradId = `ggst-charge-grad-${rawId}`;

  // 1. Direcionais básicos de 8 direções (1, 2, 3, 4, 6, 7, 8, 9)
  if (token in DPAD_DIRECTION_ANGLE) {
    const angle = DPAD_DIRECTION_ANGLE[token as Exclude<DirectionalInput, 'j.'>];
    return (
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <DpadCrossDefsAndBase gradId={gradId} />
        <g transform={`rotate(${angle} 24 24)`}>
          {/* Contorno escuro externo para contraste máximo sobre a cruz */}
          <path
            d="M24 4.5 L34 15.5 H28.2 V25.5 H19.8 V15.5 H14 Z"
            fill={`url(#${gradId})`}
            stroke="#111111"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Borda interna clara brilhante fiel a ggst_inputs.png */}
          <path
            d="M24 4.5 L34 15.5 H28.2 V25.5 H19.8 V15.5 H14 Z"
            fill={`url(#${gradId})`}
            stroke="#FFF3B0"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  }

  // 2. Modificador de Pulo (j.) com alto contraste sobre o botão circular
  if (token === 'j.') {
    return (
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <DpadCrossDefsAndBase gradId={gradId} />
        {/* Seta superior de salto + badge J. em alto contraste */}
        <path
          d="M24 4 L31.5 12 H26.8 V18 H21.2 V12 H16.5 Z"
          fill={`url(#${gradId})`}
          stroke="#111111"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <text
          x="24"
          y="37"
          textAnchor="middle"
          fill={`url(#${gradId})`}
          stroke="#111111"
          strokeWidth="3.2"
          paintOrder="stroke"
          fontFamily="var(--font-input)"
          fontWeight="900"
          fontSize="19"
        >
          j.
        </text>
      </svg>
    );
  }

  // 3. Comandos Especiais Completos (Motions) baseados em docs/ggst_inputs.png
  const renderMotionOverlay = () => {
    switch (token) {
      case '236': // Meia-lua para frente (baixo -> diagonal -> direita)
        return (
          <g>
            <path
              d="M24 38 A 14 14 0 0 0 38 24"
              stroke="#111111"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            <path
              d="M24 38 A 14 14 0 0 0 38 24"
              stroke={`url(#${gradId})`}
              strokeWidth="4.8"
              strokeLinecap="round"
            />
            <polygon
              points="38,14 45.5,25.5 30.5,25.5"
              fill={`url(#${gradId})`}
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>
        );

      case '214': // Meia-lua para trás (baixo -> diagonal -> esquerda)
        return (
          <g>
            <path
              d="M24 38 A 14 14 0 0 1 10 24"
              stroke="#111111"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            <path
              d="M24 38 A 14 14 0 0 1 10 24"
              stroke={`url(#${gradId})`}
              strokeWidth="4.8"
              strokeLinecap="round"
            />
            <polygon
              points="10,14 2.5,25.5 17.5,25.5"
              fill={`url(#${gradId})`}
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>
        );

      case '623': // Dragon Punch / Z-Motion (conforme 1º ícone superior direito de ggst_inputs.png)
        return (
          <g>
            <path
              d="M24 23 H37 L24 37 H38"
              stroke="#111111"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 23 H37 L24 37 H38"
              stroke={`url(#${gradId})`}
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon
              points="45,37 35,30.5 35,43.5"
              fill={`url(#${gradId})`}
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>
        );

      case '41236': // Meia-lua completa para frente (esquerda -> baixo -> direita)
        return (
          <g>
            <path
              d="M9 24 A 15 15 0 0 0 39 24"
              stroke="#111111"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            <path
              d="M9 24 A 15 15 0 0 0 39 24"
              stroke={`url(#${gradId})`}
              strokeWidth="4.8"
              strokeLinecap="round"
            />
            <polygon
              points="39,14 46,25.5 32,25.5"
              fill={`url(#${gradId})`}
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>
        );

      case '63214': // Meia-lua completa para trás (direita -> baixo -> esquerda, 2º ícone dir de ggst_inputs.png)
        return (
          <g>
            <path
              d="M39 24 A 15 15 0 0 1 9 24"
              stroke="#111111"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            <path
              d="M39 24 A 15 15 0 0 1 9 24"
              stroke={`url(#${gradId})`}
              strokeWidth="4.8"
              strokeLinecap="round"
            />
            <polygon
              points="9,14 2,25.5 16,25.5"
              fill={`url(#${gradId})`}
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>
        );

      case '632146': // Overdrive Meia-lua Trás + Frente (curva 63214 + seta final para direita)
        return (
          <g>
            <path
              d="M38 22 A 14 14 0 0 1 10 22 L 10 18 L 35 18"
              stroke="#111111"
              strokeWidth="6.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M38 22 A 14 14 0 0 1 10 22 L 10 18 L 35 18"
              stroke={`url(#${gradId})`}
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon
              points="44,18 33,11.5 33,24.5"
              fill={`url(#${gradId})`}
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>
        );

      case '236236': // Dupla meia-lua para frente (dois arcos 236 concêntricos)
        return (
          <g>
            {/* Arco interno */}
            <path
              d="M24 33 A 9 9 0 0 0 33 24"
              stroke="#111111"
              strokeWidth="5.8"
              strokeLinecap="round"
            />
            <path
              d="M24 33 A 9 9 0 0 0 33 24"
              stroke="#FF9900"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Arco externo principal */}
            <path
              d="M20 41 A 17 17 0 0 0 41 24"
              stroke="#111111"
              strokeWidth="6.8"
              strokeLinecap="round"
            />
            <path
              d="M20 41 A 17 17 0 0 0 41 24"
              stroke={`url(#${gradId})`}
              strokeWidth="4.2"
              strokeLinecap="round"
            />
            <polygon
              points="40,13 46.5,24.5 33.5,24.5"
              fill={`url(#${gradId})`}
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>
        );

      case '[4]6': // Carga Trás -> Frente
        return (
          <g>
            {/* Indicador de carga (segurar trás) */}
            <circle
              cx="11.5"
              cy="24"
              r="5.2"
              fill="#FFEE55"
              stroke="#111111"
              strokeWidth="2.2"
            />
            {/* Seta disparando para frente */}
            <path
              d="M17 24 H34"
              stroke="#111111"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            <path
              d="M17 24 H34"
              stroke={`url(#${gradId})`}
              strokeWidth="4.6"
              strokeLinecap="round"
            />
            <polygon
              points="44,24 32,16.5 32,31.5"
              fill={`url(#${gradId})`}
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>
        );

      case '[2]8': // Carga Baixo -> Cima
        return (
          <g>
            {/* Indicador de carga (segurar baixo) */}
            <circle
              cx="24"
              cy="36.5"
              r="5.2"
              fill="#FFEE55"
              stroke="#111111"
              strokeWidth="2.2"
            />
            {/* Seta disparando para cima */}
            <path
              d="M24 31 V14"
              stroke="#111111"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            <path
              d="M24 31 V14"
              stroke={`url(#${gradId})`}
              strokeWidth="4.6"
              strokeLinecap="round"
            />
            <polygon
              points="24,4 16.5,16 31.5,16"
              fill={`url(#${gradId})`}
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </g>
        );
    }
  };

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <DpadCrossDefsAndBase gradId={gradId} chargeGradId={chargeGradId} />
      {renderMotionOverlay()}
    </svg>
  );
};

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

  const isDpadGraphicalToken =
    visualPreference === 'arrows' &&
    (meta.category === 'directional' || meta.category === 'motion');

  let content: React.ReactNode;
  if (token === 'Dash') {
    content = (
      <>
        <DashRunnerSvgIcon className="ggst-token__dash-svg" />
        <span className="sr-only">Dash</span>
      </>
    );
  } else if (isDpadGraphicalToken) {
    content = (
      <>
        <DpadDirectionalSvgIcon
          token={token as DirectionalInput | MotionInput}
          className="ggst-token__dpad-svg"
        />
        {/* Texto oculto visualmente para acessibilidade e leitores de tela */}
        <span className="sr-only">{label}</span>
      </>
    );
  } else {
    content = (
      <span
        className={`ggst-token__text ${
          isLongLabel ? 'ggst-token__text--compact' : ''
        }`}
      >
        {label}
      </span>
    );
  }

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
