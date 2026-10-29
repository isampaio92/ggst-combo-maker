import React from 'react';
import { useSidebarController } from '../controllers';
import { type Combo, type Folder } from '../models';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export interface SidebarViewProps {
  folders: readonly Folder[];
  combos: readonly Combo[];
  selectedComboId: string | null;
  onSelectCombo: (comboId: string | null) => void;
  onRequestNewCombo: () => void;
  createFolder: (name: string) => Folder | null;
  renameFolder: (folderId: string, newName: string) => Folder | null;
  deleteFolder: (folderId: string) => boolean;
  renameCombo: (comboId: string, newName: string) => Combo | null;
  moveComboToFolder: (comboId: string, targetFolderId: string) => Combo | null;
  deleteCombo: (comboId: string) => boolean;
}

/**
 * Formata o timestamp `updated_at` para leitura rápida na listagem.
 */
function formatUpdatedAt(timestamp: number): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  } catch {
    return '';
  }
}

/**
 * Módulo de Organização (Sidebar) — View (MVC).
 * Renderiza pastas em ordem alfabética e combos internos por `updated_at` decrescente.
 * Oferece criação manual de pastas, renomeação com ícone de lápis, exclusão com confirmação
 * e movimentação de combos via Drag and Drop preservando o `updated_at`.
 */
