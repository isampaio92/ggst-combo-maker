# Manual de Manutenção e Evolução — GGST Combo Maker (`docs/MANUTENCAO.md`)

Este documento é o guia técnico oficial de manutenção do sistema **GGST Combo Maker**. Ele foi escrito para orientar pessoas desenvolvedoras e agentes de Inteligência Artificial (IA) em futuras correções, melhorias e evoluções do projeto, preservando a arquitetura, o Design System e a segurança da aplicação.

---

## 1. Visão geral

### O que o sistema faz
O **GGST Combo Maker** é uma aplicação web interativa (*Single Page Application* — SPA) que funciona como um caderno de anotações visual para criação, organização e compartilhamento de combos do jogo de luta *Guilty Gear -Strive-*.

### Para quem ele foi criado
Para jogadores de *Guilty Gear -Strive-* (especialmente iniciantes e intermediários) que desejam montar, estudar e organizar sequências de golpes sem depender apenas de blocos de texto puro.

### Quais problemas resolve
- Traduz a notação técnica de jogos de luta (*numpad notation*, como `c.S > 236K > RC > Dash > 623HS`) em uma sequência visual de botões circulares 3D com as cores e ícones exatos do jogo.
- Permite alternar instantaneamente a leitura de todos os direcionais e comandos especiais (*motions*) entre **Setas** (`↙`, `↓`, `↓↘→`) e **Numpad** (`1`, `2`, `236`).
- Organiza os combos localmente em pastas por personagem (criadas automaticamente) ou pastas personalizadas, com suporte a **Arrastar e Soltar** (*Drag and Drop*).
- Exporta qualquer sequência visual de volta para texto padronizado no formato **Numpad** com um único clique ("Copiar como Texto").

### Principais módulos construídos
1. **Módulo Principal de Interface (`src/app/App.tsx`):**
   - Cabeçalho global com identificação da versão, seletor/toggle de exibição (**Setas** vs. **Numpad**), botão `+ Novo Combo`, contadores de pastas/combos e orquestração entre a barra lateral e o painel de palco (*stage panel*).
2. **Módulo de Organização / Sidebar (`src/views/SidebarView.tsx` e `src/controllers/useSidebarController.ts`):**
   - Árvore indexada com pastas em ordem alfabética e combos internos ordenados por data de última alteração (`updated_at` decrescente).
   - Criação manual de pastas, renomeação inline via ícone de lápis, exclusão definitiva com modal de confirmação (`src/views/ConfirmDeleteModal.tsx`), estado vazio instrutivo e transferência de combos entre pastas via *Drag and Drop*.
3. **Módulo de Criação e Edição de Combos (`src/views/NewComboModal.tsx`, `src/views/ComboEditorView.tsx`, `src/views/DuplicateComboModal.tsx`, `src/views/GameInputTokenBadge.tsx` e `src/controllers/useComboEditorController.ts`):**
   - Modal inicial obrigatório exigindo nome do combo e seleção de um dos 33 personagens oficiais.
   - Área de sequência visual com rolagem horizontal fluida (`overflow-x: auto`) sem quebra de linha.
   - Paleta interativa com 30 tokens de input do jogo (ataques, botão `Dash` com ícone vetorial SVG, `RC`, 8 direcionais em D-Pad SVG, 10 *motions* e 4 modificadores), botão **Desfazer** (remove o último token inserido) e salvamento com detecção de duplicidade na mesma pasta.
4. **Módulo de Leitura Protegida e Compartilhamento (`src/views/ComboReadOnlyView.tsx` e `src/controllers/comboNotationExporter.ts`):**
   - Exibição estática e protegida do combo selecionado (exige clique explícito em **Editar** para abrir a paleta).
   - Prévia em tempo real da notação Numpad e botão **Copiar como Texto** integrado à área de transferência do navegador.
