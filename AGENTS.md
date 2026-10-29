# Contexto do Projeto para Agentes de IA (`AGENTS.md`)

## 1. Idioma Obrigatório

- Responda **sempre em português do Brasil** em todas as interações, explicações, mensagens de status, documentação e comentários de código.

## 2. Protocolo dos Arquivos Vivos

```text
Antes de iniciar qualquer trabalho:
1. Ler `docs/FSD.md`.
2. Ler `docs/DESIGN.md`.
3. Ler `docs/INSUMOS.md`.
4. Ler `docs/PLANO.md`.
5. Ler `docs/STATUS.md`.
6. Ler `docs/ERROS.md`.

Use sempre caminhos relativos à raiz do projeto.
Não transformar estes caminhos em links absolutos.
Não usar links `file:///`.
Não registrar caminhos locais da máquina atual dentro do `AGENTS.md`.

Ao terminar qualquer trabalho:
1. Atualizar `docs/STATUS.md`.
2. Registrar erros e soluções em `docs/ERROS.md`, se houver.
3. Informar ao usuário o que foi feito.
4. Informar como testar ou validar a entrega.
```

## 3. Stack, Arquitetura e Restrições (Conforme `docs/FSD.md`)

- **Linguagem:** TypeScript.
- **Tecnologias de Interface:** React, HTML5 e CSS3 (sem frameworks CSS externos não especificados; estilização fiel ao `docs/DESIGN.md`).
- **Ferramental de Build:** Vite.
- **Persistência / Banco de Dados:** Exclusivamente **Local Storage** nativo do navegador. Não há banco de dados em nuvem, servidor backend ou APIs externas.
- **Padrão Arquitetural:** Padrão **MVC** adaptado para *Single Page Application* (SPA) em React:
  - **Model (`src/models/`):** Tipagens TypeScript, estruturação de schemas JSON e comunicação direta com o Local Storage.
  - **View (`src/views/`):** Componentes React responsáveis pela renderização visual inspirada em *Guilty Gear -Strive-*.
  - **Controller (`src/controllers/`):** Hooks customizados e funções tratadoras de eventos que abrigam gerenciamento de estado, validações, regras de negócio e conexão entre View e Model.
- **Migrations no Frontend (`src/database/migrations/`):** Scripts versionados acionados silenciosamente na inicialização da aplicação para criar, validar e atualizar as chaves lógicas (`folders`, `combos`, `settings`) e a tabela de controle de migrations no Local Storage, evitando execuções duplicadas.
- **Configuração em Código (`src/config/config.ts`):** Parâmetros técnicos, chaves do Local Storage e lista fixa de personagens ficam centralizados em `src/config/config.ts`. **É proibido usar arquivos `.env`**.
- **Fora de Escopo (Não inventar):** Sem login/autenticação, sem RBAC/perfis de acesso, sem *soft delete* (exclusão é definitiva após confirmação), sem upload de arquivos, sem cálculo de dano/frames, sem variantes de cor de Roman Cancel (apenas Red RC), sem inserção de golpes no meio da fila (apenas no fim, com opção de Desfazer).

## 4. Ambientes do Projeto

- **Desenvolvimento Local:** Node.js com servidor de desenvolvimento do Vite.
- **Testes e Homologação:** Execução e validação local na máquina de desenvolvimento antes da publicação.
- **Produção:** Hospedagem estática via **GitHub Pages** a partir do pacote compilado pelo Vite (`dist/`).

## 5. Estrutura de Pastas do Projeto

```text
index.html                  # Arquivo de entrada HTML da aplicação
package.json                # Dependências e scripts npm
tsconfig.json               # Configurações do compilador TypeScript
vite.config.ts              # Configuração de build e servidor do Vite
docs/
  FSD.md                    # Especificação Funcional e Técnica
  DESIGN.md                 # Design System e guia de estilos GGST
  INSUMOS.md                # Inventário de insumos e referências
  PLANO.md                  # Plano de construção em fases incrementais
  STATUS.md                 # Estado atual do projeto e progresso das fases
  ERROS.md                  # Histórico de erros encontrados e soluções
