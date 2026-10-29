# Status do Projeto — GGST Combo Maker (`docs/STATUS.md`)

- **Estado atual do projeto:** Todas as 6 fases previstas em `docs/PLANO.md` (Fases 1 a 6) foram integralmente construídas e validadas com sucesso (`npm run typecheck`, `npm run build` e suíte de testes de integração da Fase 6 operacionais).
- **Fase atual:** Fase 6 concluída (100% das fases do plano de construção concluídas).
- **Próximo passo recomendado:** Executar `git push` para atualizar o backup remoto no GitHub e, caso desejado, realizar a validação final de segurança ou publicação estática do pacote `dist/` no GitHub Pages.
- **Última atualização:** 2026-10-29 15:16 (BRT)

---

## Controle de Versão e Backup (Git / GitHub)

- [x] **Git verificado e inicializado:** Repositório Git local inicializado na branch `main` (`git init` e `git branch -M main`).
- [x] **`.gitignore` revisado:** Ajustado para a stack TypeScript + React + Vite (ignorando `node_modules/`, `dist/`, `dist-ssr/`, `.vite/`, `*.tsbuildinfo`, `.env*`, certificados/chaves privadas, `/logs/` apenas na raiz sem afetar `src/logs/`, backups e arquivos de sistema/IDE).
- [x] **`.gitattributes` criado:** Padronização de finais de linha (`LF`) para códigos-fonte, JSON e Markdown, e marcação binária para imagens (`*.png`, etc.).
- [x] **Arquivos sensíveis protegidos:** Conferência realizada via `git add --dry-run .` e `git status`; nenhum segredo, `.env` ou cache de build foi versionado.
- [x] **Commits realizados:** Commit inicial (`"Estrutura inicial do projeto"`), commit da Fase 2, commit da Fase 3, commit da Fase 4, commit da Fase 5 e commit da Fase 6 na branch `main`.
- [x] **Repositório GitHub:** Conectado a `origin/main`.
- [ ] **Push da Fase 6 para o GitHub:** Pendente de ação do usuário (`git push`).

---

## Progresso por Fase (`docs/PLANO.md`)

### Fase 1 — Infraestrutura, Configuração Base e Estilização Global (CONCLUÍDA)
- [x] Inicializar configuração do projeto com Node.js, Vite, React e TypeScript (`package.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`).
- [x] Criar a estrutura de diretórios do padrão MVC: `src/config/`, `src/app/`, `src/models/`, `src/controllers/`, `src/views/`, `src/assets/`, `src/database/migrations/` e `src/logs/`.
- [x] Implementar `src/config/config.ts` com parâmetros globais do sistema, nomes das chaves lógicas do Local Storage (`folders`, `combos`, `settings`, controle de migrations), preferência visual padrão e a lista fixa de 33 personagens em ordem alfabética.
- [x] Configurar `index.html` e a estilização global base (`src/assets/styles/global.css`) seguindo a paleta de cores, tipografia (`Teko`/`Oswald`, `Inter`/`Roboto`), espaçamentos (grid de 8px) e regras de contraste do `docs/DESIGN.md`.
- [x] Criar o ponto de entrada inicial (`src/main.tsx` e `src/app/App.tsx`) e instalar as dependências locais do projeto.
- [x] Validar compilação TypeScript e build estático do Vite garantindo que a estrutura bruta de diretórios internos não fique exposta no pacote de produção.

### Fase 2 — Persistência em Local Storage, Migrations, Logs Locais e Base MVC (CONCLUÍDA)
- [x] Definir as interfaces e tipos TypeScript das entidades (`Folder`, `Combo`, `Settings`, tipos de inputs e schema do Local Storage) em `src/models/types.ts`.
- [x] Implementar o mecanismo de log de erros locais em `src/logs/index.ts` para captura amigável de falhas (ex.: estouro de cota do Local Storage ou JSON inválido), registro formatado em `console.error` e armazenamento temporário em memória da sessão para exibição de alertas na UI.
- [x] Implementar a arquitetura de migrations em `src/database/migrations/001_init_schema.ts` e `src/database/migrations/index.ts` com chave de controle de versões executadas (evitando execuções duplicadas) e inicialização/validação das tabelas lógicas `folders`, `combos` e `settings` e suas constraints de integridade.
- [x] Implementar os Models de leitura e escrita segura no Local Storage em `src/models/storage.ts`, `src/models/settingsModel.ts`, `src/models/folderModel.ts`, `src/models/comboModel.ts` e `src/models/index.ts`.
- [x] Criar os Controllers/Hooks base em `src/controllers/useAppController.ts` e `src/controllers/index.ts` que acionam as migrations silenciosamente no ciclo de inicialização da aplicação React (`src/app/App.tsx`) e expõem operações básicas sobre configurações, pastas e combos.