5. **Módulo de Persistência, Migrations e Logs Locais (`src/models/`, `src/database/migrations/`, `src/logs/` e `src/views/AlertBannerList.tsx`):**
   - Leitura e gravação validadas no **Local Storage**, scripts versionados de inicialização/higienização de schema JSON e fila de alertas visuais de erro (`#FF3333`) e aviso (`#FF9900`) com fechamento automático (*auto close*).

---

## 2. Stack e ambientes

### Tecnologias principais
- **Linguagem:** TypeScript (`~6.0.3`, configurado em modo `strict`).
- **Biblioteca de Interface:** React (`^19.2.7`) e React DOM (`^19.2.7`), utilizando HTML5 e CSS3 nativo com variáveis CSS (sem frameworks CSS externos).
- **Ferramental de Build:** Vite (`^8.0.16`) com `@vitejs/plugin-react` (`^6.0.2`).
- **Banco de Dados / Persistência:** Exclusivamente **Local Storage** nativo do navegador (`window.localStorage`). Não existe banco de dados em nuvem, backend ou API externa.
- **Padrão Arquitetural:** **MVC** adaptado para SPA em React (`src/models/`, `src/views/`, `src/controllers/`).

### Ambientes do projeto
- **Ambiente Local (Desenvolvimento e Homologação):** Node.js executando o servidor de desenvolvimento e o servidor de preview do Vite na máquina local.
- **Ambiente de Produção:** Hospedagem estática via **GitHub Pages** a partir dos artefatos compilados na pasta `dist/` (configurado com `base: './'` em `vite.config.ts`).

### Comandos principais (`package.json`)
| Comando | Finalidade |
|---|---|
| `npm install` | Instala todas as dependências definidas no `package.json`. |
| `npm run dev` | Inicia o servidor local de desenvolvimento do Vite com recarregamento rápido (HMR). |
| `npm run typecheck` | Executa o compilador TypeScript (`tsc --noEmit`) para validar tipagens sem gerar arquivos. |
| `npm run build` | Valida a tipagem (`tsc -b`) e gera o pacote estático de produção na pasta `dist/`. |
| `npm run build:gh-pages` | Gera o pacote de produção para o GitHub Pages garantindo caminhos relativos (`--base=./`). |
| `npm run preview` | Serve localmente o pacote compilado em `dist/` para homologação antes do deploy. |

---

## 3. Como rodar localmente

Siga os passos abaixo para executar o projeto em ambiente de desenvolvimento:

1. **Instalar as dependências** (necessário na primeira vez ou quando `package.json` mudar):
   ```bash
   npm install
   ```
2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
3. **Acessar no navegador:**
   Abra o endereço local exibido no terminal pelo Vite (geralmente `http://localhost:5173`).
4. **Validar tipagem e build antes de finalizar qualquer alteração:**
   ```bash
   npm run typecheck
   npm run build
   ```
5. **Testar o pacote final de produção localmente (opcional, recomendado antes de publicar):**
   ```bash
   npm run preview
   ```

---

## 4. Mapa de pastas

