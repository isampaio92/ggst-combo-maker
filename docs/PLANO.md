# Plano de Construção — GGST Combo Maker

Este documento define as fases incrementais de implementação do sistema **GGST Combo Maker**, rigorosamente alinhadas ao `docs/FSD.md`, `docs/DESIGN.md` e `docs/INSUMOS.md`.

> **Nota arquitetural:** Conforme definido nas seções 7, 9, 15 e 16 do `docs/FSD.md`, o sistema é uma aplicação web local (*Single Page Application* em React + TypeScript com Vite e armazenamento exclusivo em Local Storage), **sem** banco de dados em nuvem, **sem** autenticação/sessão e **sem** controle de acesso por perfis (RBAC).

---

## Fase 1 — Infraestrutura, Configuração Base e Estilização Global

### Objetivo da fase
Preparar o repositório com Vite, React e TypeScript, criar a estrutura de pastas do padrão MVC definida no FSD, configurar o arquivo protegido `src/config/config.ts` (sem uso de `.env`), estruturar as variáveis e estilos globais do Design System (`docs/DESIGN.md`) e disponibilizar o ponto de entrada base da aplicação.

### Checklist de tarefas
- [x] Inicializar configuração do projeto com Node.js, Vite, React e TypeScript (`package.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`).
- [x] Criar a estrutura de diretórios do padrão MVC: `src/config/`, `src/app/`, `src/models/`, `src/controllers/`, `src/views/`, `src/assets/`, `src/database/migrations/` e `src/logs/`.
- [x] Implementar `src/config/config.ts` com parâmetros globais do sistema, nomes das chaves lógicas do Local Storage (`folders`, `combos`, `settings`, controle de migrations), preferência visual padrão e a lista fixa de 33 personagens em ordem alfabética.
- [x] Configurar `index.html` e a estilização global base (`src/assets/styles/global.css`) seguindo a paleta de cores, tipografia (`Teko`/`Oswald`, `Inter`/`Roboto`), espaçamentos (grid de 8px) e regras de contraste do `docs/DESIGN.md`.
- [x] Criar o ponto de entrada inicial (`src/main.tsx` e `src/app/App.tsx`) e instalar as dependências locais do projeto.
- [x] Validar compilação TypeScript e build estático do Vite garantindo que a estrutura bruta de diretórios internos não fique exposta no pacote de produção.

### Critérios de pronto
- Dependências instaladas e comandos `npm run dev` e `npm run build` executando sem erros.
- Estrutura de pastas MVC integralmente criada na raiz do repositório.
- Arquivo `src/config/config.ts` implementado sem uso de arquivos `.env`.
- Variáveis CSS e estilos base do tema Dark "Rock/Metal Moderno" aplicados.

### Arquivos, pastas ou áreas prováveis que serão alterados
- `package.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`, `index.html`
- `src/main.tsx`, `src/vite-env.d.ts`, `src/app/App.tsx`
- `src/config/config.ts`
- `src/assets/styles/global.css`
- `src/models/`, `src/controllers/`, `src/views/`, `src/database/migrations/`, `src/logs/`

### Observações de dependência
- Fase inicial; não possui dependências anteriores e serve de alicerce para todas as demais fases.

---

## Fase 2 — Persistência em Local Storage, Migrations, Logs Locais e Base MVC

### Objetivo da fase
Implementar a modelagem de dados em TypeScript, o sistema estruturado de logs de erros locais, a arquitetura de migrations para inicialização e validação segura das chaves lógicas no Local Storage (`folders`, `combos`, `settings`) e a camada Model/Controller base de acesso aos dados.

