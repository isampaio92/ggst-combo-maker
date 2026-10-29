# Contexto do Projeto para Agentes de IA — Modo Manutenção (`AGENTS.md`)

## 1. Idioma Obrigatório

- Responda **sempre em português do Brasil** em todas as interações, explicações de planos, mensagens de status, commits, documentação e comentários de código.

## 2. Protocolo de Manutenção e Documentos Obrigatórios

O projeto **GGST Combo Maker** encontra-se concluído e em **Modo Manutenção**. Toda alteração futura deve seguir rigorosamente o protocolo abaixo:

```text
Antes de qualquer alteração:
1. Ler docs/MANUTENCAO.md.
2. Ler docs/FSD.md.
3. Ler docs/DESIGN.md, se a alteração envolver interface.
4. Ler docs/STATUS.md.
5. Ler docs/ERROS.md.
6. Entender o pedido do usuário.
7. Explicar o plano antes de alterar arquivos.

Depois de qualquer alteração:
1. Testar o que foi alterado.
2. Atualizar docs/STATUS.md.
3. Registrar erro e solução em docs/ERROS.md, se houver.
4. Fazer commit ou entregar os comandos.
5. Explicar ao usuário como validar.

Regras permanentes de caminhos:
- Use sempre caminhos relativos à raiz do projeto.
- Não transformar estes caminhos em links absolutos.
- Não usar links `file:///`.
- Não registrar caminhos locais da máquina atual dentro do `AGENTS.md`.
```

## 3. Stack, Arquitetura e Ambientes (Conforme `docs/FSD.md` e `docs/MANUTENCAO.md`)

- **Linguagem:** TypeScript (modo `strict`).
- **Tecnologias de Interface:** React 19, HTML5 e CSS3 nativo com variáveis CSS (sem frameworks CSS externos; estilização fiel ao `docs/DESIGN.md`).
- **Ferramental de Build:** Vite.
- **Persistência / Banco de Dados:** Exclusivamente **Local Storage** nativo do navegador (`window.localStorage`), dividido nas chaves lógicas `ggst_cm_folders`, `ggst_cm_combos`, `ggst_cm_settings` e `ggst_cm_migrations`. Não há banco de dados em nuvem, servidor backend ou APIs externas.
- **Padrão Arquitetural:** Padrão **MVC** adaptado para *Single Page Application* (SPA) em React:
  - **Model (`src/models/`):** Tipagens TypeScript, catálogo de metadados de inputs, validação/normalização de schemas JSON, limites quantitativos, sanitização contra XSS e comunicação com o Local Storage.
  - **View (`src/views/`):** Componentes React e modais responsáveis pela renderização visual inspirada em *Guilty Gear -Strive-*.
  - **Controller (`src/controllers/`):** Hooks customizados e funções puras tratadoras de eventos que abrigam gerenciamento de estado, validações, regras de negócio, *Drag and Drop*, exportação Numpad e conexão entre View e Model.
- **Migrations no Frontend (`src/database/migrations/`):** Scripts versionados acionados silenciosamente na inicialização da aplicação (`runDatabaseMigrations`) para criar, validar e higienizar as chaves lógicas no Local Storage sem execuções duplicadas.
- **Configuração em Código (`src/config/config.ts`):** Parâmetros técnicos, chaves do Local Storage e lista fixa de 33 personagens em ordem alfabética ficam centralizados em `src/config/config.ts`. **É proibido usar arquivos `.env`**.
- **Ambientes:**
  - **Desenvolvimento e Homologação Local:** Node.js com servidor do Vite (`npm run dev` e `npm run preview`).
  - **Produção:** Hospedagem estática via **GitHub Pages** servindo o pacote compilado em `dist/` (`base: './'`).

## 4. Resumo da Estrutura de Pastas

```text
index.html                  # Entrada HTML (inclui CSP, Referrer Policy e fontes Teko/Inter)
package.json                # Scripts npm e dependências (React, TypeScript, Vite)
tsconfig.json               # Configurações estritas do compilador TypeScript
vite.config.ts              # Configuração de build estático do Vite (base './', publicDir: false)
docs/
  MANUTENCAO.md             # Manual técnico completo de manutenção e evolução
  COMO-PEDIR-MUDANCAS.md    # Guia com modelos de prompts para pedir mudanças à IA
  FSD.md                    # Especificação Funcional e Técnica
  DESIGN.md                 # Design System e guia de estilos GGST
  INSUMOS.md                # Inventário de insumos e referências visuais
  PLANO.md                  # Plano de construção original em 6 fases
  STATUS.md                 # Estado atual do projeto e histórico de entregas
  ERROS.md                  # Histórico de erros encontrados e soluções aplicadas
