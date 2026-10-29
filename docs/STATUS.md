# Status do Projeto — GGST Combo Maker (`docs/STATUS.md`)

- **Estado atual do projeto:** Infraestrutura base (Fase 1) e controle de versão Git local concluídos e validados com sucesso (`npm install`, `npm run typecheck`, `npm run build` e commit inicial operacionais).
- **Fase atual:** Fase 1 + Controle de Versão Git concluídos / Aguardando conexão com repositório remoto no GitHub e início da Fase 2.
- **Próximo passo recomendado:** Conectar o repositório remoto no GitHub (`git remote add origin ...` e `git push -u origin main`) e iniciar a **Fase 2 — Persistência em Local Storage, Migrations, Logs Locais e Base MVC**.
- **Última atualização:** 2026-10-29 13:40 (BRT)

---

## Controle de Versão e Backup (Git / GitHub)

- [x] **Git verificado e inicializado:** Repositório Git local inicializado na branch `main` (`git init` e `git branch -M main`).
- [x] **`.gitignore` revisado:** Ajustado para a stack TypeScript + React + Vite (ignorando `node_modules/`, `dist/`, `dist-ssr/`, `.vite/`, `*.tsbuildinfo`, `.env*`, certificados/chaves privadas, `/logs/` apenas na raiz sem afetar `src/logs/`, backups e arquivos de sistema/IDE).
- [x] **`.gitattributes` criado:** Padronização de finais de linha (`LF`) para códigos-fonte, JSON e Markdown, e marcação binária para imagens (`*.png`, etc.).
- [x] **Arquivos sensíveis protegidos:** Conferência realizada via `git add --dry-run .` e `git status`; nenhum segredo, `.env` ou cache de build foi versionado.
- [x] **Commit inicial realizado:** Commit `"Estrutura inicial do projeto"` criado na branch `main`.
- [ ] **Repositório GitHub:** Pendente de ação do usuário (GitHub CLI `gh` não instalado no ambiente; instruções de criação e conexão via HTTPS/SSH fornecidas ao usuário).
- [ ] **Push para o GitHub:** Pendente de ação do usuário após criar o repositório remoto (`git push -u origin main`).

---

## Progresso por Fase (`docs/PLANO.md`)

### Fase 1 — Infraestrutura, Configuração Base e Estilização Global (CONCLUÍDA)
- [x] Inicializar configuração do projeto com Node.js, Vite, React e TypeScript (`package.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`).
- [x] Criar a estrutura de diretórios do padrão MVC: `src/config/`, `src/app/`, `src/models/`, `src/controllers/`, `src/views/`, `src/assets/`, `src/database/migrations/` e `src/logs/`.
- [x] Implementar `src/config/config.ts` com parâmetros globais do sistema, nomes das chaves lógicas do Local Storage (`folders`, `combos`, `settings`, controle de migrations), preferência visual padrão e a lista fixa de 33 personagens em ordem alfabética.
- [x] Configurar `index.html` e a estilização global base (`src/assets/styles/global.css`) seguindo a paleta de cores, tipografia (`Teko`/`Oswald`, `Inter`/`Roboto`), espaçamentos (grid de 8px) e regras de contraste do `docs/DESIGN.md`.
- [x] Criar o ponto de entrada inicial (`src/main.tsx` e `src/app/App.tsx`) e instalar as dependências locais do projeto.
- [x] Validar compilação TypeScript e build estático do Vite garantindo que a estrutura bruta de diretórios internos não fique exposta no pacote de produção.

### Fase 2 — Persistência em Local Storage, Migrations, Logs Locais e Base MVC (PENDENTE)
- [ ] Definir as interfaces e tipos TypeScript das entidades (`Folder`, `Combo`, `Settings`, tipos de inputs e schema do Local Storage) em `src/models/`.
- [ ] Implementar o mecanismo de log de erros locais em `src/logs/` para captura amigável de falhas (ex.: estouro de cota do Local Storage ou JSON inválido), registro formatado em `console.error` e armazenamento temporário em memória da sessão para exibição de alertas na UI.
- [ ] Implementar a arquitetura de migrations em `src/database/migrations/` com chave de controle de versões executadas (evitando execuções duplicadas) e inicialização/validação das tabelas lógicas `folders`, `combos` e `settings` e suas constraints de integridade.
- [ ] Implementar os Models de leitura e escrita segura no Local Storage em `src/models/`.
- [ ] Criar os Controllers/Hooks base em `src/controllers/` que acionam as migrations silenciosamente no ciclo de inicialização da aplicação React e expõem operações básicas sobre configurações, pastas e combos.

