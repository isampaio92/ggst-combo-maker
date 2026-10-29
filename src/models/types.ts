import { APP_CONFIG, type CharacterName } from '../config/config';

/**
 * Tipos e interfaces das entidades do sistema GGST Combo Maker.
 * Refletem a estrutura lógica modelada em JSON para o Local Storage (FSD seções 6, 10 e 11).
 */

/** Preferência visual ativa de exibição dos inputs direcionais e motions */
export type VisualPreference = 'arrows' | 'numpad';

/** Botões de ataque básicos e Dash */
export type AttackInput = 'P' | 'K' | 'c.S' | 'f.S' | 'HS' | 'D' | 'Dash';

/** Botão de Red Roman Cancel */
export type RomanCancelInput = 'RC';

/** Direcionais básicos (8 direções) */
export type DirectionalInput = '1' | '2' | '3' | '4' | '6' | '7' | '8' | '9';

/** Comandos especiais completos (Motions) */
export type MotionInput =
  | '236'
  | '214'
  | '623'
  | '41236'
  | '63214'
  | '632146'
  | '236236'
  | '214214'
  | '[4]6'
  | '[2]8';

/** Modificadores de ligação e Counter Hit */
export type ModifierInput = '+' | '>' | '~' | 'CH';

/** União de todos os tokens válidos na sequência de um combo */
export type ComboInputToken =
  | AttackInput
  | RomanCancelInput
  | DirectionalInput
  | MotionInput
  | ModifierInput;

/** Categoria semântica de cada token para estilização e formatação textual */
export type ComboInputCategory =
  | 'attack'
  | 'rc'
  | 'directional'
  | 'motion'
  | 'modifier';

/** Lista imutável de todos os tokens de input permitidos para validação de integridade */
export const VALID_COMBO_INPUTS: readonly ComboInputToken[] = [
  // Ataques e Dash
  'P',
  'K',
  'c.S',
  'f.S',
  'HS',
  'D',
  'Dash',
  // Roman Cancel
  'RC',
  // Direcionais (8 direções)
  '1',
  '2',
  '3',
  '4',
  '6',
  '7',
  '8',
  '9',
  // Motions
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
  // Modificadores
  '+',
  '>',
  '~',
  'CH',
] as const;

/**
 * Entidade Pasta (Tabela lógica `folders`)
 * Chave primária UUID, campo `name` (String), ordenada alfabeticamente nas consultas.
 */
export interface Folder {
  id: string;
  name: string;
}

/**
 * Entidade Combo (Tabela lógica `combos`)
 * Chave primária UUID, chave estrangeira `folder_id`, `name`, `character`, `sequence` e `updated_at`.
 */
export interface Combo {
  id: string;
  folder_id: string;
  name: string;
  character: CharacterName;
  sequence: ComboInputToken[];
  updated_at: number;
}

/**
 * Entidade Configurações (Tabela lógica `settings`)
 * Guarda a preferência visual ativa do usuário ("arrows" | "numpad").
 */
export interface Settings {
  visual_preference: VisualPreference;
}

/**
 * Registro de controle de uma migration executada no Local Storage.
 */
export interface MigrationEntry {
  version: number;
  name: string;
  executed_at: string;
}

/**
 * Tabela/chave de controle de migrations executadas no Local Storage.
 */
export interface MigrationControlState {
  current_version: number;
  executed: MigrationEntry[];
}

/**
 * Estrutura global do schema persistido no Local Storage.
 */
export interface LocalDatabaseSchema {
  folders: Folder[];
  combos: Combo[];
  settings: Settings;
  migrations: MigrationControlState;
}

/**
 * Verifica se uma string corresponde a um personagem válido da lista fixa do FSD.
 */
export function isValidCharacterName(value: unknown): value is CharacterName {
  return (
    typeof value === 'string' &&
    (APP_CONFIG.characters as readonly string[]).includes(value)
  );
}

/**
 * Verifica se um valor é um token de input válido do jogo.
 */
export function isValidComboInputToken(value: unknown): value is ComboInputToken {
  return (
    typeof value === 'string' &&
    (VALID_COMBO_INPUTS as readonly string[]).includes(value)
  );
}

/**
 * Verifica se um valor é uma preferência visual válida ("arrows" | "numpad").
 */
export function isValidVisualPreference(value: unknown): value is VisualPreference {
  return value === 'arrows' || value === 'numpad';
}

/**
 * Sanitiza strings fornecidas pelo usuário ou lidas do Local Storage (nomes de pastas e combos)
 * removendo caracteres de controle e tags HTML/scripts para prevenção contra XSS (FSD seção 24).
 */
export function sanitizeUserText(raw: string, maxLength = 80): string {
  return raw
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Gera um identificador UUID v4 compatível com navegadores modernos e ambientes de teste.
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
