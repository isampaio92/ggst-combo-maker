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

const MAX_SESSION_LOGS = 50;
const sessionLogs: LocalLogEntry[] = [];
const listeners = new Set<LogListener>();

function createLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
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
 * Registra um erro ou aviso local na memória da sessão e envia detalhes técnicos ao console.
 * Nunca expõe pilhas de execução cruas (stack traces) no texto de `userMessage`.
 */
export function recordLocalLog(params: {
  level?: LocalLogLevel;
  code: LocalErrorCode;
  userMessage: string;
  context?: string;
  technicalDetails?: unknown;
}): LocalLogEntry {
  const entry: LocalLogEntry = {
    id: createLogId(),
    level: params.level ?? 'error',
    code: params.code,
    userMessage: params.userMessage,
    context: params.context,
    timestamp: new Date().toISOString(),
  };

  sessionLogs.unshift(entry);
  if (sessionLogs.length > MAX_SESSION_LOGS) {
    sessionLogs.pop();
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
 * Remove um alerta específico da memória da sessão após o usuário dispensá-lo na interface.
 */
export function dismissLocalLog(logId: string): void {
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
