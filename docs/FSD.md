# DOCUMENTO DE ESPECIFICAÇÃO FUNCIONAL (FSD)

## 1. Visão Geral

O sistema GGST Combo Maker é uma aplicação web de uso individual voltada para a criação, organização e visualização visual de combos de *Guilty Gear -Strive-*. O público principal são jogadores do game, com foco em iniciantes e intermediários. 

O sistema resolve a dificuldade de leitura e memorização de notações em texto (numpad notation) traduzindo sequências complexas de golpes em uma interface visual clara e intuitiva. Rodando diretamente no navegador do usuário, o sistema atua como um caderno de anotações interativo, permitindo montar combos clicando em botões visuais, salvá-los localmente, organizá-los em pastas por meio de ações de arrastar e soltar, e exportar as sequências em formato de texto para compartilhamento.

## 2. Documentos do Projeto para Implementação

Os documentos necessários para a IA codificadora implementar o sistema são:

- `docs/FSD.md`
- `docs/DESIGN.md`

As decisões técnicas e funcionais necessárias para a implementação já estão consolidadas neste FSD.

## 3. Stack Definida

O projeto utilizará a seguinte stack:

- **Linguagem:** TypeScript.
- **Tecnologias de interface:** React, HTML e CSS.
- **Banco de dados:** Nenhum banco de dados em nuvem; uso exclusivo de Local Storage nativo do navegador para armazenamento.
- **Ferramental de Build:** Vite.
- **Padrão arquitetural:** Organização inspirada no padrão MVC aplicada ao contexto do React.

## 4. Ambientes do Projeto

Os ambientes definidos para o ciclo de vida da aplicação são:

- **Desenvolvimento local:** Node.js com Vite.
- **Testes e homologação:** Não haverá ambiente obrigatório na nuvem; os testes ocorrerão localmente na máquina do desenvolvedor antes da publicação.
- **Produção:** GitHub Pages para hospedagem estática.
- O projeto demandará scripts básicos no `package.json` para facilitar a construção e o deploy estático.

## 5. Arquitetura do Sistema

A arquitetura do sistema seguirá o padrão MVC, adaptado para um *Single Page Application* (SPA) estático construído em React. 

A estrutura base será o `[Diretório do Projeto - Repositório]`, que armazenará todos os arquivos versionados. 

A separação de responsabilidades (MVC) será estruturada da seguinte forma:
- **Model:** Área responsável pela integração com o Local Storage, estruturação e persistência dos dados JSON.
- **View:** Componentes React responsáveis pela renderização da interface visual inspirada no design do jogo.
- **Controller:** Hooks customizados e funções tratadoras de eventos que abrigam o gerenciamento de estados, validações e regras de negócio, conectando a View ao Model.

Estrutura sugerida baseada no `[Diretório do Projeto - Repositório]`:
- `index.html` (Arquivo de entrada da aplicação)
- `src/config/` (Configurações em código protegido)
- `src/app/` (Lógica central)
- `src/models/` (Tipagens TypeScript e comunicação com o Local Storage)
- `src/controllers/` (Hooks e regras de negócio)
- `src/views/` (Componentes React e telas)
- `src/assets/` (Recursos estáticos e CSS)
- `src/database/migrations/` (Mecanismo de inicialização e versionamento da estrutura de dados local)
- `src/logs/` (Tratamento estruturado de logs locais)

Pastas internas do código-fonte (como `config/`, `app/`, `models/`, `controllers/`, `database/`, `migrations/` e `logs/`) não devem ser acessadas diretamente pelo navegador. A IA codificadora deve garantir que o processo de *build* do Vite compile o projeto de forma segura, não expondo a estrutura bruta dos diretórios internos no pacote estático final gerado para produção.

A configuração global técnica usará um arquivo de código, como `src/config/config.ts`, dispensando inteiramente o uso de arquivos `.env` para armazenamento de configurações da aplicação.

## 6. Escopo Funcional da Primeira Versão

As funcionalidades da primeira versão estão divididas nas seguintes áreas funcionais:

**Criação e Edição de Combos**
- **Seleção Obrigatória de Personagem:** Uma janela inicial exige a escolha do personagem a partir de uma lista fixa e a definição do nome do combo antes da criação, impedindo combos órfãos.
  - **Lista fixa de personagens (ordem alfabética):** A.B.A, Anji Mito, Asuka R#, Axl Low, Baiken, Bedman?, Bridget, Chipp Zanuff, Elphelt Valentine, Faust, Giovanna, Goldlewis Dickinson, Happy Chaos, I-No, Jack-O', Jam Kuradoberi, Johnny, Ky Kiske, Leo Whitefang, Lucy, Millia Rage, Nagoriyuki, Potemkin, Queen Dizzy, Ramlethal Valentine, Robo-Ky, Sin Kiske, Slayer, Sol Badguy, Testament, Unika, Venom, Zato-1.
