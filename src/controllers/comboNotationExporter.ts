import { recordLocalLog } from '../logs';
import {
  type ComboInputToken,
  getInputTokenMetadata,
  isValidComboInputToken,
} from '../models';

/**
 * Conversor e exportador textual de sequências de combos no formato Numpad (Fase 5 — FSD seções 6, 12 e 22).
 *
 * Regra estrita do FSD (seção 6):
 * - Direcionais básicos (`1`..`9`), comandos especiais (`236`, `214`, `623`, `41236`, `63214`,
 *   `632146`, `236236`, `214214`, `[4]6`, `[2]8`) e `j.` seguidos diretamente de botões de ataque
 *   (`P`, `K`, `c.S`, `f.S`, `HS`, `D`) ou ligados por `~` são concatenados sem espaço:
 *   Ex.: `2` + `K` = `2K`; `236` + `P` = `236P`; `214` + `K` + `~` + `P` = `214K~P`.
 * - Já conectores e tokens independentes como `>`, `+`, `RC`, `Dash` e `CH` são separados por espaço simples:
 *   Ex.: `CH c.S > f.S > 236K > RC > Dash > 623HS`.
 */

const NORMAL_ATTACK_BUTTONS: ReadonlySet<ComboInputToken> = new Set<ComboInputToken>([
  'P',
  'K',
  'c.S',
  'S',
  'HS',
  'D',
]);

/**
 * Verifica se um token é um prefixo direcional ou motion que deve se fundir sem espaço
 * ao botão de ataque seguinte (ex.: `2` + `K` -> `2K`, `236` + `P` -> `236P`).
 */
export function isPrefixDirectionalOrMotionToken(token: ComboInputToken): boolean {
  const meta = getInputTokenMetadata(token);
  return meta.category === 'directional' || meta.category === 'motion';
}

/**
 * Verifica se um token é um botão de ataque normal (`P`, `K`, `c.S`, `f.S`, `HS`, `D`).
 * Nota: `Dash` pertence à paleta de ataque na UI, mas na exportação textual é um token independente
 * separado por espaço simples conforme FSD seção 6 (`> RC > Dash > 623HS`).
 */
export function isAttachableAttackToken(token: ComboInputToken): boolean {
  return NORMAL_ATTACK_BUTTONS.has(token);
}

/**
 * Determina se dois tokens adjacentes (`prev` e `current`) devem ser concatenados SEM espaço
 * na string de exportação Numpad.
 */
export function shouldConcatenateWithoutSpace(
  prev: ComboInputToken,
  current: ComboInputToken
): boolean {
  // 1. Ligação por `~` (follow-up imediato / kara cancel) cola tanto no token anterior quanto no posterior:
  // Ex.: `214` + `K` + `~` + `P` = `214K~P`
  if (prev === '~' || current === '~') {
    return true;
  }

  // 2. Direcionais básicos ou motions seguidos diretamente de botões de ataque (P, K, c.S, f.S, HS, D):
  // Ex.: `2` + `K` = `2K`; `236` + `P` = `236P`; `623` + `HS` = `623HS`
  if (isPrefixDirectionalOrMotionToken(prev) && isAttachableAttackToken(current)) {
    return true;
  }

  return false;
}

/**
 * Converte uma lista de tokens visuais (`ComboInputToken[]`) em uma única string de texto
 * no formato padronizado Numpad, seguindo rigorosamente as regras de concatenação e espaçamento do FSD.
 */
export function formatComboSequenceToNumpadText(
  sequence: readonly ComboInputToken[]
): string {
  const validTokens = sequence.filter((token): token is ComboInputToken =>
    isValidComboInputToken(token)
  );

  if (validTokens.length === 0) {
    return '';
  }

  let output = '';

  for (let index = 0; index < validTokens.length; index += 1) {
    const currentToken = validTokens[index];
    const currentLabel = getInputTokenMetadata(currentToken).numpadLabel;

    if (index === 0) {
      output = currentLabel;
      continue;
    }

    const previousToken = validTokens[index - 1];
    if (shouldConcatenateWithoutSpace(previousToken, currentToken)) {
      output += currentLabel;
    } else {
      output += ` ${currentLabel}`;
    }
  }

  return output;
}

export interface CopyComboTextResult {
  success: boolean;
  formattedText: string;
  message: string;
}

/**
 * Copia a sequência de um combo formatada em Numpad para a área de transferência do sistema operacional.
 * Utiliza `navigator.clipboard.writeText` quando disponível no navegador e possui fallback seguro via DOM,
 * registrando falhas locais em `src/logs/` caso o navegador bloqueie o acesso.
 */
export async function copyComboNotationToClipboard(
  sequence: readonly ComboInputToken[]
): Promise<CopyComboTextResult> {
  const formattedText = formatComboSequenceToNumpadText(sequence);

  if (!formattedText) {
    return {
      success: false,
      formattedText: '',
      message: 'Este combo não possui inputs para copiar.',
    };
  }

  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(formattedText);
      return {
        success: true,
        formattedText,
        message: `Copiado no formato Numpad: "${formattedText}"`,
      };
    }

    // Fallback seguro caso a Clipboard API assíncrona não esteja disponível no contexto atual
    if (typeof document !== 'undefined' && document.body) {
      const textarea = document.createElement('textarea');
      textarea.value = formattedText;
      textarea.setAttribute('readonly', 'true');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      document.body.appendChild(textarea);
      textarea.select();
      const copied =
        typeof document.execCommand === 'function' ? document.execCommand('copy') : false;
      document.body.removeChild(textarea);

      if (copied) {
        return {
          success: true,
          formattedText,
          message: `Copiado no formato Numpad: "${formattedText}"`,
        };
      }
    }

    recordLocalLog({
      level: 'error',
      code: 'UNEXPECTED_ERROR',
      userMessage:
        'Não foi possível acessar a área de transferência do navegador para copiar o combo.',
      context: 'copyComboNotationToClipboard.unavailable',
    });

    return {
      success: false,
      formattedText,
      message: 'Área de transferência indisponível neste navegador.',
    };
  } catch (error) {
    recordLocalLog({
      level: 'error',
      code: 'UNEXPECTED_ERROR',
      userMessage:
        'Falha ao copiar a notação do combo para a área de transferência.',
      technicalDetails: error,
      context: 'copyComboNotationToClipboard.catch',
    });

    return {
      success: false,
      formattedText,
      message: 'Falha ao copiar o combo para a área de transferência.',
    };
  }
}