### Fase 3 — Módulo de Organização (Sidebar), Gestão de Pastas e Drag and Drop (CONCLUÍDA)
- [x] Implementar a listagem indexada na Sidebar (`src/views/SidebarView.tsx` e `src/controllers/useSidebarController.ts`): pastas ordenadas alfabeticamente e combos internos ordenados por `updated_at` decrescente (`buildIndexedFolderTree`).
- [x] Exibir mensagem instrutiva de Estado Vazio (`#A0A0A0` / `#333333`) quando não houver pastas ou combos cadastrados.
- [x] Implementar criação manual de pastas livres com validação de nome obrigatório e único (`validateFolderNameUniqueness`).
- [x] Implementar renomeação de pastas e de combos através do ícone de lápis na listagem, bloqueando nomes já em uso no mesmo nível com mensagem de erro (`validateComboRenameUniqueness` e feedback inline + log local).
- [x] Implementar exclusão de pastas (e seus combos internos) e de combos individuais com aviso obrigatório de confirmação na tela (`src/views/ConfirmDeleteModal.tsx`) e remoção definitiva do Local Storage (sem *soft delete*).
- [x] Implementar o recurso de *Drag and Drop* permitindo arrastar e soltar combos entre pastas, atualizando o `folder_id` sem alterar a data de edição (`updated_at`).

**Resumo de Testes da Fase 3:**
- `npm run typecheck`: Aprovado sem erros (`tsc --noEmit`).
- `npm run build`: Aprovado; pacote de produção gerado em `dist/` sem expor diretórios internos.
- Teste automatizado de integração da Fase 3 (`verify_phase3.ts` via Vite SSR Loader): Aprovado (renderização do Estado Vazio na Sidebar, criação de pastas e bloqueio de duplicidade, árvore indexada com pastas em ordem alfabética e combos em ordem decrescente de `updated_at`, bloqueio de renomeação duplicada de pasta e combo, transferência de combo entre pastas via Drag and Drop preservando intacto o `updated_at`, renderização do modal de confirmação de exclusão e remoção definitiva em cascata).

### Fase 4 — Módulo de Criação e Edição de Combos (Modal Inicial e Paleta Visual) (CONCLUÍDA)
- [x] Construir o modal/popup inicial obrigatório ao clicar em "Novo Combo" (`src/views/NewComboModal.tsx`), exigindo nome do combo e seleção de personagem a partir da lista fixa de 33 personagens em ordem alfabética (`validateNewComboMetadata`).
- [x] Implementar a paleta interativa de botões visuais (`src/views/GameInputTokenBadge.tsx`, `src/views/ComboEditorView.tsx`, `src/models/inputMetadata.ts` e `src/assets/styles/combo-editor.css`) seguindo fielmente as cores e formatos 3D circulares de `docs/DESIGN.md`, `docs/ggst_inputs.png` e `docs/FSD.md` (incluindo o ícone vetorial SVG do botão `Dash` e os ícones vetoriais SVG com cruz D-Pad 3D e gradiente laranja-amarelo de alto contraste para direcionais e *motions*).
- [x] Construir a área de renderização sequencial do combo com rolagem horizontal fluida (`overflow-x: auto`) e sem quebra de linha (`white-space: nowrap` / `flex-wrap: nowrap`) para suportar combos extensos.
- [x] Implementar a edição sequencial (inserção sempre ao final da fila via `appendInputToken`) e o botão "Desfazer" (`undoLastInputToken`, removendo o último item inserido, um a um, de trás para frente, incluindo modificadores).
- [x] Implementar a lógica de salvamento do combo (`src/controllers/useComboEditorController.ts` e `src/views/DuplicateComboModal.tsx`): criação automática da pasta com o nome do personagem caso ainda não exista, verificação de duplicidade de nome na mesma pasta (emitindo *warning* perguntando se deseja sobrescrever) e atualização do `updated_at`.

**Resumo de Testes da Fase 4:**
- `npm run typecheck`: Aprovado sem erros (`tsc --noEmit`).
- `npm run build`: Aprovado; pacote de produção gerado em `dist/` sem expor diretórios internos.
- Teste automatizado de integração da Fase 4 (`verify_phase4.ts` via Vite SSR Loader): Aprovado (validação obrigatória de nome e personagem da lista oficial de 33 personagens, verificação dos 30 tokens de input e suas classes visuais + SVG do Dash, inserção no fim da fila e remoção um a um via Desfazer incluindo modificadores, criação automática da pasta do personagem ao salvar, bloqueio de duplicidade com `duplicate_warning` e sobrescrita após confirmação).