src/
  main.tsx                  # Ponto de entrada React e importação de estilos globais
  vite-env.d.ts             # Declarações de tipos do Vite
  config/
    config.ts               # Configurações globais protegidas em código (sem .env)
  app/
    App.tsx                 # Componente raiz, cabeçalho com toggle Setas/Numpad e orquestração
  models/                   # Entidades TypeScript, sanitizadores, metadados de inputs e Models do Local Storage
  controllers/              # Hooks customizados, validações, Drag and Drop e exportador Numpad
  views/                    # Componentes visuais React (Sidebar, Editor, Leitura, Badges 3D/SVG e Modais)
  assets/
    styles/
      global.css            # Variáveis CSS e estilos globais do Design System
      sidebar.css           # Estilos da barra lateral e Drag and Drop
      combo-editor.css      # Estilos da sequência horizontal e botões circulares 3D de input
  database/
    migrations/             # Scripts versionados de inicialização e integridade do Local Storage
  logs/                     # Tratamento estruturado e seguro de logs de erros locais
```

## 5. Comandos Principais e Orientação de Testes

- **Instalar dependências:** `npm install`
- **Rodar em desenvolvimento:** `npm run dev`
- **Validar tipagem TypeScript (Obrigatório antes de concluir):** `npm run typecheck`
- **Gerar build de produção (Obrigatório antes de concluir):** `npm run build`
- **Gerar build para GitHub Pages:** `npm run build:gh-pages`
- **Visualizar build de produção localmente:** `npm run preview`

**Orientação para testar antes de concluir:**
Nenhuma alteração deve ser dada como pronta sem antes executar `npm run typecheck` e `npm run build` sem erros e validar que o fluxo modificado e os fluxos existentes continuam íntegros.

## 6. Regras de Segurança (Preservação Obrigatória)

1. **Prevenção contra XSS (Cross-Site Scripting):** Prioridade máxima definida na seção 24 do `docs/FSD.md`. Todos os dados fornecidos pelo usuário ou lidos do Local Storage (nomes de combos, nomes de pastas e personagens) devem passar por `sanitizeUserText` e `sanitizeCharacterSelection` (`src/models/types.ts`) antes de serem persistidos ou renderizados. Nunca utilizar `dangerouslySetInnerHTML`, `innerHTML` ou `eval`.
2. **Cabeçalhos CSP e Referrer (`index.html`):** Preservar as meta tags `Content-Security-Policy` e `referrer="no-referrer"` em `index.html`.
3. **Isolamento de Configurações (Sem `.env`):** Não utilizar arquivos `.env` nem versionar segredos. Todas as configurações técnicas globais residem em `src/config/config.ts`.
4. **Proteção da Estrutura Interna no Build:** Manter `publicDir: false` e `sourcemap: false` em `vite.config.ts` para que as pastas internas (`src/config/`, `src/app/`, `src/models/`, `src/controllers/`, `src/database/migrations/` e `src/logs/`) nunca fiquem expostas na forma bruta no pacote final (`dist/`).
5. **Integridade do Local Storage, IDs e Limites Quantitativos:** Nunca confiar cegamente em dados do Local Storage ou de eventos de *Drag and Drop*. Preservar `isValidEntityId` (`SAFE_ENTITY_ID_REGEX`) e os limites máximos (`MAX_USER_TEXT_LENGTH`, `MAX_COMBO_SEQUENCE_LENGTH`, `MAX_STORED_FOLDERS`, `MAX_STORED_COMBOS`) em `src/models/types.ts` e `src/models/storage.ts`.
6. **Mensagens de Erro e Logs Seguros (`src/logs/index.ts`):** Falhas locais (`QuotaExceededError`, JSON corrompido ou erro de validação) devem ser capturadas sem derrubar a interface, higienizadas por `sanitizeLogUserMessage` e `sanitizeTechnicalDetailsForConsole` (sem expor *stack traces* cruas) e exibidas via `AlertBannerList` nas cores semânticas `#FF3333` (erro) e `#FF9900` (alerta).

