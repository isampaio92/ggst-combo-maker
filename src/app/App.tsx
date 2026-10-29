import React, { useCallback, useMemo, useState } from 'react';
import { APP_CONFIG } from '../config/config';
import { useAppController, useComboEditorController } from '../controllers';
import { type Combo } from '../models';
import {
  AlertBannerList,
  ComboEditorView,
  ComboReadOnlyView,
  NewComboModal,
  SidebarView,
} from '../views';

/**
 * Componente raiz da aplicação GGST Combo Maker (Fase 6 — Tratamento Visual de Erros, Sanitização XSS e Preparação para Deploy).
 * Orquestra o Controller principal (`useAppController`), o Controller do Editor (`useComboEditorController`),
 * o estado visual de erros (`#FF3333`) e alertas (`#FF9900`) de `src/logs/`, o toggle global Setas/Numpad,
 * a Sidebar de organização e o painel principal de leitura/edição.
 */
export const App: React.FC = () => {
  const {
    folders,
    combos,
    settings,
    logs,
    setVisualPreference,
    toggleVisualPreference,
    createFolder,
    renameFolder,
    deleteFolder,
    saveCombo,
    renameCombo,
    moveComboToFolder,
    deleteCombo,
    dismissLog,
    clearLogs,
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
          <div
            className="visual-preference-toggle"
            role="group"
            aria-label="Alternar formato de exibição entre Setas e Numpad"
            data-testid="visual-preference-toggle"
          >
            <span className="visual-preference-toggle__label">EXIBIÇÃO:</span>
            <button
              type="button"
              className={`visual-preference-toggle__btn ${
                settings.visual_preference === 'arrows'
                  ? 'visual-preference-toggle__btn--active'
                  : ''
              }`}
              aria-pressed={settings.visual_preference === 'arrows'}
              onClick={() => setVisualPreference('arrows')}
              data-testid="btn-toggle-arrows"
              title="Exibir direcionais e motions como Setas (↙, ↓, ↓↘→)"
            >
              Setas (↓↘→)
            </button>
            <button
              type="button"
              className={`visual-preference-toggle__btn ${
                settings.visual_preference === 'numpad'
                  ? 'visual-preference-toggle__btn--active'
                  : ''
              }`}
              aria-pressed={settings.visual_preference === 'numpad'}
              onClick={() => setVisualPreference('numpad')}
              data-testid="btn-toggle-numpad"
              title="Exibir direcionais e motions em formato Numpad (1, 2, 236)"
            >
              Numpad (236)
            </button>
            <button
              type="button"
              className="btn-system-secondary visual-preference-toggle__quick"
              onClick={toggleVisualPreference}
              data-testid="btn-toggle-visual-preference"
              title="Alternar rapidamente entre Setas e Numpad"
            >
              ⇄ Alternar
            </button>
          </div>

          <button
            type="button"
            className="btn-system-primary"
            onClick={() => openNewComboModal(selectedCombo?.character)}
            title="Criar um novo combo com seleção obrigatória de personagem"
          >
            + Novo Combo
          </button>

          <span>
            Pastas: <strong style={{ color: 'var(--text-primary)' }}>{folders.length}</strong>
          </span>
          <span>
            Combos: <strong style={{ color: 'var(--text-primary)' }}>{combos.length}</strong>
          </span>
        </div>
      </header>

      <AlertBannerList
        logs={logs}
        onDismissLog={dismissLog}
        onClearAllLogs={clearLogs}
      />

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
            <ComboReadOnlyView
              combo={selectedCombo}
              folder={selectedComboFolder}
              visualPreference={settings.visual_preference}
              onStartEditing={startEditingExistingCombo}
            />
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