### Fase 5 — Módulo de Leitura Protegida, Alternância Setas/Numpad e Exportação Textual (CONCLUÍDA)
- [x] Implementar o Modo de Leitura Protegido (`src/views/ComboReadOnlyView.tsx`): ao selecionar um combo na Sidebar, exibir a sequência em linha de forma estática (sem paleta ativa), oferecendo os botões "Editar" e "Copiar como Texto" e a prévia da notação textual Numpad.
- [x] Conectar o botão "Editar" para destravar a paleta interativa sobre o combo selecionado e sobrescrever o registro original ao salvar (atualizando `updated_at`).
- [x] Implementar o botão (toggle) global no cabeçalho do Módulo Principal de Interface (`src/app/App.tsx`) para alternar a exibição de todos os direcionais e *motions* entre "Setas" e "Numpad", salvando a preferência automaticamente na tabela lógica `settings` do Local Storage.
- [x] Implementar a função "Copiar como Texto" (`src/controllers/comboNotationExporter.ts`) enviando a sequência para a área de transferência do navegador no formato Numpad conforme as regras de concatenação e espaçamento do FSD, com feedback visual de sucesso (`#00E676`).
- [x] Ajustar visual dos modificadores de ligação (`+`, `>`, `~`) com fundo mais escuro e tamanho/padding reduzidos (preservando o `CH` intacto) e substituir o token `f.S` por `S` (com normalização automática de combos legados no Local Storage).

**Resumo de Testes da Fase 5:**
- `npm run typecheck`: Aprovado sem erros (`tsc --noEmit`).
- `npm run build`: Aprovado; pacote de produção gerado em `dist/` sem expor diretórios internos.
- Teste automatizado de integração da Fase 5 (`verify_phase5.ts` via Vite SSR Loader): Aprovado (formatação textual Numpad estrita conforme FSD — `2K`, `236P`, `214K~P`, `CH c.S > f.S > 236K > RC > Dash > 623HS`, `6P + K > [4]6HS > 632146P` —, cópia para área de transferência via Clipboard API, alternância e persistência de preferência visual Setas/Numpad na chave `settings`, renderização protegida em `ComboReadOnlyView` sem paleta ativa e sobrescrita com atualização de `updated_at` ao editar).

### Fase 6 — Tratamento Visual de Erros, Sanitização XSS e Preparação para Deploy (CONCLUÍDA)
- [x] Integrar o estado visual de erros (`#FF3333`) e alertas (`#FF9900`) na interface principal (`src/views/AlertBannerList.tsx` e `src/app/App.tsx`) consumindo a fila/memória de erros do módulo `src/logs/` e conectando falhas de validação dos Controllers (`useSidebarController.ts` e `useComboEditorController.ts`).
- [x] Revisar e reforçar a sanitização rigorosa de todas as entradas e saídas textuais (`name` de pastas, `name` de combos, `character` e mensagens de log) contra ataques de Cross-Site Scripting (XSS) antes de persistir e renderizar no DOM (`sanitizeUserText`, `sanitizeCharacterSelection` e `sanitizeLogUserMessage`).
- [x] Validar os critérios de aceitação técnica e funcional da seção 26 do `docs/FSD.md` e a fidelidade estética ao `docs/DESIGN.md`.
- [x] Ajustar configurações finais (`build:gh-pages` em `package.json` e `base: './'` em `vite.config.ts`) e testar o pacote estático gerado em `dist/` para entrega no GitHub Pages.

**Resumo de Testes da Fase 6:**
- `npm run typecheck`: Aprovado sem erros (`tsc --noEmit`).
- `npm run build`: Aprovado; pacote estático gerado em `dist/` com caminhos relativos (`./assets/`) compatíveis com GitHub Pages e sem expor nenhum diretório interno (`src/config`, `src/models`, `src/controllers`, `src/database/migrations`, `src/logs`).
- Teste automatizado de integração da Fase 6 (`verify_phase6.ts` via Vite SSR Loader): Aprovado (neutralização de vetores de XSS em `sanitizeUserText` e `sanitizeCharacterSelection`, higienização automática de payloads maliciosos pré-existentes no Local Storage durante as migrations, captura amigável de `QuotaExceededError` e `DUPLICATE_NAME_ERROR` com renderização de `AlertBannerList` nas cores `#FF3333` e `#FF9900`, e verificação do pacote `dist/`).