### Checklist de tarefas
- [x] Definir as interfaces e tipos TypeScript das entidades (`Folder`, `Combo`, `Settings`, tipos de inputs e schema do Local Storage) em `src/models/`.
- [x] Implementar o mecanismo de log de erros locais em `src/logs/` para captura amigável de falhas (ex.: estouro de cota do Local Storage ou JSON inválido), registro formatado em `console.error` e armazenamento temporário em memória da sessão para exibição de alertas na UI.
- [x] Implementar a arquitetura de migrations em `src/database/migrations/` com chave de controle de versões executadas (evitando execuções duplicadas) e inicialização/validação das tabelas lógicas `folders`, `combos` e `settings` e suas constraints de integridade.
- [x] Implementar os Models de leitura e escrita segura no Local Storage em `src/models/`.
- [x] Criar os Controllers/Hooks base em `src/controllers/` que acionam as migrations silenciosamente no ciclo de inicialização da aplicação React e expõem operações básicas sobre configurações, pastas e combos.

### Critérios de pronto
- Ao iniciar a aplicação, o sistema executa as migrations pendentes silenciosamente e materializa as estruturas JSON (`folders`, `combos`, `settings` e controle de migrations) no Local Storage sem duplicidade.
- Falhas de leitura/escrita ou JSON corrompido são capturadas pelo módulo `src/logs/` sem quebrar a renderização do React.
- Separação clara entre `src/models/`, `src/database/migrations/`, `src/logs/` e `src/controllers/`.

### Arquivos, pastas ou áreas prováveis que serão alterados
- `src/models/`
- `src/database/migrations/`
- `src/logs/`
- `src/controllers/`
- `src/app/App.tsx`

### Observações de dependência
- Depende da **Fase 1** (`src/config/config.ts` e estrutura base).

---

## Fase 3 — Módulo de Organização (Sidebar), Gestão de Pastas e Drag and Drop

### Objetivo da fase
Construir a barra lateral (Sidebar) de organização de pastas e combos, contemplando listagem ordenada (pastas em ordem alfabética e combos por `updated_at` decrescente), estado vazio instrutivo, criação manual de pastas, renomeação com validação de duplicidade, exclusão definitiva com confirmação e movimentação de combos via *Drag and Drop*.

### Checklist de tarefas
- [ ] Implementar a listagem indexada na Sidebar (`src/views/` e `src/controllers/`): pastas ordenadas alfabeticamente e combos internos ordenados por `updated_at` decrescente.
- [ ] Exibir mensagem instrutiva de Estado Vazio (`#A0A0A0` / `#333333`) quando não houver pastas ou combos cadastrados.
- [ ] Implementar criação manual de pastas livres com validação de nome obrigatório e único.
- [ ] Implementar renomeação de pastas e de combos através do ícone de lápis na listagem, bloqueando nomes já em uso no mesmo nível com mensagem de erro.
- [ ] Implementar exclusão de pastas (e seus combos internos) e de combos individuais com aviso obrigatório de confirmação na tela e remoção definitiva do Local Storage (sem *soft delete*).
- [ ] Implementar o recurso de *Drag and Drop* permitindo arrastar e soltar combos entre pastas, atualizando o `folder_id` sem alterar a data de edição (`updated_at`).

### Critérios de pronto
- Pastas listadas em ordem alfabética e combos ordenados por data de última alteração (decrescente).
- Arrastar um combo para outra pasta transfere o vínculo (`folder_id`) preservando intacto o `updated_at` original.
- Tentativas de renomear pasta ou combo para nome duplicado no mesmo nível são bloqueadas com feedback de erro.
- Exclusões exigem confirmação explícita e removem os registros definitivamente do Local Storage.

### Arquivos, pastas ou áreas prováveis que serão alterados
- `src/views/` (componentes da Sidebar, modais de confirmação e inputs de renomeação)
- `src/controllers/` (regras de ordenação, validação de duplicidade, exclusão e handlers de Drag and Drop)
- `src/models/` (operações de persistência de pastas e combos)
- `src/assets/styles/`

### Observações de dependência
- Depende da **Fase 2** (persistência em Local Storage, Models e Controllers base).

---

## Fase 4 — Módulo de Criação e Edição de Combos (Modal Inicial e Paleta Visual)

### Objetivo da fase
Implementar o fluxo completo de criação e edição de combos: popup obrigatório inicial de nome e seleção de personagem, validação de duplicidade com opção de sobrescrita, criação automática da pasta do personagem, área de renderização sequencial com rolagem horizontal (`overflow-x: auto`) e paleta interativa de botões visuais circulares com ação de "Desfazer".