```text
index.html                  # Documento HTML raiz (inclui meta tags CSP, Referrer Policy e fontes Google)
package.json                # Scripts npm e lista de dependências (React, TypeScript, Vite)
tsconfig.json               # Regras estritas do compilador TypeScript
vite.config.ts              # Configuração de build estático do Vite (base './', publicDir: false, sourcemap: false)
docs/                       # Documentação viva e especificações do projeto
  FSD.md                    # Especificação Funcional e Técnica
  DESIGN.md                 # Design System e guia de estilos inspirado em Guilty Gear -Strive-
  INSUMOS.md                # Inventário de insumos e referências visuais
  PLANO.md                  # Plano de construção em 6 fases
  STATUS.md                 # Histórico de progresso e estado atual do projeto
  ERROS.md                  # Memória técnica de erros encontrados e soluções aplicadas
  MANUTENCAO.md             # Este manual de manutenção e evolução
  COMO-PEDIR-MUDANCAS.md    # Guia prático com modelos de prompts para solicitar alterações à IA
src/
  main.tsx                  # Ponto de entrada React e importação global dos arquivos CSS
  vite-env.d.ts             # Declarações de tipos do ambiente Vite
  config/
    config.ts               # Configurações globais em código protegido (chaves do Local Storage, versão e 33 personagens)
  app/
    App.tsx                 # Componente raiz que integra os Controllers principais e alterna os módulos da tela
  models/                   # Camada Model (MVC): tipos, metadados, validação de schema e acesso ao Local Storage
    types.ts                # Interfaces TypeScript (Folder, Combo, Settings), limites quantitativos e sanitizadores XSS
    inputMetadata.ts        # Catálogo e rótulos (Setas/Numpad) dos 30 tokens de input do jogo
    storage.ts              # Leitura/escrita segura em JSON no Local Storage e normalização de registros
    folderModel.ts          # Operações de negócio e persistência da tabela lógica `folders`
    comboModel.ts           # Operações de negócio e persistência da tabela lógica `combos`
    settingsModel.ts        # Leitura e atualização da preferência visual na tabela lógica `settings`
    index.ts                # Barrel file de exportação da camada Model
  controllers/              # Camada Controller (MVC): hooks customizados, regras de negócio e formatação
    useAppController.ts     # Hook raiz que roda as migrations e sincroniza pastas, combos, settings e logs
    useSidebarController.ts # Regras da Sidebar: árvore indexada, criação/renomeação/exclusão e Drag and Drop
    useComboEditorController.ts # Regras do modal de Novo Combo, edição da sequência, Desfazer e aviso de duplicidade
    comboNotationExporter.ts # Conversão da sequência visual para texto Numpad e cópia via Clipboard API
    index.ts                # Barrel file de exportação da camada Controller
  views/                    # Camada View (MVC): componentes visuais React e modais
    AlertBannerList.tsx     # Banners de erro (#FF3333) e alerta (#FF9900) com fechamento automático
    SidebarView.tsx         # Barra lateral de pastas e combos com suporte a Drag and Drop
    ConfirmDeleteModal.tsx  # Modal obrigatório de confirmação para exclusão definitiva
    NewComboModal.tsx       # Modal obrigatório inicial para definição de nome e personagem
    DuplicateComboModal.tsx # Modal de aviso perguntando se deseja sobrescrever combo de mesmo nome na pasta
    GameInputTokenBadge.tsx # Renderizador circular 3D dos inputs do jogo (inclui SVGs do Dash e D-Pad direcional)
    ComboEditorView.tsx     # Tela de edição com trilha sequencial horizontal e paleta interativa de botões
    ComboReadOnlyView.tsx   # Tela de leitura protegida com botão Editar e Copiar como Texto
    index.ts                # Barrel file de exportação da camada View
  assets/
    styles/
      global.css            # Variáveis CSS (cores, fontes, grid 8px), layout base e estilos de modais/botões de sistema
      sidebar.css           # Estilos específicos da Sidebar, pastas, itens de combo e estados de Drag and Drop
      combo-editor.css      # Estilos da trilha sequencial, paleta de botões 3D circulares e cores exclusivas de input
  database/
    migrations/             # Scripts versionados de inicialização e integridade do Local Storage
      001_init_schema.ts    # Migration 001: criação e higienização inicial das chaves `folders`, `combos` e `settings`
      index.ts              # Executor silencioso de migrations (`runDatabaseMigrations` e `ensureDatabaseInitialized`)
  logs/
    index.ts                # Captura estruturada de erros locais, sanitização de mensagens e fila em memória da sessão
```

### Quando mexer em cada pasta e cuidados importantes

- **`src/config/`:**
  - *Quando mexer:* Para adicionar um novo personagem oficial à lista fixa (`APP_CONFIG.characters`), alterar chaves lógicas ou incrementar `APP_CONFIG.migrations.currentVersion`.
  - *Cuidados:* Mantenha a lista `characters` em ordem alfabética. **Jamais crie arquivos `.env`**; toda configuração deve permanecer em `src/config/config.ts`.