- **Paleta de Botões Visuais:** Interface interativa com:
  - **Botões de ataque:** `P`, `K`, `f.S`, `c.S`, `HS`, `D` e `Dash` (representado visualmente pelo ícone vetorial de boneco correndo em branco sobre botão circular escuro, seguindo a referência `docs/ggst_inputs.png`).
  - **Botão de Red Roman Cancel:** Botão circular com texto `"RC"` e borda/destaque em vermelho (`#E31818` / `#FF3333`).
  - **Direcionais básicos (8 direções + pulo):** `1` (`↙`), `2` (`↓`), `3` (`↘`), `4` (`←`), `6` (`→`), `7` (`↖`), `8` (`↑`), `9` (`↗`) e modificador de pulo `j.` (Jump).
  - **Comandos especiais completos (Motions):** `236` (`↓↘→`), `214` (`↓↙←`), `623` (`→↓↘`), `41236` (`←↙↓↘→`), `63214` (`→↘↓↙←`), `632146` (`→↘↓↙←→`), `236236` (`↓↘→↓↘→`), `[4]6` (`[←]→`) e `[2]8` (`[↓]↑`).
- **Inserção de Modificadores:** Botões adicionais de ligação (`+`, `>`, `~`) e Counter Hit (`CH`), tratados como ícones soltos na sequência.
- **Edição Sequencial (Desfazer):** A inserção ocorre no final da sequência. Uma ação de "desfazer" permite remover o último botão inserido, apagando um a um, de trás para frente, incluindo modificadores.

**Organização e Armazenamento Local**
- **Armazenamento no Navegador:** Salvamento invisível dos dados diretamente no Local Storage do usuário.
- **Gestão de Pastas:** Criação automática de pasta com o nome do personagem (se inexistente) ao salvar um combo, além de criação manual de pastas livres.
- **Arrastar e Soltar (Drag and Drop):** Organização visual permitindo mover combos entre pastas ao arrastar e soltar.
- **Edição de Nomes:** Renomeação de combos e pastas através de um ícone de lápis na listagem.

**Visualização e Compartilhamento**
- **Modo de Leitura Protegido:** Exibição estática em linha do combo selecionado. A edição exige clique explícito no botão "Editar".
- **Alternância de Formato Visual:** Botão (toggle) global no cabeçalho para alternar a exibição direcional entre "Setas" e "Numpad" a qualquer momento, salvando a preferência automaticamente.
- **Copiar como Texto:** Exportação da sequência visual para texto em formato "Numpad" na área de transferência com apenas um clique.
  - **Regra de formatação do texto exportado:** Direcionais básicos, comandos especiais (*motions*) e `j.` seguidos diretamente de botões de ataque (`P`, `K`, `c.S`, `f.S`, `HS`, `D`) ou ligados por `~` são concatenados sem espaço (ex.: `2` + `K` = `2K`; `236` + `P` = `236P`; `j.` + `S` = `j.S`; `214` + `K` + `~` + `P` = `214K~P`). Já conectores e tokens independentes como `>`, `+`, `RC`, `Dash` e `CH` são separados por espaço simples (ex.: `CH c.S > f.S > 236K > RC > Dash > 623HS`).

## 7. Fora de Escopo

As seguintes funcionalidades não fazem parte desta primeira versão:
- Login, autenticação e banco de dados na nuvem (dispensados para manter a natureza local do projeto).
- Controle de perfis de usuário e soft delete (exclusão será definitiva).
- Compartilhamento de imagem ou link único (requer infraestrutura extra).
- Importação/Exportação manual de arquivos de backup.
- Cálculo matemático de dano e frames do jogo.
- Menu auxiliar de movimentação de pastas ("Mover para...").
- Múltiplas abas abertas de combos ou ferramentas de Zoom in/out.
- Variantes de cores do Roman Cancel (apenas o Red RC estará disponível).
- Layout focado primeiramente em celulares; a versão inicial prioriza uso em desktop.
- Inserção de golpes no meio da linha (a adição ocorre somente no fim da fila).

## 8. Perfis de Usuário e Permissões

Existe apenas um perfil de usuário no sistema, visto que ele roda de forma local:

- **Jogador (Usuário Único):** Tem acesso total e irrestrito ao sistema local. Pode visualizar, cadastrar, editar, mover e excluir pastas e combos livremente. Também possui permissão para gerenciar a preferência de exibição visual (Setas ou Numpad).

