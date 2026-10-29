import React, { useEffect } from 'react';
import { type LocalLogEntry } from '../logs';

export const DEFAULT_ALERT_AUTO_CLOSE_MS = 5000;

export interface AlertBannerListProps {
  logs: readonly LocalLogEntry[];
  onDismissLog: (logId: string) => void;
  onClearAllLogs?: () => void;
  autoCloseMs?: number;
}

interface AlertBannerItemProps {
  entry: LocalLogEntry;
  onDismissLog: (logId: string) => void;
  autoCloseMs: number;
}

const AlertBannerItem: React.FC<AlertBannerItemProps> = ({
  entry,
  onDismissLog,
  autoCloseMs,
}) => {
  useEffect(() => {
    if (autoCloseMs <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      onDismissLog(entry.id);
    }, autoCloseMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [entry.id, onDismissLog, autoCloseMs]);

  const isError = entry.level === 'error';
  const stateColor = isError ? 'var(--state-error)' : 'var(--state-warning)';

  return (
    <div
      role="alert"
      data-testid={`app-alert-card-${entry.level}`}
      data-log-code={entry.code}
      className={`app-alert-card ${
        isError ? 'app-alert-card--error' : 'app-alert-card--warning'
      }`}
    >
      <div className="app-alert-card__content">
        <span
          className="app-alert-card__badge"
          style={{
            color: stateColor,
          }}
        >
          {isError ? 'ERRO:' : 'AVISO:'}
        </span>
        <span className="app-alert-card__message">{entry.userMessage}</span>
      </div>

      <button
        type="button"
        className="btn-system-secondary app-alert-card__dismiss"
        onClick={() => onDismissLog(entry.id)}
        aria-label={`Fechar alerta: ${entry.userMessage}`}
        data-testid="btn-dismiss-alert"
      >
        Fechar
      </button>
    </div>
  );
};

/**
 * Componente visual para exibição de erros (`#FF3333`) e alertas/warnings (`#FF9900`)
 * na interface principal (Fase 6 — FSD seção 19 e DESIGN.md seção 9).
 * Consome a fila segura em memória da sessão (`src/logs/`) sem expor pilhas de execução cruas
 * e realiza o fechamento automático (auto close) de cada alerta após alguns segundos.
 */
export const AlertBannerList: React.FC<AlertBannerListProps> = ({
  logs,
  onDismissLog,
  onClearAllLogs,
  autoCloseMs = DEFAULT_ALERT_AUTO_CLOSE_MS,
}) => {
  if (logs.length === 0) {
    return null;
  }

  return (
    <section
      aria-live="polite"
      aria-label="Alertas e Mensagens do Sistema"
      className="app-alerts"
      data-testid="app-alerts-region"
    >
      {logs.length > 1 && onClearAllLogs && (
        <div className="app-alerts__toolbar">
          <span className="app-alerts__count">
            {logs.length} {logs.length === 1 ? 'alerta ativo' : 'alertas ativos'}
          </span>
          <button
            type="button"
            className="btn-system-secondary app-alerts__clear-btn"
            onClick={onClearAllLogs}
            data-testid="btn-clear-all-alerts"
          >
            Limpar Todos
          </button>
        </div>
      )}

      {logs.map((entry) => (
        <AlertBannerItem
          key={entry.id}
          entry={entry}
          onDismissLog={onDismissLog}
          autoCloseMs={autoCloseMs}
        />
      ))}
    </section>
  );
};
