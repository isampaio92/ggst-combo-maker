# GGST Combo Maker

Aplicação web interativa (*Single Page Application* — SPA) para criação, organização em pastas e leitura visual de combos de **Guilty Gear -Strive-**.

> **Acesse o projeto online (GitHub Pages):** [https://isampaio92.github.io/ggst-combo-maker/](https://isampaio92.github.io/ggst-combo-maker/)

---

## Sobre o Projeto

O **GGST Combo Maker** funciona como um caderno de anotações interativo executado diretamente no navegador, projetado para jogadores de *Guilty Gear -Strive-* que desejam montar, estudar, revisar e compartilhar sequências de golpes de forma visual e intuitiva.

Em vez de depender apenas de blocos de texto técnico (*numpad notation*, como `CH c.S > S > 236K > RC > Dash > 623HS`), a ferramenta traduz cada comando em botões circulares 3D com as cores, ícones vetoriais e contrastes fiéis à interface do jogo. A identidade visual segue o estilo **Dark Mode / Rock-Metal Moderno** especificado em [`docs/DESIGN.md`](docs/DESIGN.md), combinando containers de cantos retos (`0px`), tipografia de impacto (`Teko` e `Inter`) e destaque em vermelho (`#E31818`).

- **Demonstração em Produção:** [https://isampaio92.github.io/ggst-combo-maker/](https://isampaio92.github.io/ggst-combo-maker/)

---

## Funcionalidades Principais

- **Criação e Edição Visual de Combos:**
  - Fluxo inicial com seleção obrigatória de nome do combo e escolha entre os **33 personagens oficiais** de *Guilty Gear -Strive-* em ordem alfabética.
  - Trilha sequencial com rolagem horizontal fluida (`overflow-x: auto`) sem quebra de linha, suportando combos extensos.
  - Adição sequencial de comandos ao final da fila e ação **Desfazer** para remover o último item inserido um a um.
  - Detecção de duplicidade ao salvar um combo com nome já existente na mesma pasta, solicitando confirmação antes de sobrescrever.

- **Paleta Completa de Inputs do Jogo (30 Tokens):**
  - **Botões de Ataque:** `P` (Punch — `#FF77CC`), `K` (Kick — `#33CCFF`), `c.S` (Close Slash — `#00E676`), `S` (Far Slash — `#00E676`), `HS` (Heavy Slash — `#FF3333`) e `D` (Dust — `#FF9900`).
  - **Direcionais Simples (8 Direções):** Representados com ícone vetorial D-Pad 3D em gradiente laranja-amarelo (`1` / `↙`, `2` / `↓`, `3` / `↘`, `4` / `←`, `6` / `→`, `7` / `↖`, `8` / `↑`, `9` / `↗`).
  - **Comandos Especiais (*Motions*):** `236` (`↓↘→`), `214` (`↓↙←`), `623` (`→↓↘`), `41236` (`←↙↓↘→`), `63214` (`→↘↓↙←`), `632146` (`→↘↓↙←→`), `236236` (`↓↘→↓↘→`), `214214` (`↓↙←↓↙←`), `[4]6` (`[←]→`) e `[2]8` (`[↓]↑`), acompanhados de **legenda explicativa discreta** no editor e no modo de leitura.
  - **Conectores e Mecânicas:** Modificadores de ligação (`>`, `+`, `~`), Red Roman Cancel (`RC`), `Dash` (com ícone vetorial SVG de corrida) e Counter Hit (`CH`).

- **Alternância Global entre `Setas` e `Numpad`:**
  - Seletor (*toggle*) no cabeçalho superior que converte instantaneamente todos os direcionais, *motions* e a legenda explicativa entre o formato de **Setas** (`↓↘→`) e o formato **Numpad** (`236`), salvando a preferência automaticamente no navegador.

- **Modo de Leitura Protegida e Exportação Textual ("Copiar como Texto"):**
  - Ao selecionar um combo na barra lateral, a sequência é exibida em modo estático protegido contra cliques acidentais (exigindo clique explícito em **Editar** para abrir a paleta).
  - Prévia em tempo real da notação textual e botão **Copiar como Texto**, que exporta a sequência para a área de transferência seguindo as regras da comunidade: direcionais e *motions* colados aos botões de ataque ou ligados por `~` (ex.: `2K`, `236P`, `214K~P`) e conectores/mecânicas separados por espaço simples (ex.: `CH c.S > S > 236K > RC > Dash > 623HS`).

- **Organização em Pastas com *Drag and Drop*:**
  - Criação automática da pasta do personagem ao salvar um combo (caso ainda não exista) e criação manual de pastas personalizadas.
  - Listagem indexada com pastas em **ordem alfabética** e combos internos ordenados por **data de última alteração** (`updated_at` decrescente).
  - Suporte a **Arrastar e Soltar** (*Drag and Drop*) para mover combos entre pastas sem alterar a data de edição (`updated_at`).
  - Renomeação inline de pastas e combos (via ícone de lápis) com validação de nome único no mesmo nível, e exclusão definitiva mediante modal obrigatório de confirmação.

---

## Tecnologias e Arquitetura

### Stack Principal

- **Linguagem:** TypeScript (`strict: true`).
- **Interface:** React 19, HTML5 e CSS3 nativo com variáveis CSS (sem frameworks CSS externos; estilização fiel ao [`docs/DESIGN.md`](docs/DESIGN.md)).
- **Ferramental de Build:** Vite.
- **Persistência de Dados:** Exclusivamente **Local Storage** nativo do navegador (`window.localStorage`), sem banco de dados em nuvem, servidor backend ou APIs externas.

### Padrão MVC no Frontend

O projeto adota o padrão **MVC (Model-View-Controller)** adaptado para *Single Page Application* em React:

- **Model (`src/models/`):** Interfaces TypeScript, catálogo de metadados dos 30 inputs do jogo, validação/normalização de schemas JSON, limites quantitativos, sanitização contra XSS e comunicação direta com o Local Storage.
- **View (`src/views/`):** Componentes visuais React, renderizador de badges circulares 3D/SVG, legenda de *motions*, banners de alerta e modais de confirmação.
- **Controller (`src/controllers/`):** Hooks customizados e funções puras tratadoras de eventos que concentram gerenciamento de estado, regras de negócio, ordenação, *Drag and Drop* e exportação textual Numpad.

### Persistência Local e Migrations (`src/database/migrations/`)

Os dados são armazenados localmente em quatro chaves lógicas definidas em `src/config/config.ts`:

| Tabela Lógica | Chave no Local Storage | Descrição |
|---|---|---|
| `folders` | `ggst_cm_folders` | Lista de pastas (`id`, `name`). |
| `combos` | `ggst_cm_combos` | Lista de combos (`id`, `folder_id`, `name`, `character`, `sequence`, `updated_at`). |
| `settings` | `ggst_cm_settings` | Preferência visual ativa (`visual_preference: 'arrows' \| 'numpad'`). |
| `migrations` | `ggst_cm_migrations` | Controle de versão e histórico de migrations executadas. |

Na inicialização da aplicação, o executor silencioso `runDatabaseMigrations()` (`src/database/migrations/index.ts`) verifica a versão do schema local, executa *migrations* pendentes sem duplicidade e higieniza a integridade referencial das chaves lógicas.

---

## Como Executar Localmente

### Pré-requisitos

- **Node.js** (versão 20 ou superior recomendada)
- **npm** (gerenciador de pacotes padrão do Node.js)

### Passo a Passo

1. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse no navegador o endereço local exibido no terminal (geralmente `http://localhost:5173`).

3. **Valide a tipagem TypeScript e gere o build de produção (recomendado após alterações):**
   ```bash
   npm run typecheck
   npm run build
   ```

### Scripts Disponíveis (`package.json`)

| Comando | Descrição |
|---|---|
| `npm install` | Instala as dependências definidas no `package.json`. |
| `npm run dev` | Inicia o servidor local de desenvolvimento do Vite com HMR. |
| `npm run typecheck` | Executa o compilador TypeScript (`tsc --noEmit`) para validação estrita de tipos. |
| `npm run build` | Valida a tipagem (`tsc -b`) e gera o pacote estático de produção na pasta `dist/`. |
| `npm run build:gh-pages` | Gera o pacote estático otimizado para publicação no GitHub Pages (`--base=./`). |
| `npm run preview` | Serve localmente o pacote compilado em `dist/` para homologação. |

---

## Estrutura de Pastas

```text
index.html                  # Documento HTML raiz (meta tags CSP, Referrer Policy e fontes Teko/Inter)
package.json                # Scripts npm e dependências (React 19, TypeScript, Vite)
tsconfig.json               # Configurações estritas do compilador TypeScript
vite.config.ts              # Configuração de build estático do Vite (base './', publicDir: false, sourcemap: false)
README.md                   # Apresentação geral e guia rápido do projeto
AGENTS.md                   # Diretrizes e protocolo de manutenção para agentes de IA
docs/
  FSD.md                    # Especificação Funcional e Técnica completa
  DESIGN.md                 # Design System e guia de estilos GGST
  MANUTENCAO.md             # Manual técnico detalhado de manutenção e evolução
  COMO-PEDIR-MUDANCAS.md    # Guia com modelos de prompts para solicitar alterações
  INSUMOS.md                # Inventário de insumos e referências visuais
  PLANO.md                  # Plano de construção original em 6 fases
  STATUS.md                 # Estado atual do projeto e histórico de entregas
  ERROS.md                  # Registro técnico de erros encontrados e soluções aplicadas
src/
  main.tsx                  # Ponto de entrada React e importação de estilos globais
  vite-env.d.ts             # Declarações de tipos do Vite
  config/
    config.ts               # Configurações globais protegidas em código (chaves, limites e 33 personagens)
  app/
    App.tsx                 # Componente raiz, cabeçalho com toggle Setas/Numpad e orquestração
  models/                   # Camada Model (MVC): tipos, sanitizadores XSS, metadados de inputs e Models do Local Storage
    types.ts
    inputMetadata.ts
    storage.ts
    folderModel.ts
    comboModel.ts
    settingsModel.ts
    index.ts
  controllers/              # Camada Controller (MVC): hooks customizados, validações, Drag and Drop e exportador Numpad
    useAppController.ts
    useSidebarController.ts
    useComboEditorController.ts
    comboNotationExporter.ts
    index.ts
  views/                    # Camada View (MVC): componentes visuais React, badges 3D/SVG, legenda e modais
    AlertBannerList.tsx
    SidebarView.tsx
    ConfirmDeleteModal.tsx
    NewComboModal.tsx
    DuplicateComboModal.tsx
    GameInputTokenBadge.tsx
    MotionInputsLegend.tsx
    ComboEditorView.tsx
    ComboReadOnlyView.tsx
    index.ts
  assets/
    styles/
      global.css            # Variáveis CSS, layout base e estilos de modais e botões do sistema
      sidebar.css           # Estilos da barra lateral, pastas, combos e estados de Drag and Drop
      combo-editor.css      # Estilos da trilha sequencial, paleta de botões 3D circulares e legenda de motions
  database/
    migrations/             # Scripts versionados de inicialização e integridade do Local Storage
      001_init_schema.ts
      index.ts
  logs/
    index.ts                # Tratamento estruturado e sanitizado de logs de erros locais
```

---

## Segurança e Privacidade

- **Execução 100% Local e Privada:** Todos os combos, pastas e preferências ficam armazenados exclusivamente no navegador do próprio usuário (`window.localStorage`). Não há criação de conta, coleta de dados pessoais, telemetria ou envio de informações para servidores externos.
- **Prevenção Estrita contra XSS (*Cross-Site Scripting*):** Todas as entradas textuais do usuário e dados lidos do Local Storage passam por sanitização rigorosa (`sanitizeUserText` e `sanitizeCharacterSelection` em `src/models/types.ts`) antes de serem persistidos ou renderizados. O projeto não utiliza `dangerouslySetInnerHTML`, `innerHTML` ou `eval`.
- **Cabeçalhos CSP e Referrer Policy:** O arquivo `index.html` define uma política `Content-Security-Policy` restritiva (`default-src 'self'; script-src 'self'; object-src 'none'`) e `referrer="no-referrer"`.
- **Validação de Schema e Limites Quantitativos:** Os dados lidos do Local Storage e eventos de *Drag and Drop* têm seus identificadores validados (`SAFE_ENTITY_ID_REGEX`) e respeitam limites máximos de segurança (`MAX_USER_TEXT_LENGTH`, `MAX_COMBO_SEQUENCE_LENGTH`, `MAX_STORED_FOLDERS`, `MAX_STORED_COMBOS`).
- **Isolamento de Configurações (Sem `.env`):** Parâmetros técnicos globais ficam centralizados em `src/config/config.ts`, dispensando arquivos `.env`. Além disso, o build de produção (`vite.config.ts`) opera com `publicDir: false` e `sourcemap: false`, emitindo apenas os artefatos estáticos compilados em `dist/`.

---

## Documentação Técnica Adicional

Para detalhes aprofundados sobre arquitetura, regras de negócio, design e manutenção, consulte os documentos na pasta `docs/`:

- [`docs/FSD.md`](docs/FSD.md) — **Especificação Funcional e Técnica:** Escopo funcional, regras de negócio, modelo de dados e critérios de aceitação.
- [`docs/DESIGN.md`](docs/DESIGN.md) — **Design System:** Paleta de cores oficial, tipografia, espaçamentos, geometria de bordas e estilo dos botões de input.
- [`docs/MANUTENCAO.md`](docs/MANUTENCAO.md) — **Manual de Manutenção e Evolução:** Guia técnico completo sobre a arquitetura MVC, *migrations* locais, testes e roteiros passo a passo para evoluir o sistema.
- [`docs/COMO-PEDIR-MUDANCAS.md`](docs/COMO-PEDIR-MUDANCAS.md) — **Como Pedir Mudanças:** Modelos práticos de prompts para solicitar novas funcionalidades, ajustes visuais ou correções mantendo a integridade do projeto.
- [`docs/STATUS.md`](docs/STATUS.md) — **Status do Projeto:** Histórico completo das fases implementadas, auditoria de segurança e manutenções realizadas.
- [`docs/ERROS.md`](docs/ERROS.md) — **Registro de Erros e Soluções:** Memória técnica de problemas diagnosticados, causas e soluções aplicadas.
