import React, { useCallback, useMemo, useState } from 'react';
import { APP_CONFIG } from '../config/config';
import { useAppController, useComboEditorController } from '../controllers';
import { type Combo } from '../models';
import {
  ComboEditorView,
  GameInputTokenBadge,
  NewComboModal,
  SidebarView,
} from '../views';

/**
 * Componente raiz da aplicação GGST Combo Maker (Fase 4 — Módulo de Criação e Edição de Combos).
 * Orquestra o Controller principal (`useAppController`), o Controller do Editor (`useComboEditorController`),
 * a Sidebar de organização e o painel principal de criação/edição e visualização.
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
    saveCombo,
    renameCombo,
    moveComboToFolder,
    deleteCombo,
    dismissLog,
  } = useAppController();

  const [selectedComboId, setSelectedComboId] = useState<string | null>(null);

  const handleComboSaved = useCallback((savedCombo: Combo) => {
    setSelectedComboId(savedCombo.id);
  }, []);

  const {
    isNewComboModalOpen,
    modalComboName,
    modalCharacter,
    modalError,
    activeDraft,
    editorError,
    editorSuccessMessage,
    duplicateWarning,
    openNewComboModal,
    closeNewComboModal,
    handleModalComboNameChange,
    handleModalCharacterChange,
    confirmNewComboModal,
    startEditingExistingCombo,
    closeEditor,
    addInputToSequence,
    undoLastInput,
    updateDraftName,
    handleSaveDraft,
    confirmOverwriteDuplicate,
    cancelOverwriteDuplicate,
  } = useComboEditorController({
    folders,
    saveCombo,
    onComboSaved: handleComboSaved,
  });

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

  const handleSelectComboFromSidebar = useCallback(
    (comboId: string | null) => {
      setSelectedComboId(comboId);
      closeEditor();
    },
    [closeEditor]
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <h1 className="app-header__title">{APP_CONFIG.appName}</h1>
          <span className="app-header__subtitle">
            v{APP_CONFIG.version} / CRIAÇÃO E ORGANIZAÇÃO DE COMBOS
          </span>
        </div>

        <div className="app-header__status">
          <button
            type="button"
            className="btn-system-primary"
            onClick={() => openNewComboModal(selectedCombo?.character)}
            title="Criar um novo combo com seleção obrigatória de personagem"
          >
            + Novo Combo
          </button>

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
          onSelectCombo={handleSelectComboFromSidebar}
          onRequestNewCombo={() => openNewComboModal(selectedCombo?.character)}
          createFolder={createFolder}
          renameFolder={renameFolder}
          deleteFolder={deleteFolder}
          renameCombo={renameCombo}
          moveComboToFolder={moveComboToFolder}
          deleteCombo={deleteCombo}
        />

        <section className="stage-panel" aria-label="Área Principal do Combo">
          {activeDraft ? (
            <ComboEditorView
              draft={activeDraft}
              visualPreference={settings.visual_preference}
              errorMessage={editorError}
              successMessage={editorSuccessMessage}
              duplicateWarning={duplicateWarning}
              onAddInput={addInputToSequence}
              onUndoLastInput={undoLastInput}
              onUpdateDraftName={updateDraftName}
              onSaveDraft={() => handleSaveDraft(false)}
              onConfirmOverwrite={confirmOverwriteDuplicate}
              onCancelOverwrite={cancelOverwriteDuplicate}
              onCloseEditor={closeEditor}
            />
          ) : selectedCombo ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--space-md)',
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
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Última edição:{' '}
                    {new Date(selectedCombo.updated_at).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-system-primary"
                    onClick={() => startEditingExistingCombo(selectedCombo)}
                    title="Abrir a paleta interativa para editar este combo"
                  >
                    Editar Combo
                  </button>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
                Sequência visual ({selectedCombo.sequence.length}{' '}
                {selectedCombo.sequence.length === 1 ? 'input' : 'inputs'}):
              </p>

              <div className="combo-sequence-track" data-testid="combo-readonly-track">
                {selectedCombo.sequence.map((token, index) => (
                  <div
                    key={`${token}-${index}`}
                    className="combo-sequence-track__item"
                  >
                    <GameInputTokenBadge
                      token={token}
                      visualPreference={settings.visual_preference}
                      size="md"
                    />
                  </div>
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
                minHeight: '320px',
                gap: 'var(--space-md)',
              }}
            >
              <h2 style={{ fontSize: '1.9rem', color: 'var(--text-primary)' }}>
                CRIE OU SELECIONE UM COMBO
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  maxWidth: '540px',
                  lineHeight: 1.6,
                }}
              >
                Clique em <strong>+ Novo Combo</strong> para escolher um dos 33 personagens
                oficiais de <em>Guilty Gear -Strive-</em>, definir o nome do combo e montar a
                sequência visual usando a paleta de inputs. A pasta do personagem será criada
                automaticamente ao salvar.
              </p>
              <button
                type="button"
                className="btn-system-primary"
                onClick={() => openNewComboModal()}
              >
                + Novo Combo
              </button>
            </div>
          )}
        </section>
      </main>

      <NewComboModal
        isOpen={isNewComboModalOpen}
        comboName={modalComboName}
        selectedCharacter={modalCharacter}
        errorMessage={modalError}
        onComboNameChange={handleModalComboNameChange}
        onCharacterChange={handleModalCharacterChange}
        onConfirm={confirmNewComboModal}
        onCancel={closeNewComboModal}
      />
    </div>
  );
};

export default App;
