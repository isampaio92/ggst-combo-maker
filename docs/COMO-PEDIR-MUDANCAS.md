# Como Pedir Mudanças para a IA — GGST Combo Maker (`docs/COMO-PEDIR-MUDANCAS.md`)

Este guia foi criado para ajudar você (mesmo sem conhecimento técnico em programação) a pedir correções, ajustes visuais ou novas funcionalidades para uma Inteligência Artificial (IA) no futuro sem correr o risco de estragar o que já está funcionando.

---

## 1. Como pedir mudanças de forma simples e segura

Sempre que você abrir um **chat novo** com a IA para alterar o **GGST Combo Maker**, siga estas 4 regras de ouro:

1. **Peça uma coisa de cada vez:** Em vez de pedir 5 mudanças grandes de uma só vez, peça uma alteração por etapa, teste no navegador e só depois peça a próxima.
2. **Mande a IA ler a documentação do projeto primeiro:** Isso evita que a IA invente tecnologias que o projeto não usa ou quebre o visual de *Guilty Gear -Strive-*.
3. **Peça para a IA explicar o plano antes de mexer nos arquivos:** Assim você confirma se ela entendeu exatamente o que você quer.
4. **Exija testes e atualização do status ao final:** A IA deve sempre testar a tipagem (`npm run typecheck`), o build (`npm run build`) e atualizar `docs/STATUS.md` (e `docs/ERROS.md`, se houver erro).

---

## 2. Frase obrigatória para começar seus pedidos

Em todos os pedidos futuros, inclua sempre esta instrução no início do seu prompt (já incluída nos modelos prontos abaixo):

> *"Antes de alterar qualquer arquivo, leia `AGENTS.md`, `docs/MANUTENCAO.md`, `docs/FSD.md`, `docs/DESIGN.md`, `docs/STATUS.md` e `docs/ERROS.md`."*

---

## 3. Modelos de prompts prontos (Copie, adapte a parte entre colchetes e cole no chat)

### Modelo 1 — Adicionar um campo em um cadastro (Ex.: Notas ou Posição no Combo)

```text
Responda sempre em português do Brasil.

Antes de alterar qualquer arquivo, leia `AGENTS.md`, `docs/MANUTENCAO.md`, `docs/FSD.md`, `docs/DESIGN.md`, `docs/STATUS.md` e `docs/ERROS.md`.

Quero adicionar um novo campo no cadastro de Combo:
- Nome do campo: [Ex.: "Posição na Tela" (com as opções "Midscreen" e "Corner") OU "Observações de Execução" (texto curto opcional de até 120 caracteres)].
- Onde preencher: [Ex.: No modal "Novo Combo" e também na tela de edição do combo].
- Onde mostrar: [Ex.: Na tela de leitura protegida do combo (`ComboReadOnlyView`) e como uma etiqueta discreta ao lado do combo na Sidebar].

Regras importantes:
1. Explique primeiro o seu plano e quais arquivos (`src/models/`, `src/controllers/`, `src/views/`) serão alterados.
2. Mantenha compatibilidade com os combos que já estão salvos no Local Storage (defina um valor padrão seguro para combos antigos).
3. Aplique sanitização contra XSS (`sanitizeUserText`) e respeite o visual do `docs/DESIGN.md` (cantos retos `0px`).
4. Ao terminar, rode `npm run typecheck` e `npm run build`, atualize `docs/STATUS.md` e me explique como testar no navegador.
```

---

### Modelo 2 — Criar uma nova tela ou modal (Ex.: Guia Rápido de Notação Numpad)

```text
Responda sempre em português do Brasil.

Antes de alterar qualquer arquivo, leia `AGENTS.md`, `docs/MANUTENCAO.md`, `docs/FSD.md`, `docs/DESIGN.md`, `docs/STATUS.md` e `docs/ERROS.md`.

Quero criar uma nova tela/modal no sistema:
- Nome da tela/modal: [Ex.: Modal "Guia Rápido de Inputs e Notação Numpad"].
- Como abrir: [Ex.: Através de um botão secundário "? Guia Numpad" no cabeçalho principal (`App.tsx`)].
- O que deve mostrar: [Ex.: O diagrama das direções do teclado numérico (1 a 9 com suas setas equivalentes), o significado das siglas P, K, c.S, S, HS, D, RC, Dash e CH, e o que significam os conectores >, + e ~].

Regras importantes:
1. Respeite a arquitetura MVC do projeto (`src/views/`, `src/controllers/`, `src/models/`) e o estilo Dark "Rock/Metal Moderno" do `docs/DESIGN.md` (fundo `#1E1E1E`, bordas retas `0px`, títulos em caixa alta na fonte `Teko`).
2. Não quebre nenhuma funcionalidade existente na Sidebar ou no Editor de Combos.
3. Explique o plano antes de codificar.
4. Ao finalizar, valide com `npm run typecheck` e `npm run build`, atualize `docs/STATUS.md` e me diga como testar.
```

---

### Modelo 3 — Corrigir um erro ou comportamento inesperado

```text
Responda sempre em português do Brasil.