## 9. Recursos Estruturais do Sistema

Os recursos estruturais confirmados para o sistema são:

- **Log de erros:** Implementado exclusivamente no frontend. Focado na captura amigável de falhas locais (ex: estouro de cota do Local Storage) para não quebrar a interface.
- **Configurações globais:** Restrito ao armazenamento da preferência visual do usuário (Setas ou Numpad) e configurações internas técnicas em código, salvas no Local Storage.
- **Exportações:** Ação limitada à cópia textual para a área de transferência do sistema operacional no formato padronizado Numpad.
- **Autenticação, RBAC, Auditoria, Soft Delete, APIs, Uploads, Anexos, Integrações e Log de segurança:** Não se aplicam e não farão parte do sistema.

## 10. Entidades do Sistema

As entidades modeladas em TypeScript refletirão as estruturas salvas em JSON:

- **Configurações:** Guarda a preferência visual ativa do usuário (Setas ou Numpad).
- **Pasta:** Possui atributos como nome e identificador para fins de listagem, organização e agrupamento. A pasta pode ser criada manualmente ou gerada automaticamente e pode ser renomeada.
- **Combo:** Entidade central que guarda o nome do combo, o personagem associado, a pasta à qual pertence, a lista sequencial estruturada dos botões e modificadores preenchidos, e a data da última alteração (usada para ordenação cronológica).

## 11. Modelo de Dados Proposto

O sistema fará uso de uma estrutura modelada para armazenamento no Local Storage, coerente com a stack TypeScript definida. 

A arquitetura de persistência exigirá **migrations** adaptadas para garantir a criação, versão e atualização segura das chaves e estruturas (tabelas lógicas, campos e constraints de integridade de JSON) dentro do navegador, evitando manipulação manual de dados pelo usuário.

**Estrutura Lógica Proposta (Schema JSON):**
- Tabela lógica `folders` (Pastas): Chave primária UUID, campo `name` (String), índice funcional para ordenação alfabética.
- Tabela lógica `combos` (Combos): Chave primária UUID, chave estrangeira `folder_id`, campo `name` (String), campo `character` (String), array `sequence` (lista de inputs), campo `updated_at` (Timestamp para ordenação).
- Tabela lógica `settings` (Configurações): Chave única, campo `visual_preference` (Enum: "arrows" | "numpad").

**Estratégia de Migrations:**
O projeto deverá utilizar uma arquitetura de migrations estruturadas no frontend. Estas migrations atuarão como scripts versionados que inspecionam o Local Storage e inicializam ou alteram a estrutura de arrays/objetos base, garantindo as constraints e chaves lógicas de forma controlada.
- As migrations deverão contemplar a criação das estruturas, definição de chaves lógicas primárias/estrangeiras e campos padrão.
- O sistema deverá incluir uma tabela/chave de controle de migrations executadas no Local Storage para evitar a execução duplicada de rotinas de formatação de dados.
- O código dessas migrations ficará restrito à pasta interna do projeto, como `src/database/migrations/`.
- As migrations não devem ser acessíveis diretamente pelo navegador, sendo acionadas silenciosamente e de forma segura pelo próprio ciclo de inicialização da aplicação React (pelo Controller principal) ao detectar a ausência de tabelas ou versões desatualizadas.

## 12. Módulos e Telas

O sistema usará um layout de página única inspirado no tema "Rock/Metal Moderno" e Dark Mode do jogo.

- **Módulo Principal de Interface:** Agrupa todas as interações e a alternância do botão global (toggle) de Setas/Numpad.
- **Módulo de Organização (Sidebar):** Renderiza as pastas e combos. Permite o *drag-and-drop*, adição de novas pastas, ações de exclusão e edição de nomes (via ícone de lápis). Mensagem de estado vazio exibida quando não houver dados.
- **Módulo de Criação e Edição:** Popup obrigatório inicial para nome e personagem. Após aprovação, exibe a área de renderização sequencial (que deve possuir rolagem horizontal com `overflow-x: auto` e impedir a quebra de linha dos botões para suportar combos extensos) e a paleta interativa de inputs emulando os controles do jogo. Os botões devem ser perfeitamente circulares, com sombras simulando 3D e **aplicando o mapeamento exato de cores** definido no `docs/DESIGN.md` (como Rosa para Punch, Azul para Kick, Verde para Slash, etc.). Inclui botão "Desfazer" para o último golpe e botão de "Salvar".
- **Módulo de Leitura e Compartilhamento:** Exibe o combo estático e protegido após seleção. Oferece botões de "Editar" e "Copiar como Texto".