### Checklist de tarefas
- [ ] Construir o modal/popup inicial obrigatório ao clicar em "Novo Combo", exigindo nome do combo e seleção de personagem a partir da lista fixa de 33 personagens em ordem alfabética.
- [ ] Implementar a paleta interativa de botões visuais seguindo fielmente as cores e formatos 3D circulares de `docs/DESIGN.md` e `docs/FSD.md`:
  - Botões de ataque: `P` (`#FF77CC`), `K` (`#33CCFF`), `c.S` e `f.S` (`#00E676`), `HS` (`#FF3333`), `D` (`#FF9900`) e `Dash` (ícone SVG de boneco correndo e aro interno em branco `#F5F5F5` sobre botão circular escuro).
  - Botão de Red Roman Cancel: `RC` com destaque/borda em vermelho (`#E31818` / `#FF3333`).
  - Direcionais básicos (8 direções + pulo): `1` (`↙`), `2` (`↓`), `3` (`↘`), `4` (`←`), `6` (`→`), `7` (`↖`), `8` (`↑`), `9` (`↗`) e `j.` (Jump).
  - Comandos especiais completos (*Motions*): `236` (`↓↘→`), `214` (`↓↙←`), `623` (`→↓↘`), `41236` (`←↙↓↘→`), `63214` (`→↘↓↙←`), `632146` (`→↘↓↙←→`), `236236` (`↓↘→↓↘→`), `[4]6` (`[←]→`) e `[2]8` (`[↓]↑`).
  - Modificadores de ligação e estado: `+`, `>`, `~` (`#F5F5F5`) e Counter Hit `CH` (`#E31818` / `#FF9900`).
- [ ] Construir a área de renderização sequencial do combo com rolagem horizontal fluida (`overflow-x: auto`) e sem quebra de linha (`white-space: nowrap` / `flex-wrap: nowrap`) para suportar combos extensos.
- [ ] Implementar a edição sequencial (inserção sempre ao final da fila) e o botão "Desfazer" (removendo o último item inserido, um a um, de trás para frente, incluindo modificadores).
- [ ] Implementar a lógica de salvamento do combo: criação automática da pasta com o nome do personagem caso ainda não exista, verificação de duplicidade de nome na mesma pasta (emitindo *warning* perguntando se deseja sobrescrever) e atualização do `updated_at`.

### Critérios de pronto
- Não é possível iniciar a montagem de um combo sem antes definir nome e personagem válido da lista fixa.
- Todos os botões de ataque, RC, Dash (SVG), direcionais, motions e modificadores inserem tokens na sequência visual com as cores e formatos exatos do `docs/DESIGN.md`.
- Botão "Desfazer" remove o último token inserido.
- Ao salvar, a pasta do personagem é criada automaticamente se inexistente, nomes duplicados na mesma pasta disparam aviso de confirmação de sobrescrita e o combo salvo aparece na Sidebar.

### Arquivos, pastas ou áreas prováveis que serão alterados
- `src/views/` (Modal de Novo Combo, Paleta de Inputs, Área de Sequência, Botões Visuais e SVGs)
- `src/controllers/` (gerenciamento da sequência, Desfazer, validações de criação/sobrescrita)
- `src/models/`
- `src/assets/styles/`

### Observações de dependência
- Depende da **Fase 2** (persistência) e integra-se diretamente com a **Fase 3** (exibição e agrupamento em pastas na Sidebar).

---

## Fase 5 — Módulo de Leitura Protegida, Alternância Setas/Numpad e Exportação Textual

### Objetivo da fase
Implementar o modo de leitura estático e protegido ao selecionar um combo salvo, o toggle global no cabeçalho para alternar em tempo real entre exibição por "Setas" e "Numpad" (persistindo a preferência) e a funcionalidade "Copiar como Texto" no formato Numpad.