- **`src/models/`:**
  - *Quando mexer:* Ao alterar a estrutura de dados de pastas, combos, configurações, adicionar novos tokens de comando ou ajustar regras de validação/sanitização de armazenamento.
  - *Cuidados:* Nunca coloque código de interface (JSX) aqui. Toda string vinda do usuário ou do Local Storage deve passar por `sanitizeUserText` ou `sanitizeCharacterSelection`.
- **`src/database/migrations/`:**
  - *Quando mexer:* Sempre que o formato JSON salvo no Local Storage mudar e for necessário migrar dados já existentes nos navegadores dos usuários.
  - *Cuidados:* Nunca apague dados válidos do usuário durante uma migration; crie um novo script sequencial (ex.: `002_...`) e registre-o em `src/database/migrations/index.ts`.
- **`src/controllers/`:**
  - *Quando mexer:* Ao criar ou alterar fluxos de tela, validações de formulário, ordenação, *Drag and Drop* ou regras de exportação textual Numpad.
  - *Cuidados:* Prefira extrair lógicas complexas em funções puras exportadas (facilita testes diretos) e conecte erros de validação ao `recordLocalLog` de `src/logs/index.ts`.
- **`src/views/` e `src/assets/styles/`:**
  - *Quando mexer:* Ao alterar layouts, textos da interface, modais, botões ou estilos CSS.
  - *Cuidados:* Respeite rigorosamente o `docs/DESIGN.md` (cantos retos `0px` na interface geral, círculos `50%` apenas nos inputs do jogo, cores de ataque restritas aos inputs do jogo) e nunca utilize `dangerouslySetInnerHTML`.
- **`src/logs/`:**
  - *Quando mexer:* Ao adicionar novos códigos de erro (`LocalErrorCode`) ou ajustar o tempo de *auto close* dos alertas.
  - *Cuidados:* Preserve a sanitização `sanitizeLogUserMessage` e `sanitizeTechnicalDetailsForConsole` para nunca exibir pilhas de execução cruas (*stack traces*) na tela ou no console.

---

## 5. Banco de dados e persistência

### Mecanismo utilizado
O sistema **não utiliza banco de dados relacional ou em nuvem** (não há MySQL, PostgreSQL, SQLite, Firebase ou Supabase). Toda a persistência ocorre localmente no navegador do usuário por meio da API nativa **Local Storage** (`window.localStorage`), estruturada em quatro chaves JSON definidas em `src/config/config.ts`:

| Tabela Lógica | Chave no Local Storage | Arquivo Model Responsável | Conteúdo |
|---|---|---|---|
| `folders` | `ggst_cm_folders` | `src/models/folderModel.ts` | Array de pastas (`{ id, name }`), exibidas em ordem alfabética. |
| `combos` | `ggst_cm_combos` | `src/models/comboModel.ts` | Array de combos (`{ id, folder_id, name, character, sequence, updated_at }`). |
| `settings` | `ggst_cm_settings` | `src/models/settingsModel.ts` | Objeto `{ visual_preference: 'arrows' \| 'numpad' }`. |
| `migrations` | `ggst_cm_migrations` | `src/database/migrations/index.ts` | Objeto `{ current_version, executed: [...] }` que evita reexecução de migrations. |

### Como funcionam as migrations no frontend
- Não existe comando de terminal separado para rodar migrations: elas são executadas **automaticamente e silenciosamente** na inicialização da aplicação React pela função `runDatabaseMigrations()` chamada em `src/controllers/useAppController.ts` (e garantidas por `ensureDatabaseInitialized()` em cada Model).
- Além de rodar novas versões pendentes, a função `ensureLogicalTablesIntegrity()` valida e normaliza todas as chaves em toda inicialização, protegendo a aplicação caso o usuário edite ou corrompa manualmente o JSON nas ferramentas do navegador (*DevTools*).