src/
  main.tsx                  # Ponto de entrada React
  vite-env.d.ts             # Declarações de tipos do Vite
  config/
    config.ts               # Configurações globais protegidas em código (sem .env)
  app/
    App.tsx                 # Componente raiz e orquestração inicial
  models/                   # Entidades TypeScript e acesso ao Local Storage
  controllers/              # Hooks customizados, validações e regras de negócio
  views/                    # Componentes visuais e telas React
  assets/
    styles/
      global.css            # Variáveis CSS e estilos globais do Design System
  database/
    migrations/             # Scripts versionados de inicialização do Local Storage
  logs/                     # Tratamento estruturado de logs de erros locais
```

## 6. Comandos Principais

- **Instalar dependências:** `npm install`
- **Rodar em desenvolvimento:** `npm run dev`
- **Validar tipagem TypeScript:** `npm run typecheck`
- **Gerar build de produção:** `npm run build`
- **Visualizar build de produção localmente:** `npm run preview`

## 7. Regras de Segurança (Adequadas à Stack SPA + Local Storage)

1. **Prevenção contra XSS (Cross-Site Scripting):** Prioridade máxima de segurança definida no `docs/FSD.md` (seção 24). Todos os dados fornecidos pelo usuário ou lidos do Local Storage (nomes de combos, nomes de pastas e personagens) devem ser rigorosamente validados e sanitizados antes de serem persistidos ou renderizados na View. Nunca utilizar `dangerouslySetInnerHTML` com dados dinâmicos.
2. **Isolamento de Configurações (Sem `.env`):** Conforme seção 20 do `docs/FSD.md`, não utilizar arquivos `.env`. Todas as configurações técnicas globais residem em `src/config/config.ts` e são compiladas no bundle pelo Vite.
3. **Proteção da Estrutura Interna no Build:** As pastas internas (`src/config/`, `src/app/`, `src/models/`, `src/controllers/`, `src/database/migrations/` e `src/logs/`) não devem ser expostas na forma bruta no pacote final estático (`dist/`), sendo empacotadas de forma segura pelo processo de build do Vite.
4. **Integridade do Local Storage e Validação de Schema:** Dados carregados do Local Storage nunca devem ser considerados confiáveis sem validação prévia de formato JSON e integridade de chaves (`folders`, `combos`, `settings`), prevenindo que edições manuais no navegador quebrem a aplicação.
5. **Mensagens de Erro e Logs Seguros (`src/logs/`):** Falhas locais (como estouro de cota do Local Storage `QuotaExceededError` ou JSON inválido) devem ser capturadas sem derrubar a interface, enviadas de forma estruturada ao `console.error` e apresentadas ao usuário com mensagens claras na cor de erro (`#FF3333`), sem expor pilhas de execução cruas na tela.

## 8. Interface e Design System (`docs/DESIGN.md`)

- **Identidade Visual:** Tema "Rock/Metal Moderno", Dark Mode de alto contraste (`#121212` fundo principal, `#1E1E1E` secundário, `#F5F5F5` texto principal, `#A0A0A0` texto secundário, `#E31818` vermelho de destaque da marca).
- **Uso Semântico Restrito das Cores de Input:** As cores dos botões do jogo (`P` `#FF77CC`, `K` `#33CCFF`, `c.S`/`f.S` `#00E676`, `HS` `#FF3333`, `D` `#FF9900`, `RC` `#E31818`/`#FF3333`, direcionais em gradiente `#FF6600` a `#FFCC00`) são **exclusivas** para os botões de comando do jogo e não devem estilizar menus ou botões comuns do sistema.
- **Geometria de Bordas:** Elementos de interface geral (cards, modais, menus, botões de sistema) possuem cantos retos (`border-radius: 0px`), enquanto botões de input do jogo são perfeitamente circulares (`border-radius: 50%`) com efeito 3D (`radial-gradient` e `box-shadow`).
- **Botão Dash:** Representado por botão circular escuro com ícone vetorial SVG de boneco correndo e aro interno em branco (`#F5F5F5`), reproduzido em código conforme `docs/FSD.md` e `docs/INSUMOS.md`.
- **Área de Sequência do Combo:** Deve implementar rolagem horizontal fluida (`overflow-x: auto`) e impedir quebra de linha dos botões de input.

## 9. Boas Práticas de Código

- Escrever código TypeScript estrito, claro, com funções pequenas e responsabilidades bem definidas dentro da camada correta do MVC.
- Utilizar nomes descritivos e comentários objetivos em **português do Brasil** quando agregarem clareza às regras de negócio.
- Evitar duplicação de código e jamais implementar recursos fora do escopo delimitado em `docs/FSD.md`.
