import React from 'react';
import { APP_CONFIG } from '../config/config';
import { useAppController } from '../controllers';

/**
 * Componente raiz (Fase 2 - Persistência em Local Storage, Migrations, Logs Locais e Base MVC).
 * Aciona silenciosamente o Controller principal (`useAppController`) para executar as migrations
 * e inicializar as chaves lógicas no Local Storage (`folders`, `combos`, `settings` e `migrations`).
 * Os módulos visuais completos (Sidebar, Criação/Edição e Leitura) serão construídos nas Fases 3 a 6.
 */
export const App: React.FC = () => {
  const {
    isInitialized,
    migrationState,
    folders,
    combos,
    settings,
    logs,
    dismissLog,
  } = useAppController();

  return (
    <main style={{ padding: 'var(--space-xl)', maxWidth: '1200px', margin: '0 auto' }}>
      <header
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '4px solid var(--brand-red)',
          padding: 'var(--space-lg)',
          boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2.5rem', lineHeight: 1 }}>{APP_CONFIG.appName}</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
            Base MVC, Local Storage e Migrations ativas (v{APP_CONFIG.version}).
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span>
            Status DB Local:{' '}
            <strong style={{ color: isInitialized ? 'var(--state-success)' : 'var(--state-warning)' }}>
              {isInitialized
                ? `MIGRATION V${migrationState?.current_version ?? 1} OK`
                : 'INICIALIZANDO...'}
            </strong>
          </span>
          <span style={{ marginLeft: 'var(--space-md)' }}>
            Pastas: <strong style={{ color: 'var(--text-primary)' }}>{folders.length}</strong>
          </span>
          <span style={{ marginLeft: 'var(--space-md)' }}>
            Combos: <strong style={{ color: 'var(--text-primary)' }}>{combos.length}</strong>
          </span>
          <span style={{ marginLeft: 'var(--space-md)' }}>
            Notação:{' '}
            <strong style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
              {settings.visual_preference === 'arrows' ? 'Setas' : 'Numpad'}
            </strong>
          </span>
        </div>
      </header>

      {logs.length > 0 && (
        <section
          aria-live="polite"
          style={{
            marginTop: 'var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
          }}
        >
          {logs.map((entry) => {
            const borderColor =
              entry.level === 'error' ? 'var(--state-error)' : 'var(--state-warning)';
            return (
              <div
                key={entry.id}
                role="alert"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderLeft: `4px solid ${borderColor}`,
                  padding: 'var(--space-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.8)',
                }}
              >
                <div>
                  <strong
                    style={{
                      color: borderColor,
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.125rem',
                      letterSpacing: '0.04em',
                      marginRight: 'var(--space-sm)',
                    }}
                  >
                    {entry.level === 'error' ? 'ERRO:' : 'AVISO:'}
                  </strong>
                  <span>{entry.userMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => dismissLog(entry.id)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-heading)',
                    textTransform: 'uppercase',
                  }}
                >
                  Fechar
                </button>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default App;