## 13. Fluxos Funcionais

**Fluxo de Criação de Combo:**
1. O usuário acessa a aplicação e clica em "Novo Combo".
2. O sistema exibe o popup solicitando nome e personagem da lista fixa.
3. O usuário preenche e confirma.
4. O sistema libera a paleta interativa.
5. O usuário clica nos golpes/modificadores; a sequência cresce na tela.
6. O usuário clica em "Salvar".
7. O sistema valida dados, cria a pasta do personagem se inexistente, persiste no Local Storage e o exibe na barra lateral.

**Fluxo de Edição de Combo:**
1. O usuário clica em um combo na sidebar.
2. O sistema exibe o combo estático.
3. O usuário clica em "Editar", destravando a paleta.
4. O usuário adiciona ou remove itens (via Desfazer).
5. Ao salvar, o sistema sobrescreve a versão original no armazenamento e atualiza o `updated_at`.

## 14. Validações e Regras de Negócio

- **Obrigatoriedade:** Todo combo deve ter um nome válido, um personagem e pertencer a uma pasta.
- **Regra de Duplicidade (Criação/Edição):** Ao salvar um novo combo com nome já existente na mesma pasta, o sistema bloqueia e emite um *warning* perguntando se deseja sobrescrever.
- **Regra de Duplicidade (Renomeação):** Ao tentar renomear uma pasta ou combo (via lápis) para um nome já em uso naquele nível, a ação é bloqueada com erro forçando a escolha de nome único.
- **Sobrescrita:** Edições de conteúdo salvam permanentemente por cima do original.
- **Ordenação:** Pastas são exibidas em ordem alfabética. Combos dentro das pastas são listados pela data de última edição (decrescente). *Nota: O ato de arrastar um combo de uma pasta para outra não altera essa data de edição*.
- **Estado Vazio:** A área de organização exige exibição de texto instrutivo caso as chaves lógicas locais estejam vazias.

## 15. Autenticação e Sessão

O sistema não possui autenticação, fluxos de login, recuperação de acesso ou sessões de usuário expiráveis. A operação acontece de forma inteiramente aberta e contínua no navegador de quem o executa.

## 16. Controle de Acesso

O sistema não utilizará perfis de acesso, RBAC ou controle de permissões em rotas. O usuário local tem controle pleno e irrestrito sobre a interface e o Local Storage da aplicação.

## 17. Auditoria e Histórico

O sistema não manterá registros de auditoria em campos paralelos ou histórico de versionamento detalhado (como quem alterou ou retenção histórica de ações). A exclusão de um botão ou dado é final e as edições sobrescrevem permanentemente o conteúdo.

## 18. Soft Delete e Exclusões

Não será implementado recurso de soft delete ou lixeira. 

Ao solicitar exclusão de uma pasta (e consequentemente seus combos internos) ou de um combo individual, o sistema exibirá obrigatoriamente um aviso de confirmação na tela. Com a confirmação, os dados serão excluídos definitivamente das chaves do Local Storage, sem possibilidade de recuperação posterior.

## 19. Logs

### Log de erros
Falhas de processamento locais (como limite de tamanho do Local Storage estourado ou formatação JSON inválida) serão registradas internamente para tratamento. 
O Controller enviará a mensagem de erro formatada para o `console.error` do navegador e renderizará um estado visual na interface utilizando a cor de Erro definida pelo design (`#FF3333`). Não haverá gravação remota de banco, mas será criado um mecanismo lógico (array temporário ou objeto seguro de debug na memória da sessão) para organizar alertas antes de exibi-los.

### Log de segurança
O sistema não demanda e não implementará log de segurança, dada a ausência de infraestrutura externa, login e proteção de credenciais.

## 20. Configurações Globais

A única configuração global manipulável pela interface é a preferência visual de leitura (Setas ou Numpad) do usuário. 

Credenciais e parâmetros técnicos do sistema não usarão arquivos `.env` devido à sua natureza propensa a vazamentos. As configurações de arquitetura técnica da aplicação devem ficar isoladas em um arquivo TypeScript compilado, localizado no `[Diretório do Projeto - Repositório]`, especificamente como `src/config/config.ts`. 

Este arquivo conterá nomes lógicos das chaves de Local Storage, chaves estruturais fixas, parâmetros de inicialização de migrations locais e regras globais, evitando hardcoding no app. A aplicação o carregará internamente via imports do TypeScript, e o mecanismo de build do Vite garantirá que a pasta não fique acessível diretamente pelo navegador.

## 21. Uploads, Anexos e Arquivos