### Como criar uma nova migration no futuro
Se você precisar alterar a estrutura de dados (por exemplo, transformar ou preencher um campo novo em combos antigos):
1. Crie um novo arquivo em `src/database/migrations/`, como `002_add_example_field.ts`, exportando um objeto `MigrationScript` com `version: 2`, `name: '002_add_example_field'` e a função `up(): boolean`.
2. Registre o novo script no array `REGISTERED_MIGRATIONS` dentro de `src/database/migrations/index.ts`.
3. Atualize `migrations.currentVersion` para `2` em `src/config/config.ts`.
4. Atualize os validadores `validateAndNormalize...` em `src/models/storage.ts` para reconhecer e preservar o novo formato.

### Cuidados antes de alterar a estrutura de dados
- **Retrocompatibilidade:** Lembre-se de que usuários existentes já possuem combos salvos no navegador. Sempre defina um valor padrão seguro em `validateAndNormalizeCombos` / `validateAndNormalizeFolders` (`src/models/storage.ts`) caso um registro antigo não possua a propriedade nova (veja como exemplo a normalização automática do token legado `'f.S'` para `'S'` em `src/models/storage.ts`).
- **Integridade referencial:** Todo combo depende de um `folder_id` existente em `folders`. Se o `folder_id` não existir, `validateAndNormalizeCombos` descarta o registro órfão.

---

## 6. Autenticação, autorização e usuários

Conforme definido nas seções 7, 8, 15 e 16 do `docs/FSD.md`:
- **Sem autenticação ou sessão:** O sistema **não possui** tela de login, senha, cadastro de conta, tokens JWT ou sessão expirável.
- **Sem controle de acesso por perfis (RBAC):** Existe apenas um perfil implícito (**Jogador / Usuário Único**), que detém acesso total aos dados gravados no navegador local.
- **Cuidados importantes:** Não crie telas de login, bloqueios de rota ou chamadas de autenticação externa sem uma revisão formal do `docs/FSD.md`.

---

## 7. Como adicionar uma nova tela

Para adicionar uma nova tela, painel ou modal respeitando a arquitetura MVC em React:

1. **Verifique o escopo e o Design System:**
   Consulte `docs/FSD.md` e `docs/DESIGN.md` para confirmar cores (`#121212`, `#1E1E1E`, `#F5F5F5`, `#E31818`), tipografia (`Teko` em caixa alta para títulos, `Inter` para corpo) e geometria (`border-radius: 0px` para containers, cards, modais e botões de sistema).
2. **Defina os tipos ou dados na camada Model (se necessário):**
   Se a nova tela manipular uma nova estrutura de dados, declare as interfaces em `src/models/types.ts` e exporte em `src/models/index.ts`.
3. **Crie ou expanda o Controller (`src/controllers/`):**
   Crie um hook customizado (ou adicione estados/handlers ao hook existente em `src/controllers/`) contendo toda a lógica de abertura/fechamento, validações e chamadas aos Models. Exporte-o em `src/controllers/index.ts`.
4. **Crie o componente visual na camada View (`src/views/`):**
   Crie o arquivo `.tsx` em `src/views/` recebendo dados e callbacks via `props` (mantenha a View focada na apresentação e eventos de interface). Exporte-o em `src/views/index.ts`.
5. **Adicione a estilização CSS (`src/assets/styles/`):**
   Utilize as classes utilitárias de `src/assets/styles/global.css` (como `.modal-backdrop`, `.modal-card`, `.btn-system-primary`, `.btn-system-secondary`) ou adicione regras específicas nos arquivos CSS existentes.
6. **Conecte no componente raiz (`src/app/App.tsx`):**
   Instancie o Controller e renderize a nova View ou modal dentro de `src/app/App.tsx`.

---

## 8. Como adicionar um novo campo

Siga este roteiro passo a passo para adicionar um novo campo a um cadastro existente (por exemplo, adicionar um campo em `Combo` ou `Folder`):

1. **Atualizar a tipagem e sanitização (`src/models/types.ts`):**
   Adicione a propriedade na interface correspondente (`Combo` ou `Folder`). Se for texto livre digitado pelo usuário, aplique `sanitizeUserText` com um limite de caracteres adequado.
