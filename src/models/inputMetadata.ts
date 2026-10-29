import {
  type AttackInput,
  type ComboInputCategory,
  type ComboInputToken,
  type DirectionalInput,
  type ModifierInput,
  type MotionInput,
  type VisualPreference,
} from './types';

/**
 * Metadados e regras de apresentação dos tokens de input de Guilty Gear -Strive- (FSD seção 6 e DESIGN.md seções 2 e 6).
 */
export interface InputTokenMetadata {
  token: ComboInputToken;
  category: ComboInputCategory;
  arrowsLabel: string;
  numpadLabel: string;
  description: string;
}

export const ATTACK_INPUT_TOKENS: readonly AttackInput[] = [
  'P',
  'K',
  'c.S',
  'S',
  'HS',
  'D',
  'Dash',
] as const;

export const DIRECTIONAL_INPUT_TOKENS: readonly DirectionalInput[] = [
  '7',
  '8',
  '9',
  '4',
  '6',
  '1',
  '2',
  '3',
] as const;

export const MOTION_INPUT_TOKENS: readonly MotionInput[] = [
  '236',
  '214',
  '623',
  '41236',
  '63214',
  '632146',
  '236236',
  '214214',
  '[4]6',
  '[2]8',
] as const;

export const MODIFIER_INPUT_TOKENS: readonly ModifierInput[] = [
  '+',
  '>',
  '~',
  'CH',
] as const;