Não haverá funcionalidade de uploads de imagens ou envio de anexos na primeira versão. A estética visual dos ícones do jogo será tratada de forma nativa e segura no código utilizando as marcações de CSS presentes no `docs/DESIGN.md`.

## 22. Relatórios, Consultas e Exportações

A única consulta avançada será visual (Módulo Sidebar), exigindo índices lógicos internos durante a varredura do Local Storage para ordenar pastas alfabeticamente e combos por data, evitando lentidão durante atualizações no DOM do React.

A funcionalidade de exportação resume-se a converter e enviar o combo atualmente em exibição estática direto para a área de transferência do usuário como uma *string* de texto no formato rígido Numpad. 

## 23. APIs e Integrações Externas

O sistema operará em formato offline-first no navegador do cliente. Integrações e comunicação via APIs não fazem parte desta versão inicial.

## 24. Segurança Funcional

O cuidado primário de segurança baseia-se na proteção do rendering do React contra XSS (Cross-Site Scripting). O nome do personagem, da pasta e do combo fornecidos pelo usuário serão guardados no Local Storage. Na devolução para o sistema visual da View, o código deve garantir sanitização rigorosa para impedir que strings personalizadas injetem scripts indesejados no DOM local.

## 25. Organização Sugerida da Implementação

A IA codificadora deve conduzir a implementação em ambiente local a partir do `[Diretório do Projeto - Repositório]` com Node.js e Vite, dividindo o processo em etapas progressivas e testáveis:

1. Preparação do `[Diretório do Projeto - Repositório]` com Vite.
2. Criação da estrutura inicial de pastas (`src/models`, `src/views`, `src/config`, etc.).
3. Configuração do arquivo TypeScript de configurações (`src/config/config.ts`).
4. Criação da estrutura da arquitetura de Migrations para Local Storage (`src/database/migrations/`).
5. Execução do script inicial seguro de validação e modelagem de chaves lógicas do JSON (tabelas e constraints).
6. Implementação das regras MVC base e Hooks de interação com os dados.
7. Desenvolvimento da estilização global baseada no `docs/DESIGN.md`.
8. Construção da barra lateral (consultas, estados vazios, listagens ordenadas e rename).
9. Implementação do recurso estrutural de *Drag and Drop*.
10. Construção do fluxo do modal de Novo Combo (validações de duplicidade).
11. Implementação da View de edição (paleta de inputs visuais e lógica do Desfazer).
12. Lógica global do toggle e conversão visual entre Setas/Numpad.
13. Implementação da exportação textual.
14. Tratamento de erros funcionais e alertas visuais amigáveis.
15. Revisão da sanitização contra XSS.
16. Preparação final dos scripts estáticos para entrega no GitHub Pages.

## 26. Critérios de Aceitação Técnica e Funcional

Para o projeto ser considerado finalizado de forma satisfatória:
- Funcionalidades principais do MVP foram entregues integralmente.
- O padrão MVC em React está evidente no código-fonte.
- A persistência funcional no Local Storage funciona via modelo JSON coerente.
- Migrations locais estruturam, materializam e atualizam os dados armazenados em JSON evitando execuções duplicadas.
- Pastas são listadas alfabeticamente e combos por antiguidade, mantendo a integridade durante o Drag-and-Drop.
- Exclusão exibe alerta preventivo e deleta permanentemente (sem soft delete).
- Não há autenticação, não há lixeira, não há relatórios estatísticos inventados.
- A renderização visual das páginas imita fielmente as regras de cores, arredondamento e fontes fornecidas pelo `docs/DESIGN.md` sem exigir uploads.
- O projeto e estrutura arquitetural rodam baseados no `[Diretório do Projeto - Repositório]` e as dependências internas/migrations não ficam expostas de forma vulnerável após o build.
- Arquivo de configuração base criado em código protegido sem uso de `.env`.
- A área de renderização sequencial dos combos implementa rolagem horizontal fluida (`overflow-x: auto`) e impede a quebra de linha dos botões de inputs.

## 27. Pontos Pendentes e Decisões Futuras

Não foram identificadas pendências para iniciar a codificação com base neste FSD. O FSD conseguiu contemplar todas as restrições arquiteturais aliadas à ausência de servidor, moldando o sistema de forma contínua e autossuficiente.

## 28. Conclusão

O documento consolida de forma integral os requisitos estruturais e de interface necessários para a materialização da primeira versão da aplicação web baseada em Local Storage. A Especificação Funcional está aprovada e pronta para o desenvolvimento.

Os documentos que devem ser entregues para a IA codificadora junto com este FSD são:
- `docs/FSD.md`
- `docs/DESIGN.md`