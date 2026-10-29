import React, { useMemo, useState } from 'react';
import { APP_CONFIG } from '../config/config';
import { useAppController } from '../controllers';
import { SidebarView } from '../views';

/**
 * Componente raiz da aplicação GGST Combo Maker (Fase 3 — Módulo de Organização / Sidebar).
 * Orquestra o Controller principal (`useAppController`) e renderiza a barra lateral de organização
 * (pastas ordenadas alfabeticamente, combos por `updated_at` decrescente, renomeação com lápis,
 * exclusão definitiva com confirmação e Drag and Drop entre pastas) e o painel central.
 */
export const App: React.FC = () => {
  const {
    isInitialized,
    migrationState,
    folders,
    combos,
    settings,
    logs,
    createFolder,
    renameFolder,
    deleteFolder,
    renameCombo,
    moveComboToFolder,
    deleteCombo,
    dismissLog,
  } = useAppController();

  const [selectedComboId, setSelectedComboId] = useState<string | null>(null);

  const selectedCombo = useMemo(
    () => combos.find((combo) => combo.id === selectedComboId) ?? null,
    [combos, selectedComboId]
  );

  const selectedComboFolder = useMemo(
    () =>
      selectedCombo
        ? folders.find((folder) => folder.id === selectedCombo.folder_id) ?? null
        : null,
    [folders, selectedCombo]
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <h1 className="app-header__title">{APP_CONFIG.appName}</h1>
          <span className="app-header__subtitle">
            v{APP_CONFIG.version} / ORGANIZAÇÃO DE PASTAS E COMBOS
          </span>
        </div>

        <div className="app-header__status">
          <span>
            Status DB Local:{' '}
            <strong
              style={{
                color: isInitialized ? 'var(--state-success)' : 'var(--state-warning)',
              }}
            >
              {isInitialized
                ? `MIGRATION V${migrationState?.current_version ?? 1} OK`
                : 'INICIALIZANDO...'}
            </strong>
          </span>
          <span>
            Pastas: <strong style={{ color: 'var(--text-primary)' }}>{folders.length}</strong>
          </span>
          <span>
            Combos: <strong style={{ color: 'var(--text-primary)' }}>{combos.length}</strong>
          </span>
          <span>
            Notação:{' '}
            <strong
              style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}
            >
              {settings.visual_preference === 'arrows' ? 'Setas' : 'Numpad'}
            </strong>
          </span>
        </div>
      </header>

      {logs.length > 0 && (
        <section aria-live="polite" className="app-alerts">
          {logs.map((entry) => {
            const isError = entry.level === 'error';
            const borderColor = isError
              ? 'var(--state-error)'
              : 'var(--state-warning)';

            return (
              <div
                key={entry.id}
                role="alert"
                className={`app-alert-card ${
                  isError ? 'app-alert-card--error' : 'app-alert-card--warning'
                }`}
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
                    {isError ? 'ERRO:' : 'AVISO:'}
                  </strong>
                  <span>{entry.userMessage}</span>
                </div>
                <button
                  type="button"
                  className="btn-system-secondary"
                  onClick={() => dismissLog(entry.id)}
                >
                  Fechar
                </button>
              </div>
            );
          })}
        </section>
      )}

      <main className="app-workspace">
        <SidebarView
          folders={folders}
          combos={combos}
          selectedComboId={selectedComboId}
          onSelectCombo={setSelectedComboId}
          createFolder={createFolder}
          renameFolder={renameFolder}
          deleteFolder={deleteFolder}
          renameCombo={renameCombo}
          moveComboToFolder={moveComboToFolder}
          deleteCombo={deleteCombo}
        />

        <section className="stage-panel" aria-label="Área Principal do Combo">
          {selectedCombo ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                  gap: 'var(--space-sm)',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: 'var(--space-md)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <div>
                  <span
                    style={{
                      color: 'var(--brand-red)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.1rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {selectedComboFolder?.name ?? 'PASTA'} / {selectedCombo.character}
                  </span>
                  <h2 style={{ fontSize: '2rem', marginTop: 'var(--space-xs)' }}>
                    {selectedCombo.name}
                  </h2>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Última edição:{' '}
                  {new Date(selectedCombo.updated_at).toLocaleString('pt-BR')}
                </span>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                Sequência registrada ({selectedCombo.sequence.length} inputs):
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-sm)',
                  overflowX: 'auto',
                  padding: 'var(--space-md)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedCombo.sequence.map((token, index) => (
                  <span
                    key={`${token}-${index}`}
                    style={{
                      padding: 'var(--space-xs) var(--space-sm)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.1rem',
                    }}
                  >
                    {token}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '300px',
                gap: 'var(--space-sm)',
              }}
            >
              <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>
                PAINEL DE COMBOS PRONTO
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  maxWidth: '520px',
                  lineHeight: 1.6,
                }}
              >
                Use a barra lateral à esquerda para criar pastas livres, renomear itens com o
                ícone de lápis, excluir pastas ou combos com confirmação definitiva e organizar
                combos entre pastas via <strong>Drag and Drop</strong>. A paleta interativa de
                criação e edição de combos será habilitada na Fase 4.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