### Fase 3 — Módulo de Organização (Sidebar), Gestão de Pastas e Drag and Drop (PENDENTE)
- [ ] Implementar a listagem indexada na Sidebar (`src/views/` e `src/controllers/`): pastas ordenadas alfabeticamente e combos internos ordenados por `updated_at` decrescente.
- [ ] Exibir mensagem instrutiva de Estado Vazio (`#A0A0A0` / `#333333`) quando não houver pastas ou combos cadastrados.
- [ ] Implementar criação manual de pastas livres com validação de nome obrigatório e único.
- [ ] Implementar renomeação de pastas e de combos através do ícone de lápis na listagem, bloqueando nomes já em uso no mesmo nível com mensagem de erro.
- [ ] Implementar exclusão de pastas (e seus combos internos) e de combos individuais com aviso obrigatório de confirmação na tela e remoção definitiva do Local Storage (sem *soft delete*).
- [ ] Implementar o recurso de *Drag and Drop* permitindo arrastar e soltar combos entre pastas, atualizando o `folder_id` sem alterar a data de edição (`updated_at`).

### Fase 4 — Módulo de Criação e Edição de Combos (Modal Inicial e Paleta Visual) (PENDENTE)
- [ ] Construir o modal/popup inicial obrigatório ao clicar em "Novo Combo", exigindo nome do combo e seleção de personagem a partir da lista fixa de 33 personagens em ordem alfabética.
- [ ] Implementar a paleta interativa de botões visuais seguindo fielmente as cores e formatos 3D circulares de `docs/DESIGN.md` e `docs/FSD.md`.
- [ ] Construir a área de renderização sequencial do combo com rolagem horizontal fluida (`overflow-x: auto`) e sem quebra de linha (`white-space: nowrap` / `flex-wrap: nowrap`) para suportar combos extensos.
- [ ] Implementar a edição sequencial (inserção sempre ao final da fila) e o botão "Desfazer" (removendo o último item inserido, um a um, de trás para frente, incluindo modificadores).
- [ ] Implementar a lógica de salvamento do combo: criação automática da pasta com o nome do personagem caso ainda não exista, verificação de duplicidade de nome na mesma pasta (emitindo *warning* perguntando se deseja sobrescrever) e atualização do `updated_at`.

### Fase 5 — Módulo de Leitura Protegida, Alternância Setas/Numpad e Exportação Textual (PENDENTE)
- [ ] Implementar o Modo de Leitura Protegido: ao selecionar um combo na Sidebar, exibir a sequência em linha de forma estática (sem paleta ativa), oferecendo os botões "Editar" e "Copiar como Texto".
- [ ] Conectar o botão "Editar" para destravar a paleta interativa sobre o combo selecionado e sobrescrever o registro original ao salvar (atualizando `updated_at`).
- [ ] Implementar o botão (toggle) global no cabeçalho do Módulo Principal de Interface para alternar a exibição de todos os direcionais e *motions* entre "Setas" e "Numpad", salvando a preferência automaticamente na tabela lógica `settings` do Local Storage.
- [ ] Implementar a função "Copiar como Texto" enviando a sequência para a área de transferência do navegador no formato Numpad conforme as regras de concatenação e espaçamento do FSD.

### Fase 6 — Tratamento Visual de Erros, Sanitização XSS e Preparação para Deploy (PENDENTE)
- [ ] Integrar o estado visual de erros (`#FF3333`) e alertas (`#FF9900`) na interface principal consumindo a fila/memória de erros do módulo `src/logs/`.
- [ ] Revisar e garantir a sanitização rigorosa de todas as entradas e saídas textuais (`name` de pastas, `name` de combos e `character`) contra ataques de Cross-Site Scripting (XSS) antes de persistir e renderizar no DOM.
- [ ] Validar os critérios de aceitação técnica e funcional da seção 26 do `docs/FSD.md` e a fidelidade estética ao `docs/DESIGN.md`.
- [ ] Ajustar configurações finais e testar o pacote estático gerado em `dist/` para entrega no GitHub Pages.