Antes de alterar qualquer arquivo, leia `AGENTS.md`, `docs/MANUTENCAO.md`, `docs/FSD.md`, `docs/DESIGN.md`, `docs/STATUS.md` e `docs/ERROS.md`.

Encontrei um problema no sistema e preciso que você corrija:
- O que eu fiz (passo a passo): [Ex.: Cliquei em editar um combo na pasta do Sol Badguy, adicionei o botão RC e cliquei em Salvar].
- O que deveria acontecer: [Ex.: O combo deveria ser atualizado mantendo a pasta atual selecionada].
- O que aconteceu de errado: [Ex.: Apareceu tal mensagem de erro na tela / o botão não respondeu / no console do navegador (F12) apareceu: "COLE A MENSAGEM AQUI SE HOUVER"].

Regras importantes:
1. Investigue a causa raiz na camada correta (Model, Controller ou View) e me explique o motivo do problema antes de alterar.
2. Faça apenas a correção necessária sem reescrever partes que já funcionam.
3. Rode `npm run typecheck` e `npm run build` para garantir que não criou novos erros.
4. Registre o erro e a solução aplicada em `docs/ERROS.md` e atualize `docs/STATUS.md`.
5. Me explique passo a passo como testar se o problema foi resolvido.
```

---

### Modelo 4 — Alterar uma regra de negócio (Ex.: Novo Personagem DLC ou Botão Duplicar Combo)

```text
Responda sempre em português do Brasil.

Antes de alterar qualquer arquivo, leia `AGENTS.md`, `docs/MANUTENCAO.md`, `docs/FSD.md`, `docs/DESIGN.md`, `docs/STATUS.md` e `docs/ERROS.md`.

Quero alterar/adicionar a seguinte regra de negócio no GGST Combo Maker:
- Mudança desejada: [Ex.: Adicionar o novo personagem de DLC "Nome do Personagem" na lista fixa de personagens em ordem alfabética em `src/config/config.ts` OU Permitir um botão "Limpar Sequência" ao lado do botão "Desfazer" no editor de combos].
- Como deve funcionar nos casos de erro ou limite: [Ex.: O botão "Limpar Sequência" só deve ficar habilitado quando houver pelo menos 1 input na sequência].

Regras importantes:
1. Confira antes no `docs/FSD.md` se essa mudança afeta alguma outra regra (como salvamento no Local Storage ou exportação Numpad) e me explique o impacto.
2. Mantenha todas as validações e sanitizações de segurança existentes.
3. Ao concluir, execute `npm run typecheck` e `npm run build`, atualize `docs/STATUS.md` e informe como validar.
```

---

### Modelo 5 — Ajustar o visual conforme o `docs/DESIGN.md`

```text
Responda sempre em português do Brasil.

Antes de alterar qualquer arquivo, leia `AGENTS.md`, `docs/MANUTENCAO.md`, `docs/FSD.md`, `docs/DESIGN.md`, `docs/STATUS.md` e `docs/ERROS.md`.

Quero fazer um ajuste visual na interface:
- Onde fica o elemento: [Ex.: Na trilha de sequência do combo (`ComboEditorView` e `ComboReadOnlyView`) OU Nos botões da barra lateral (`SidebarView`)].
- O que quero mudar no visual: [Ex.: Quero aumentar levemente o tamanho dos botões circulares na visualização de leitura para facilitar a leitura de longe no monitor].

Regras obrigatórias do `docs/DESIGN.md`:
1. Mantenha o tema Dark Mode de alto contraste (`#121212` fundo principal, `#1E1E1E` secundário, `#F5F5F5` texto principal, `#E31818` vermelho de destaque).
2. Mantenha cantos retos (`border-radius: 0px`) em cards, modais e botões do sistema, e formato circular 3D (`border-radius: 50%`) apenas nos botões de input do jogo.
3. Nunca use as cores dos botões de ataque (`P`, `K`, `c.S`, `S`, `HS`, `D`) em menus ou botões comuns da interface.
4. Ao terminar, rode `npm run typecheck` e `npm run build`, atualize `docs/STATUS.md` e me diga como conferir na tela.
```

---

### Modelo 6 — Criar uma consulta ou filtro (Ex.: Busca rápida na Sidebar)

```text
Responda sempre em português do Brasil.