2. **Atualizar a validação de schema do Local Storage (`src/models/storage.ts`):**
   Em `validateAndNormalizeCombos` (ou `validateAndNormalizeFolders`), valide o tipo do novo campo ao ler do Local Storage e atribua um valor padrão seguro para registros antigos que ainda não possuam o campo.
3. **Criar migration (se necessário) (`src/database/migrations/`):**
   Se registros antigos precisarem de transformação ativa no Local Storage, adicione uma nova migration seguindo a seção 5 deste manual.
4. **Atualizar o Model (`src/models/comboModel.ts` ou `src/models/folderModel.ts`):**
   Inclua o novo campo nos parâmetros de `save` / `create` e na montagem do objeto persistido.
5. **Atualizar o Controller (`src/controllers/`):**
   Adicione o estado, validação e repasse do novo campo em `src/controllers/useComboEditorController.ts`, `src/controllers/useSidebarController.ts` e na assinatura de `saveCombo` em `src/controllers/useAppController.ts`.
6. **Atualizar os formulários e listagens na View (`src/views/`):**
   - Adicione o input no modal/formulário de criação ou edição (`src/views/NewComboModal.tsx` ou `src/views/ComboEditorView.tsx`) usando as classes `.form-field`, `.form-label` e `.form-input`.
   - Exiba o novo campo no modo de leitura (`src/views/ComboReadOnlyView.tsx`) e/ou no card da barra lateral (`src/views/SidebarView.tsx`).
7. **Executar verificações e atualizar documentação:**
   Rode `npm run typecheck` e `npm run build`, teste o salvamento e o recarregamento da página (F5) e atualize `docs/STATUS.md`.

---

## 9. Como adicionar uma nova regra de negócio

Para alterar uma regra existente ou adicionar uma nova regra sem quebrar o sistema:

1. **Conferir o `docs/FSD.md`:**
   Leia as seções 6, 13 e 14 do `docs/FSD.md` para entender as regras atuais (como ordenação alfabética de pastas, ordenação de combos por `updated_at` decrescente, preservação de `updated_at` durante *Drag and Drop*, bloqueio de renomeação duplicada e aviso de sobrescrita ao salvar).
2. **Localizar onde a regra vive:**
   - Regras de persistência, unicidade no banco local e timestamps ficam em `src/models/folderModel.ts` e `src/models/comboModel.ts`.
   - Regras de interação da barra lateral, índice de árvore e *Drag and Drop* ficam em `src/controllers/useSidebarController.ts`.
   - Regras da fila sequencial de inputs, botão Desfazer e validação do modal ficam em `src/controllers/useComboEditorController.ts`.
   - Regras de concatenação e espaçamento da exportação em texto Numpad ficam em `src/controllers/comboNotationExporter.ts`.
3. **Alterar com isolamento e funções puras:**
   Mantenha a lógica de negócio desacoplada do DOM sempre que possível (em funções puras exportadas) e acione `recordLocalLog` (`src/logs/index.ts`) quando precisar notificar o usuário sobre erros (`level: 'error'`) ou alertas (`level: 'warning'`).
4. **Testar cenários principais e de erro:**
   Teste o caminho feliz (dados válidos) e os caminhos de bloqueio (campos vazios, nomes duplicados, limites máximos atingidos).

---

## 10. Como testar alterações

### Comandos automatizados de verificação
Sempre execute os dois comandos abaixo no terminal antes de concluir qualquer tarefa:

```bash
npm run typecheck
npm run build
```

- `npm run typecheck` garante que nenhum contrato entre Model, Controller e View foi quebrado.
- `npm run build` garante que o pacote final de produção (`dist/`) compila sem erros no Vite.

### Roteiro de testes manuais no navegador (`npm run dev`)
Após alterações funcionais ou visuais, valide os fluxos críticos abaixo:

1. **Inicialização e Persistência Local:**
   - Abrir a aplicação e verificar no cabeçalho o indicador `MIGRATION V1 OK`.
   - Recarregar a página (`F5`) e confirmar que pastas, combos e a preferência visual (**Setas** ou **Numpad**) permanecem salvos.