## 7. Cuidados para Não Quebrar Funcionalidades Existentes

1. **Retrocompatibilidade do Local Storage:** Ao adicionar campos ou alterar schemas em `src/models/`, sempre garanta valores padrão seguros em `validateAndNormalizeCombos` / `validateAndNormalizeFolders` (`src/models/storage.ts`) para não invalidar nem apagar combos já salvos pelo usuário.
2. **Regras de Ordenação e Drag and Drop:** Pastas são sempre listadas em ordem alfabética e combos internos por `updated_at` decrescente. Mover um combo entre pastas via *Drag and Drop* (`ComboModel.moveToFolder`) **nunca deve alterar** o campo `updated_at`.
3. **Regras de Exportação Textual Numpad (`src/controllers/comboNotationExporter.ts`):** Direcionais e *motions* seguidos de botões de ataque (`P`, `K`, `c.S`, `S`, `HS`, `D`) ou ligados por `~` são concatenados sem espaço (ex.: `2K`, `236P`, `214K~P`), enquanto conectores e tokens independentes (`>`, `+`, `RC`, `Dash`, `CH`) são separados por espaço simples.
4. **Fidelidade ao Design System (`docs/DESIGN.md`):**
   - Tema Dark Mode de alto contraste (`#121212` fundo principal, `#1E1E1E` secundário, `#F5F5F5` texto principal, `#A0A0A0` texto secundário, `#E31818` destaque da marca).
   - As cores dos inputs do jogo (`P` `#FF77CC`, `K` `#33CCFF`, `c.S`/`S` `#00E676`, `HS` `#FF3333`, `D` `#FF9900`, direcionais em gradiente `#FF6600` a `#FFCC00`) são **exclusivas** para os botões do jogo e nunca devem estilizar botões comuns do sistema.
   - Elementos gerais de interface (cards, modais, menus, botões de sistema) possuem cantos retos (`border-radius: 0px`), enquanto botões de input do jogo são circulares (`border-radius: 50%`) com efeito 3D.
   - A trilha de sequência do combo deve manter rolagem horizontal fluida (`overflow-x: auto`) sem quebra de linha.
5. **Respeito ao Escopo (`docs/FSD.md`):** Não inventar login/autenticação, RBAC, *soft delete*/lixeira (exclusão é definitiva após confirmação no modal), cálculo de dano/frames ou inserção de golpes no meio da fila (inserção ocorre sempre no fim, com opção de Desfazer).

## 8. Registro de Progresso, Erros e Versionamento (Git)

- **Atualizar `docs/STATUS.md`:** Ao concluir qualquer manutenção, registrar a entrega, os arquivos afetados e os testes realizados em `docs/STATUS.md`.
- **Atualizar `docs/ERROS.md`:** Caso ocorra qualquer erro técnico ou bug durante a tarefa, documentar sintoma, causa, solução aplicada e prevenção em `docs/ERROS.md`.
- **Commit após alterações relevantes:** Conferir `git status` para garantir que nenhum segredo, `.env`, `node_modules/`, `dist/` ou `*.tsbuildinfo` seja versionado, realizar o commit com mensagem descritiva em português (ou fornecer os comandos ao usuário) e lembrar o usuário de executar `git push`.
