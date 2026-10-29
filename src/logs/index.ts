/**
 * Tratamento estruturado de logs de erros locais no frontend (FSD seção 19).
 * Captura falhas locais (ex.: QuotaExceededError do Local Storage, JSON inválido ou falhas de validação),
 * envia detalhes formatados ao `console.error` e mantém uma fila segura em memória da sessão
 * para exibição de alertas amigáveis na interface com as cores semânticas do Design System.
 */

export type LocalLogLevel = 'error' | 'warning';

export type LocalErrorCode =
  | 'STORAGE_QUOTA_EXCEEDED'
  | 'STORAGE_UNAVAILABLE'
  | 'STORAGE_INVALID_JSON'
  | 'STORAGE_SCHEMA_INVALID'
  | 'MIGRATION_FAILED'
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_NAME_ERROR'
  | 'UNEXPECTED_ERROR';

export interface LocalLogEntry {
  id: string;
  level: LocalLogLevel;
  code: LocalErrorCode;
  userMessage: string;
  context?: string;
  timestamp: string;
}

type LogListener = (logs: readonly LocalLogEntry[]) => void;

export const DEFAULT_LOG_AUTO_DISMISS_MS = 5000;

const MAX_SESSION_LOGS = 50;
const sessionLogs: LocalLogEntry[] = [];
const listeners = new Set<LogListener>();
const autoDismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

function createLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function clearLogTimer(logId: string): void {
  const timer = autoDismissTimers.get(logId);
  if (timer !== undefined) {
    clearTimeout(timer);
    autoDismissTimers.delete(logId);
  }
}

function clearAllLogTimers(): void {
  autoDismissTimers.forEach((timer) => {
    clearTimeout(timer);
  });
  autoDismissTimers.clear();
}

function notifyListeners(): void {
  const snapshot = [...sessionLogs];
  listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch {
      // Evita que falhas em ouvintes da View quebrem o ciclo de logs
    }
  });
}

/**
 * Detecta se um erro capturado no navegador corresponde a estouro de cota do Local Storage.
 */
export function isQuotaExceededError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const domError = error as { name?: string; code?: number; message?: string };
  return (
    domError.name === 'QuotaExceededError' ||
    domError.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    domError.code === 22 ||
    domError.code === 1014 ||
    (typeof domError.message === 'string' &&
      domError.message.toLowerCase().includes('quota'))
  );
}

/**
 * Sanitiza mensagens de erro antes de enviá-las para a fila da UI,
 * garantindo que nenhum payload HTML/XSS ou stack trace crua chegue ao DOM (FSD seções 19 e 24).
 */
function sanitizeLogUserMessage(rawMessage: string): string {
  const withoutTags = rawMessage
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/<\/?[a-zA-Z][^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/\b(?:javascript|vbscript|data)\s*:/gi, '')
    // Remove eventuais linhas de stack trace caso tenham sido concatenadas acidentalmente
    .replace(/\s+at\s+[^\n]+/g, '')
    .trim();

  return withoutTags.slice(0, 260) || 'Ocorreu um erro inesperado no processamento local.';
}

/**
 * Registra um erro ou aviso local na memória da sessão e envia detalhes técnicos ao console.
 * Nunca expõe pilhas de execução cruas (stack traces) no texto de `userMessage`.
 * Possui fechamento automático (auto close) após alguns segundos por padrão (`autoDismissMs`).
 */
export function recordLocalLog(params: {
  level?: LocalLogLevel;
  code: LocalErrorCode;
  userMessage: string;
  context?: string;
  technicalDetails?: unknown;
  autoDismissMs?: number;
}): LocalLogEntry {
  const entry: LocalLogEntry = {
    id: createLogId(),
    level: params.level ?? 'error',
    code: params.code,
    userMessage: sanitizeLogUserMessage(params.userMessage),
    context: params.context,
    timestamp: new Date().toISOString(),
  };

  sessionLogs.unshift(entry);
  if (sessionLogs.length > MAX_SESSION_LOGS) {
    const removed = sessionLogs.pop();
    if (removed) {
      clearLogTimer(removed.id);
    }
  }

  const autoDismissMs = params.autoDismissMs ?? DEFAULT_LOG_AUTO_DISMISS_MS;
  if (autoDismissMs > 0) {
    const timer = setTimeout(() => {
      dismissLocalLog(entry.id);
    }, autoDismissMs);
    autoDismissTimers.set(entry.id, timer);
  }

  const formattedConsolePrefix = `[GGST Combo Maker][${entry.level.toUpperCase()}][${entry.code}]`;
  const contextLabel = entry.context ? ` (${entry.context})` : '';

  if (entry.level === 'error') {
    console.error(
      `${formattedConsolePrefix}${contextLabel}: ${entry.userMessage}`,
      params.technicalDetails ?? ''
    );
  } else {
    console.warn(
      `${formattedConsolePrefix}${contextLabel}: ${entry.userMessage}`,
      params.technicalDetails ?? ''
    );
  }

  notifyListeners();
  return entry;
}

/**
 * Atalho específico para registrar falhas de armazenamento (Local Storage) de forma amigável.
 */
export function recordStorageError(
  context: string,
  error: unknown,
  fallbackUserMessage = 'Não foi possível salvar ou carregar os dados no navegador.'
): LocalLogEntry {
  if (isQuotaExceededError(error)) {
    return recordLocalLog({
      level: 'error',
      code: 'STORAGE_QUOTA_EXCEEDED',
      userMessage:
        'O limite de armazenamento local do navegador foi atingido. Exclua combos ou pastas antigas para liberar espaço.',
      context,
      technicalDetails: error,
    });
  }

  return recordLocalLog({
    level: 'error',
    code: 'STORAGE_UNAVAILABLE',
    userMessage: fallbackUserMessage,
    context,
    technicalDetails: error,
  });
}

/**
 * Retorna uma cópia imutável dos registros de log da sessão atual.
 */
export function getSessionLogs(): readonly LocalLogEntry[] {
  return [...sessionLogs];
}

/**
 * Retorna o erro ou alerta mais recente ativo na memória da sessão, se houver.
 */
export function getLatestLog(): LocalLogEntry | null {
  return sessionLogs[0] ?? null;
}

/**
 * Remove um alerta específico da memória da sessão após o usuário dispensá-lo na interface
 * ou quando o temporizador de auto close expira.
 */
export function dismissLocalLog(logId: string): void {
  clearLogTimer(logId);
  const index = sessionLogs.findIndex((item) => item.id === logId);
  if (index !== -1) {
    sessionLogs.splice(index, 1);
    notifyListeners();
  }
}

/**
 * Limpa todos os alertas temporários da memória da sessão.
 */
export function clearSessionLogs(): void {
  clearAllLogTimers();
  if (sessionLogs.length > 0) {
    sessionLogs.length = 0;
    notifyListeners();
  }
}

/**
 * Permite que componentes React/Controllers assinem atualizações da fila de logs locais.
 */
export function subscribeToLocalLogs(listener: LogListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