2. **Gestão de Pastas na Sidebar:**
   - Criar uma pasta manual, tentar criar outra com o mesmo nome (deve bloquear e exibir banner de erro `#FF3333`), renomear pelo ícone de lápis e excluir confirmando no modal.
3. **Criação de Novo Combo e Paleta Visual:**
   - Clicar em `+ Novo Combo`, tentar avançar sem preencher nome/personagem (deve bloquear), preencher e confirmar.
   - Clicar nos botões de ataque (`P`, `K`, `c.S`, `S`, `HS`, `D`, `Dash`), `RC`, direcionais, *motions* e modificadores (`+`, `>`, `~`, `CH`), verificando a rolagem horizontal da sequência e o botão **Desfazer**.
   - Clicar em **Salvar** e verificar se a pasta do personagem foi criada automaticamente na Sidebar.
4. **Regra de Duplicidade e Sobrescrita:**
   - Criar um novo combo com nome idêntico a outro já existente na mesma pasta e clicar em **Salvar**: o sistema deve exibir o modal de aviso perguntando se deseja sobrescrever.
5. **Drag and Drop entre Pastas:**
   - Arrastar um combo de uma pasta para outra na Sidebar e verificar que ele mudou de pasta **sem alterar** sua data de edição (`updated_at`).
6. **Modo de Leitura Protegida e Toggle Setas/Numpad:**
   - Clicar em um combo na Sidebar: deve abrir em modo somente leitura (sem paleta ativa).
   - Alternar o toggle no cabeçalho entre **Setas (↓↘→)** e **Numpad (236)** e verificar a atualização imediata dos tokens.
7. **Exportação Textual ("Copiar como Texto"):**
   - Na tela de leitura, clicar em **Copiar como Texto** e colar (`Ctrl+V`) em um editor de texto para confirmar a formatação Numpad (ex.: `CH c.S > S > 236K > RC > Dash > 623HS`).

### Como verificar erros ou logs
- **Na interface:** Erros e avisos aparecem no topo da tela através do componente `AlertBannerList` (`src/views/AlertBannerList.tsx`) e fecham automaticamente após 5 segundos (ou ao clicar em fechar).
- **No DevTools do navegador (`F12`):**
  - Aba **Console:** Mensagens técnicas higienizadas aparecem com o prefixo `[GGST Combo Maker][ERROR][CODIGO]` ou `[GGST Combo Maker][WARNING][CODIGO]`.
  - Aba **Application > Local Storage:** Permite inspecionar diretamente as chaves `ggst_cm_folders`, `ggst_cm_combos`, `ggst_cm_settings` e `ggst_cm_migrations`.

### Quando atualizar `docs/ERROS.md`
Sempre que você encontrar um erro de compilação, bug de lógica, regressão visual ou armadilha técnica durante uma manutenção, registre o sintoma, a causa, a solução aplicada e como evitar no futuro em `docs/ERROS.md`.

---

## 11. Cuidados de segurança

Mesmo sendo uma aplicação 100% local (SPA sem backend), os seguintes controles de segurança são obrigatórios e **nunca devem ser removidos**:

1. **Prevenção estrita contra XSS (Cross-Site Scripting):**
   - Nunca utilize `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `document.write` ou `eval`.
   - Todo texto fornecido pelo usuário ou lido do Local Storage (nomes de pastas e nomes de combos) deve passar obrigatoriamente por `sanitizeUserText` (`src/models/types.ts`), que remove tags HTML, scripts, caracteres de controle, protocolos perigosos (`javascript:`, `data:`, `vbscript:`) e atributos de evento inline (`onerror=`, `onload=`, etc.).
   - O personagem selecionado deve ser validado contra a lista oficial (`isValidCharacterName` / `sanitizeCharacterSelection`).
2. **Política de Segurança de Conteúdo (CSP) e Referrer Policy (`index.html`):**
   - Preserve as meta tags `Content-Security-Policy` (`default-src 'self'; script-src 'self'; object-src 'none'`, etc.) e `name="referrer" content="no-referrer"` no `index.html`.
3. **Validação de Schema e Limites Quantitativos no Local Storage (`src/models/types.ts` e `src/models/storage.ts`):**
   - Dados vindos de `window.localStorage` ou de eventos de *Drag and Drop* (`dataTransfer`) não são confiáveis.
   - Mantenha a validação de formato de identificadores (`isValidEntityId` via `SAFE_ENTITY_ID_REGEX`) e os limites máximos contra negação de serviço no navegador (`MAX_USER_TEXT_LENGTH = 80`, `MAX_COMBO_SEQUENCE_LENGTH = 200`, `MAX_STORED_FOLDERS = 500`, `MAX_STORED_COMBOS = 2000`).
4. **Proibição de `.env` e Isolamento de Configurações (`src/config/config.ts`):**
   - Não utilize arquivos `.env`. Configurações técnicas ficam centralizadas em `src/config/config.ts`. Jamais armazene chaves secretas ou credenciais privadas em código frontend.
5. **Proteção do Build Estático (`vite.config.ts`):**
   - Mantenha `publicDir: false` e `build.sourcemap: false` em `vite.config.ts` para garantir que apenas o bundle otimizado seja emitido em `dist/`, sem expor a estrutura bruta de pastas de `src/`.
6. **Logs Seguros (`src/logs/index.ts`):**
   - Mantenha o uso de `sanitizeLogUserMessage` e `sanitizeTechnicalDetailsForConsole` para nunca expor pilhas de execução cruas (*stack traces*) ou caminhos do sistema de arquivos ao usuário.
7. **Recursos fora do escopo atual (Autenticação, CSRF, Uploads, APIs externas):**
   - O sistema atual não realiza chamadas de rede autenticadas, uploads de arquivos nem consultas SQL. Caso uma evolução futura introduza qualquer integração externa, o `docs/FSD.md` e a política CSP do `index.html` deverão ser revisados antes da implementação.

---

## 12. Como registrar progresso

Toda alteração realizada no projeto deve manter a documentação viva sincronizada:

1. **Atualizar `docs/STATUS.md`:**
   Ao concluir qualquer correção ou melhoria, atualize a data/hora, o resumo do que foi alterado e os testes executados em `docs/STATUS.md`.
2. **Atualizar `docs/ERROS.md` (se houver erro):**
   Se qualquer falha ou comportamento inesperado tiver sido diagnosticado e corrigido na tarefa, adicione uma nova entrada datada em `docs/ERROS.md`.

---

## 13. O que não fazer

- **Não reescreva o sistema sem necessidade:** Faça alterações cirúrgicas e incrementais respeitando os módulos existentes.
- **Não altere a stack sem decisão explícita:** Não introduza bibliotecas de estado externas (Redux, Zustand), frameworks CSS (Tailwind, Bootstrap) ou bancos externos sem que o usuário solicite uma mudança de arquitetura.
- **Não remova camadas de segurança para "resolver rápido":** Nunca desative o `strict: true` do TypeScript, não remova `sanitizeUserText` e não afrouxe a `Content-Security-Policy` do `index.html`.
- **Não viole as regras visuais do `docs/DESIGN.md`:**
  - Não aplique `border-radius` arredondado em cards, modais, inputs de texto ou botões do sistema (eles devem ter cantos retos `0px`).
  - Não use as cores exclusivas dos botões de ataque do jogo (`#FF77CC`, `#33CCFF`, `#00E676`, `#FF9900`) em botões comuns da interface.
- **Não versione segredos, caches ou artefatos de build:** Nunca faça commit de `node_modules/`, `dist/`, `.vite/`, `*.tsbuildinfo` ou arquivos `.env`.
- **Não ignore os testes antes de entregar:** Nunca conclua uma alteração sem rodar `npm run typecheck` e `npm run build`.
- **Não altere várias áreas ao mesmo tempo sem explicar o impacto:** Antes de modificar arquivos em múltiplas camadas, explique brevemente o plano de alteração ao usuário.