Antes de alterar qualquer arquivo, leia `AGENTS.md`, `docs/MANUTENCAO.md`, `docs/FSD.md`, `docs/DESIGN.md`, `docs/STATUS.md` e `docs/ERROS.md`.

Quero adicionar um filtro de consulta rápida na barra lateral (`SidebarView`):
- O que o filtro deve fazer: [Ex.: Um campo de busca por texto no topo da Sidebar que filtra em tempo real as pastas e combos pelo nome do combo ou pelo nome do personagem].
- Comportamento quando não encontrar nada: [Ex.: Exibir uma mensagem discreta em `#A0A0A0` dizendo "Nenhum combo encontrado para esta busca" e um botão para limpar o filtro].

Regras importantes:
1. A busca deve manter a ordenação padrão do sistema (pastas em ordem alfabética e combos internos por `updated_at` decrescente).
2. O filtro não deve alterar nem apagar nada no Local Storage, apenas filtrar a visualização na tela.
3. Sanitize o texto digitado e siga o estilo de inputs de formulário do `docs/DESIGN.md` (borda inferior de 2px que fica `#E31818` no foco).
4. Valide com `npm run typecheck` e `npm run build`, atualize `docs/STATUS.md` e me explique como testar.
```

---

### Modelo 7 — Revisar segurança depois de uma mudança

```text
Responda sempre em português do Brasil.

Leia `AGENTS.md`, `docs/MANUTENCAO.md`, `docs/FSD.md`, `docs/STATUS.md` e `docs/ERROS.md`.

Acabamos de fazer alterações no sistema e quero uma revisão completa de segurança antes de publicar:
1. Verifique se todas as entradas de texto do usuário e leituras do Local Storage passam por `sanitizeUserText` e `sanitizeCharacterSelection` contra XSS.
2. Verifique se nenhum `dangerouslySetInnerHTML`, `innerHTML` ou `eval` foi introduzido.
3. Confira se a `Content-Security-Policy` no `index.html`, os limites máximos em `src/models/types.ts` e a higienização de logs em `src/logs/index.ts` continuam intactos.
4. Confira se não existe arquivo `.env` e se o build de produção (`npm run build`) gera a pasta `dist/` limpa sem expor pastas internas de `src/`.
5. Corrija qualquer ponto vulnerável encontrado, atualize `docs/STATUS.md` e me apresente o relatório da revisão.
```

---

### Modelo 8 — Preparar uma alteração para commit e backup no GitHub

```text
Responda sempre em português do Brasil.

Leia `AGENTS.md`, `docs/MANUTENCAO.md`, `docs/STATUS.md` e `docs/ERROS.md`.

Quero preparar as alterações atuais para commit no Git com segurança:
1. Execute `npm run typecheck` e `npm run build` para confirmar que o código compila sem erros.
2. Confirme se `docs/STATUS.md` (e `docs/ERROS.md`, se houve erro) já estão atualizados.
3. Verifique `git status` e garanta que `node_modules/`, `dist/`, `.vite/`, `*.tsbuildinfo` ou arquivos sensíveis não serão incluídos no commit.
4. Faça o commit com uma mensagem clara em português descrevendo a alteração realizada (ou me entregue os comandos prontos) e me lembre de executar `git push`.
```

---

## 4. Checklist antes de aceitar uma alteração da IA

Antes de dar uma tarefa como concluída, confira sempre estes 6 itens:

- [ ] **1. A IA leu a documentação antes de mexer?** Ela seguiu o padrão MVC (`src/models/`, `src/controllers/`, `src/views/`) sem inventar ferramentas externas?
- [ ] **2. O compilador e o build passaram sem erros?** Os comandos `npm run typecheck` e `npm run build` terminaram com sucesso?
- [ ] **3. O visual continua fiel ao `docs/DESIGN.md`?** Fundo escuro (`#121212` / `#1E1E1E`), cards e botões do sistema com cantos retos (`0px`) e botões do jogo circulares (`50%`)?
- [ ] **4. Os combos antigos continuam funcionando?** Ao recarregar a página (`F5`), as pastas e combos que já estavam salvos no navegador continuam abrindo normalmente?
- [ ] **5. As funcionalidades principais continuam intactas?** Criar combo, clicar na paleta, usar Desfazer, arrastar entre pastas (*Drag and Drop*), alternar Setas/Numpad e "Copiar como Texto" continuam funcionando?
- [ ] **6. A documentação viva foi atualizada?** O arquivo `docs/STATUS.md` foi atualizado com a mudança (e `docs/ERROS.md` se houve algum erro corrigido)?