### Checklist de tarefas
- [ ] Implementar o Modo de Leitura Protegido: ao selecionar um combo na Sidebar, exibir a sequência em linha de forma estática (sem paleta ativa), oferecendo os botões "Editar" e "Copiar como Texto".
- [ ] Conectar o botão "Editar" para destravar a paleta interativa sobre o combo selecionado e sobrescrever o registro original ao salvar (atualizando `updated_at`).
- [ ] Implementar o botão (toggle) global no cabeçalho do Módulo Principal de Interface para alternar a exibição de todos os direcionais e *motions* entre "Setas" (`↙`, `↓`, `↓↘→`, etc.) e "Numpad" (`1`, `2`, `236`, etc.), salvando a preferência automaticamente na tabela lógica `settings` do Local Storage.
- [ ] Implementar a função "Copiar como Texto" enviando a sequência para a área de transferência do navegador (`navigator.clipboard`) com feedback visual de sucesso (`#00E676`), obedecendo estritamente à regra de formatação do FSD:
  - Direcionais básicos, *motions* e `j.` seguidos diretamente de botões de ataque (`P`, `K`, `c.S`, `f.S`, `HS`, `D`) ou ligados por `~` são concatenados sem espaço (ex.: `2K`, `236P`, `j.c.S`, `214K~P`).
  - Conectores e tokens independentes como `>`, `+`, `RC`, `Dash` e `CH` são separados por espaço simples (ex.: `CH c.S > f.S > 236K > RC > Dash > 623HS`).

### Critérios de pronto
- Selecionar um combo abre o modo somente leitura; a edição só é habilitada após clicar em "Editar".
- O toggle Setas/Numpad altera imediatamente a representação visual dos direcionais e *motions* e mantém a escolha salva ao recarregar a página.
- O botão "Copiar como Texto" copia a string formatada exatamente conforme a regra do FSD para a área de transferência.

### Arquivos, pastas ou áreas prováveis que serão alterados
- `src/views/` (Cabeçalho/Toggle global, View de Leitura e Compartilhamento, renderizador de tokens)
- `src/controllers/` (conversor de Numpad para texto, controle de estado leitura/edição, hook de preferência visual)
- `src/models/`

### Observações de dependência
- Depende da **Fase 4** (estrutura de inputs e visualização da sequência de combos).

---

## Fase 6 — Tratamento Visual de Erros, Sanitização XSS e Preparação para Deploy

### Objetivo da fase
Consolidar os itens transversais do FSD: exibição de alertas visuais amigáveis para erros locais e avisos, revisão de sanitização contra XSS em todos os textos inseridos pelo usuário e configuração final dos scripts de build estático para publicação no GitHub Pages.

### Checklist de tarefas
- [ ] Integrar o estado visual de erros (`#FF3333`) e alertas (`#FF9900`) na interface principal consumindo a fila/memória de erros do módulo `src/logs/` (ex.: falha de cota do Local Storage ou erro de validação).
- [ ] Revisar e garantir a sanitização rigorosa de todas as entradas e saídas textuais (`name` de pastas, `name` de combos e `character`) contra ataques de Cross-Site Scripting (XSS) antes de persistir e renderizar no DOM.
- [ ] Validar os critérios de aceitação técnica e funcional da seção 26 do `docs/FSD.md` e a fidelidade estética ao `docs/DESIGN.md`.
- [ ] Ajustar configurações de caminho relativo (`base`) e scripts no `package.json` / `vite.config.ts` para entrega estática no GitHub Pages e testar o pacote final gerado em `dist/`.

### Critérios de pronto
- Erros de armazenamento ou validação são exibidos na interface com a cor semântica `#FF3333` e registrados via `console.error` sem quebrar a aplicação.
- Nenhuma string personalizada permite injeção de HTML/scripts no DOM.
- Build de produção (`npm run build`) gera artefatos estáticos limpos, prontos para o GitHub Pages, sem expor diretórios internos do código-fonte.
- Todos os critérios de aceitação do `docs/FSD.md` atendidos.

### Arquivos, pastas ou áreas prováveis que serão alterados
- `src/logs/`, `src/controllers/`, `src/views/`
- `vite.config.ts`, `package.json`

### Observações de dependência
- Fase final transversal; depende da conclusão das **Fases 1 a 5**.