export const SidebarView: React.FC<SidebarViewProps> = (props) => {
  const {
    indexedTree,
    isEmptyState,
    isCreatingFolder,
    newFolderName,
    createFolderError,
    editingEntity,
    pendingDeletion,
    draggedComboId,
    dragOverFolderId,
    isFolderExpanded,
    toggleFolderExpand,
    openCreateFolderForm,
    cancelCreateFolderForm,
    handleNewFolderNameChange,
    submitCreateFolder,
    startRenameFolder,
    startRenameCombo,
    updateEditingDraftName,
    cancelEditing,
    submitRename,
    requestDeleteFolder,
    requestDeleteCombo,
    cancelPendingDeletion,
    confirmPendingDeletion,
    handleComboDragStart,
    handleComboDragEnd,
    handleFolderDragOver,
    handleFolderDragLeave,
    handleFolderDrop,
  } = useSidebarController(props);

  const handleCreateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitCreateFolder();
  };

  const handleRenameSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitRename();
  };

  return (
    <aside className="sidebar" aria-label="Organização de Pastas e Combos">
      <div className="sidebar__header">
        <h2 className="sidebar__title">PASTAS / COMBOS</h2>
        <div className="sidebar__header-actions">
          <button
            type="button"
            className="btn-system-secondary"
            onClick={openCreateFolderForm}
            title="Criar uma nova pasta livre"
          >
            + Nova Pasta
          </button>
          <button
            type="button"
            className="btn-system-primary"
            onClick={props.onRequestNewCombo}
            title="Iniciar a criação de um novo combo (seleção obrigatória de personagem)"
          >
            + Novo Combo
          </button>
        </div>
      </div>

      {isCreatingFolder && (
        <form className="sidebar__create-box" onSubmit={handleCreateSubmit} noValidate>
          <label htmlFor="new-folder-input" className="ggst-label">
            NOME DA NOVA PASTA
          </label>
          <div className="sidebar__create-row">
            <input
              id="new-folder-input"
              type="text"
              className="ggst-input"
              placeholder="Ex.: Punishes de Canto"
              value={newFolderName}
              maxLength={80}
              autoFocus
              onChange={(event) => handleNewFolderNameChange(event.target.value)}
            />
          </div>
          {createFolderError && (
            <div className="sidebar__feedback-error" role="alert">
              {createFolderError}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-xs)',
              marginTop: 'var(--space-sm)',
            }}
          >
            <button
              type="button"
              className="btn-system-secondary"
              onClick={cancelCreateFolderForm}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-system-primary">
              Criar Pasta
            </button>
          </div>
        </form>
      )}

      {isEmptyState ? (
        <div className="sidebar__empty" data-testid="sidebar-empty-state">
          <svg
            className="sidebar__empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path d="M3 6h6l2 2h10v11H3V6z" />
            <path d="M8 13h8" />
          </svg>
          <h3 className="sidebar__empty-title">NENHUMA PASTA OU COMBO SALVO</h3>
          <p className="sidebar__empty-text">
            Clique em <strong>+ Nova Pasta</strong> acima para criar uma pasta livre ou inicie um{' '}
            <strong>Novo Combo</strong> para gerar automaticamente a pasta do personagem.
          </p>
        </div>
      ) : (
        <ul className="sidebar__folder-list">
          {indexedTree.map(({ folder, combos: folderCombos }) => {
            const expanded = isFolderExpanded(folder.id);
            const isEditingThisFolder =
              editingEntity?.type === 'folder' && editingEntity.id === folder.id;
            const isDragOverThisFolder = dragOverFolderId === folder.id;

            return (
              <li
                key={folder.id}
                className={`folder-item ${
                  isDragOverThisFolder ? 'folder-item--drag-over' : ''
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';
                  handleFolderDragOver(folder.id);
                }}
                onDragLeave={() => {
                  handleFolderDragLeave(folder.id);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const transferredId = event.dataTransfer.getData('text/plain');
                  handleFolderDrop(folder.id, transferredId);
                }}
              >
                {isEditingThisFolder ? (
                  <form
                    className="folder-item__rename-form"
                    onSubmit={handleRenameSubmit}
                    noValidate
                  >
                    <label
                      htmlFor={`rename-folder-${folder.id}`}
                      className="ggst-label"
                    >
                      RENOMEAR PASTA
                    </label>
                    <div className="folder-item__rename-controls">
                      <input
                        id={`rename-folder-${folder.id}`}
                        type="text"
                        className="ggst-input"
                        value={editingEntity.draftName}
                        maxLength={80}
                        autoFocus
                        onChange={(event) =>
                          updateEditingDraftName(event.target.value)
                        }
                      />
                      <button type="submit" className="btn-system-primary">
                        Salvar
                      </button>
                      <button
                        type="button"
                        className="btn-system-secondary"
                        onClick={cancelEditing}
                      >
                        Cancelar
                      </button>
                    </div>
                    {editingEntity.errorMessage && (
                      <div className="sidebar__feedback-error" role="alert">
                        {editingEntity.errorMessage}
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="folder-item__header">
                    <button
                      type="button"
                      className="folder-item__toggle"
                      onClick={() => toggleFolderExpand(folder.id)}
                      aria-expanded={expanded}
                    >
                      <span aria-hidden="true" style={{ fontSize: '0.85rem' }}>
                        {expanded ? '▼' : '▶'}
                      </span>
                      <span>{folder.name}</span>
                      <span className="folder-item__count" title="Total de combos na pasta">
                        {folderCombos.length}
                      </span>
                    </button>

                    <div className="folder-item__actions">
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => startRenameFolder(folder)}
                        aria-label={`Renomear pasta ${folder.name}`}
                        title="Renomear pasta"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className="btn-icon btn-icon--danger"
                        onClick={() => requestDeleteFolder(folder)}
                        aria-label={`Excluir pasta ${folder.name}`}
                        title="Excluir pasta definitivamente"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {expanded && (
                  <ul className="combo-list">
                    {folderCombos.length === 0 ? (
                      <li className="combo-list__empty">
                        Pasta vazia — arraste combos para cá ou salve um novo combo.
                      </li>
                    ) : (
                      folderCombos.map((combo) => {
                        const isSelected = props.selectedComboId === combo.id;
                        const isDragging = draggedComboId === combo.id;
                        const isEditingThisCombo =
                          editingEntity?.type === 'combo' &&
                          editingEntity.id === combo.id;

                        if (isEditingThisCombo) {
                          return (
                            <li
                              key={combo.id}
                              className="folder-item__rename-form"
                            >
                              <form onSubmit={handleRenameSubmit} noValidate>
                                <label
                                  htmlFor={`rename-combo-${combo.id}`}
                                  className="ggst-label"
                                >
                                  RENOMEAR COMBO
                                </label>
                                <div className="folder-item__rename-controls">
                                  <input
                                    id={`rename-combo-${combo.id}`}
                                    type="text"
                                    className="ggst-input"
                                    value={editingEntity.draftName}
                                    maxLength={80}
                                    autoFocus
                                    onChange={(event) =>
                                      updateEditingDraftName(event.target.value)
                                    }
                                  />
                                  <button
                                    type="submit"
                                    className="btn-system-primary"
                                  >
                                    Salvar
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-system-secondary"
                                    onClick={cancelEditing}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                                {editingEntity.errorMessage && (
                                  <div
                                    className="sidebar__feedback-error"
                                    role="alert"
                                  >
                                    {editingEntity.errorMessage}
                                  </div>
                                )}
                              </form>
                            </li>
                          );
                        }

                        return (
                          <li
                            key={combo.id}
                            className={`combo-item ${
                              isSelected ? 'combo-item--active' : ''
                            } ${isDragging ? 'combo-item--dragging' : ''}`}
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.setData('text/plain', combo.id);
                              event.dataTransfer.effectAllowed = 'move';
                              handleComboDragStart(combo.id);
                            }}
                            onDragEnd={handleComboDragEnd}
                            title="Arraste para mover este combo para outra pasta"
                          >
                            <button
                              type="button"
                              className="combo-item__select"
                              onClick={() => props.onSelectCombo(combo.id)}
                            >
                              <span className="combo-item__name">{combo.name}</span>
                              <span className="combo-item__meta">
                                <span className="combo-item__character">
                                  {combo.character}
                                </span>
                                <span aria-hidden="true">/</span>
                                <span>{combo.sequence.length} inputs</span>
                                <span aria-hidden="true">/</span>
                                <span>{formatUpdatedAt(combo.updated_at)}</span>
                              </span>
                            </button>

                            <div className="combo-item__actions">
                              <button
                                type="button"
                                className="btn-icon"
                                onClick={() => startRenameCombo(combo)}
                                aria-label={`Renomear combo ${combo.name}`}
                                title="Renomear combo"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  aria-hidden="true"
                                >
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                              </button>

                              <button
                                type="button"
                                className="btn-icon btn-icon--danger"
                                onClick={() => requestDeleteCombo(combo)}
                                aria-label={`Excluir combo ${combo.name}`}
                                title="Excluir combo definitivamente"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  aria-hidden="true"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-1 14H6L5 6" />
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M9 6V4h6v2" />
                                </svg>
                              </button>
                            </div>
                          </li>
                        );
                      })
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDeleteModal
        pendingDeletion={pendingDeletion}
        onConfirm={confirmPendingDeletion}
        onCancel={cancelPendingDeletion}
      />
    </aside>
  );
};