export const INPUT_TOKEN_METADATA: Record<ComboInputToken, InputTokenMetadata> = {
  // Ataques e Dash
  P: {
    token: 'P',
    category: 'attack',
    arrowsLabel: 'P',
    numpadLabel: 'P',
    description: 'Punch (Soco)',
  },
  K: {
    token: 'K',
    category: 'attack',
    arrowsLabel: 'K',
    numpadLabel: 'K',
    description: 'Kick (Chute)',
  },
  'c.S': {
    token: 'c.S',
    category: 'attack',
    arrowsLabel: 'c.S',
    numpadLabel: 'c.S',
    description: 'Close Slash (Slash de perto)',
  },
  S: {
    token: 'S',
    category: 'attack',
    arrowsLabel: 'S',
    numpadLabel: 'S',
    description: 'Slash (S)',
  },
  HS: {
    token: 'HS',
    category: 'attack',
    arrowsLabel: 'HS',
    numpadLabel: 'HS',
    description: 'Heavy Slash',
  },
  D: {
    token: 'D',
    category: 'attack',
    arrowsLabel: 'D',
    numpadLabel: 'D',
    description: 'Dust Attack',
  },
  Dash: {
    token: 'Dash',
    category: 'attack',
    arrowsLabel: 'Dash',
    numpadLabel: 'Dash',
    description: 'Dash (Corrida / Macro de Dash)',
  },

  // Red Roman Cancel
  RC: {
    token: 'RC',
    category: 'rc',
    arrowsLabel: 'RC',
    numpadLabel: 'RC',
    description: 'Red Roman Cancel',
  },

  // Direcionais básicos (8 direções + j.)
  '1': {
    token: '1',
    category: 'directional',
    arrowsLabel: '↙',
    numpadLabel: '1',
    description: 'Diagonal Inferior Trás (1 / ↙)',
  },
  '2': {
    token: '2',
    category: 'directional',
    arrowsLabel: '↓',
    numpadLabel: '2',
    description: 'Baixo / Agachado (2 / ↓)',
  },
  '3': {
    token: '3',
    category: 'directional',
    arrowsLabel: '↘',
    numpadLabel: '3',
    description: 'Diagonal Inferior Frente (3 / ↘)',
  },
  '4': {
    token: '4',
    category: 'directional',
    arrowsLabel: '←',
    numpadLabel: '4',
    description: 'Trás (4 / ←)',
  },
  '6': {
    token: '6',
    category: 'directional',
    arrowsLabel: '→',
    numpadLabel: '6',
    description: 'Frente (6 / →)',
  },
  '7': {
    token: '7',
    category: 'directional',
    arrowsLabel: '↖',
    numpadLabel: '7',
    description: 'Salto para Trás (7 / ↖)',
  },
  '8': {
    token: '8',
    category: 'directional',
    arrowsLabel: '↑',
    numpadLabel: '8',
    description: 'Salto Neutro / Cima (8 / ↑)',
  },
  '9': {
    token: '9',
    category: 'directional',
    arrowsLabel: '↗',
    numpadLabel: '9',
    description: 'Salto para Frente (9 / ↗)',
  },

  // Motions (Comandos especiais completos)
  '236': {
    token: '236',
    category: 'motion',
    arrowsLabel: '↓↘→',
    numpadLabel: '236',
    description: 'Meia-lua para frente (236 / ↓↘→)',
  },
  '214': {
    token: '214',
    category: 'motion',
    arrowsLabel: '↓↙←',
    numpadLabel: '214',
    description: 'Meia-lua para trás (214 / ↓↙←)',
  },
  '623': {
    token: '623',
    category: 'motion',
    arrowsLabel: '→↓↘',
    numpadLabel: '623',
    description: 'Dragon Punch / Z-Motion (623 / →↓↘)',
  },
  '41236': {
    token: '41236',
    category: 'motion',
    arrowsLabel: '←↙↓↘→',
    numpadLabel: '41236',
    description: 'Meia-lua completa para frente (41236 / ←↙↓↘→)',
  },
  '63214': {
    token: '63214',
    category: 'motion',
    arrowsLabel: '→↘↓↙←',
    numpadLabel: '63214',
    description: 'Meia-lua completa para trás (63214 / →↘↓↙←)',
  },
  '632146': {
    token: '632146',
    category: 'motion',
    arrowsLabel: '→↘↓↙←→',
    numpadLabel: '632146',
    description: 'Overdrive Meia-lua Trás + Frente (632146 / →↘↓↙←→)',
  },
  '236236': {
    token: '236236',
    category: 'motion',
    arrowsLabel: '↓↘→↓↘→',
    numpadLabel: '236236',
    description: 'Dupla meia-lua para frente (236236 / ↓↘→↓↘→)',
  },
  '214214': {
    token: '214214',
    category: 'motion',
    arrowsLabel: '↓↙←↓↙←',
    numpadLabel: '214214',
    description: 'Dupla meia-lua para trás (214214 / ↓↙←↓↙←)',
  },
  '[4]6': {
    token: '[4]6',
    category: 'motion',
    arrowsLabel: '[←]→',
    numpadLabel: '[4]6',
    description: 'Comando de Carga Trás-Frente ([4]6 / [←]→)',
  },
  '[2]8': {
    token: '[2]8',
    category: 'motion',
    arrowsLabel: '[↓]↑',
    numpadLabel: '[2]8',
    description: 'Comando de Carga Baixo-Cima ([2]8 / [↓]↑)',
  },

  // Modificadores de ligação e Counter Hit
  '+': {
    token: '+',
    category: 'modifier',
    arrowsLabel: '+',
    numpadLabel: '+',
    description: 'Conector simultâneo (+)',
  },
  '>': {
    token: '>',
    category: 'modifier',
    arrowsLabel: '>',
    numpadLabel: '>',
    description: 'Sequência / Gatling / Cancel (>)',
  },
  '~': {
    token: '~',
    category: 'modifier',
    arrowsLabel: '~',
    numpadLabel: '~',
    description: 'Follow-up imediato / Kara Cancel (~)',
  },
  CH: {
    token: 'CH',
    category: 'modifier',
    arrowsLabel: 'CH',
    numpadLabel: 'CH',
    description: 'Counter Hit (CH)',
  },
};

/**
 * Retorna os metadados de um token de input.
 */
export function getInputTokenMetadata(token: ComboInputToken): InputTokenMetadata {
  return INPUT_TOKEN_METADATA[token];
}

/**
 * Retorna o rótulo visual do token de acordo com a preferência ativa ("arrows" | "numpad").
 */
export function formatInputTokenLabel(
  token: ComboInputToken,
  visualPreference: VisualPreference
): string {
  const meta = INPUT_TOKEN_METADATA[token];
  return visualPreference === 'numpad' ? meta.numpadLabel : meta.arrowsLabel;
}
