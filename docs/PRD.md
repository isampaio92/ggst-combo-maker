# DOCUMENTO DE REQUISITOS DO PRODUTO (PRD)

## 1. Visão Geral do Produto

O sistema, provisoriamente chamado de **GGST Combo Maker**, é uma aplicação web voltada para a criação, organização e visualização visual de combos (sequências de golpes) do jogo *Guilty Gear -Strive-*. 

O público principal que usará o sistema são os jogadores do jogo, com foco especial em jogadores iniciantes e intermediários. 

O principal benefício esperado é facilitar a leitura e o registro de sequências complexas de golpes, traduzindo anotações em texto para uma interface visual intuitiva, onde os botões na tela imitam os botões do próprio jogo. O contexto de uso é individual, rodando diretamente no navegador do usuário, servindo como um caderno de anotações interativo e visual para suas jogadas.

## 2. Problema que o Sistema Resolve

Atualmente, jogadores de jogos de luta trocam informações sobre combos usando notações em texto (como o padrão de teclado numérico, ex: `c.S > f.S > 236K`). Para jogadores iniciantes, decifrar e memorizar essas anotações textuais é uma tarefa difícil, frustrante e pouco intuitiva.

Além disso, ao tentar organizar suas próprias descobertas e sequências, os jogadores acabam com informações espalhadas em blocos de notas, mensagens salvas ou planilhas, sem uma forma clara de catalogar, visualizar rapidamente ou encontrar um combo específico de um personagem de forma eficiente. O sistema resolve essa dificuldade de leitura e a falta de controle na organização pessoal do jogador.

## 3. Objetivos do Sistema

### Objetivo principal
Fornecer uma ferramenta web intuitiva e visual para que jogadores de *Guilty Gear -Strive-* possam montar, salvar e organizar seus combos de forma legível e estruturada localmente.

### Objetivos específicos
- Eliminar a barreira de leitura de notações complexas, usando ícones visuais para representar comandos.
- Permitir a organização rápida de combos através de pastas (por personagem ou temas customizados).
- Facilitar o compartilhamento simples do combo gerando a notação em texto com apenas um clique.

## 4. Personas e Perfis de Usuário

Como o sistema é de uso pessoal e local, existe apenas um perfil de usuário.

| Perfil | Descrição simples | Principais ações no sistema | Permissões básicas |
| ------ | ----------------- | --------------------------- | ------------------ |
| Jogador | Usuário final que joga *Guilty Gear -Strive-* e deseja anotar seus combos. | Criar combos, criar pastas, salvar, editar, visualizar e excluir. | Acesso total a todas as funcionalidades do sistema local. |

## 5. Escopo da Primeira Versão

As funcionalidades confirmadas para a primeira versão (MVP) estão divididas nas seguintes áreas funcionais:

**Área: Criação e Edição de Combos**
- **Seleção Obrigatória de Personagem:** Antes de iniciar a montagem de um combo, o sistema exibe uma janela (popup) exigindo que o usuário escolha um personagem a partir de uma lista fixa e dê um nome ao combo. Isso garante que não existam combos "órfãos".
- **Paleta de Botões Visuais:** Interface contendo os botões do jogo para o usuário clicar e montar a sequência. Inclui botões de ataque (P, K, f.S, c.S, HS, D, Dash), um botão de Red Roman Cancel exibindo visualmente o texto "RC" com fundo/borda vermelha, direcionais básicos (setas) e movimentos especiais completos pré-montados (ex: meia lua para frente).
- **Inserção de Modificadores:** Botões que representam condições ou ligações (+, >, ~, Counter Hit/CH), que são adicionados na linha visual como ícones soltos.
- **Edição Sequencial (Desfazer):** A adição de golpes ocorre sempre no final da sequência. Se o usuário errar, ele pode usar a função de apagar para remover o último botão adicionado, corrigindo de trás para frente. Os ícones modificadores (+, >, ~, CH) são tratados como botões normais nesta fila e também são apagados um a um pela função desfazer.

**Área: Organização e Armazenamento Local**
- **Armazenamento no Navegador (Local Storage):** O sistema salva todos os dados diretamente no navegador do usuário de forma invisível.
- **Criação Automática e Manual de Pastas:** Ao salvar um combo, se a pasta do personagem não existir, o sistema a cria automaticamente. O usuário também pode criar pastas com nomes livres.
- **Organização via Arrastar e Soltar (Drag and Drop):** O usuário pode arrastar um combo e soltá-lo dentro de qualquer pasta para organizá-lo.
- **Edição de Nomes:** O usuário pode renomear pastas e combos já criados clicando em um ícone de lápis ao lado do nome na listagem.

**Área: Visualização e Compartilhamento**
- **Modo de Leitura Protegido:** Ao clicar em um combo na pasta, ele é exibido na tela principal de forma estática (em linha), protegido contra edições acidentais. Para alterar a sequência, o usuário deve clicar em um botão "Editar".
- **Alternância de Formato Visual:** Haverá um botão de alternância (toggle) global no cabeçalho da interface. Ele permite ao usuário alternar a exibição dos comandos direcionais entre "Setas" (visual amigável) ou "Numpad" (teclado numérico, padrão da comunidade) a qualquer momento. A preferência é salva automaticamente.
- **Copiar como Texto:** Um botão que converte a sequência do combo em texto e copia para a área de transferência do usuário (ex: para colar no Discord). O texto exportado usará sempre a notação "Numpad" (ex: `236P`), independentemente de o usuário estar visualizando em formato de setas na tela.

## 6. Funcionalidades Fora de Escopo

Os seguintes itens foram discutidos e descartados para esta primeira versão para manter a simplicidade e viabilidade do projeto:
- **Login e Banco de Dados na Nuvem:** Requer infraestrutura de servidores e contas.
- **Compartilhamento de Imagem ou Link Único:** Requer geração complexa de arquivos e hospedagem de dados.
- **Backup Manual (Importar/Exportar arquivo):** Adiado para simplificar o lançamento.
- **Cálculo de Dano e Frames:** Exigiria mapear toda a matemática do jogo, o que foge do propósito inicial de organização visual.
- **Inserção de golpes no meio da sequência:** Adiciona grande complexidade de interface (cursores/posicionamento); a exclusão será apenas do último item (desfazer).
- **Menu de mover combos ("Mover para..."):** Movimentação será feita exclusivamente por arrastar e soltar.
- **Zoom In/Out e Múltiplas abas abertas:** A visualização dependerá de rolagem horizontal e apenas um combo poderá ser visualizado/editado por vez.
- **Botões de RC de outras cores:** Apenas o Red Roman Cancel (RC) estará disponível.
- **Otimização avançada para celulares:** O sistema será focado no uso em telas de computador (desktop) inicialmente.

## 7. Regras de Negócio

- **Regra de Dependência e Raiz:** Todo combo deve estar obrigatoriamente vinculado a uma pasta. A raiz do sistema exibe apenas pastas, nunca combos soltos. Se um usuário retirar todos os combos de uma pasta movendo-os para outras, a pasta original permanece vazia até que seja excluída manualmente.
- **Regra de Duplicidade (Salvamento e Renomeação):** 
  - Ao salvar um *novo combo* com um nome já existente na pasta, o sistema exibe um aviso perguntando se deseja sobrescrever o combo antigo.
  - Ao tentar *renomear* um combo ou pasta (via ícone de lápis) para um nome já existente naquele mesmo nível/pasta, o sistema bloqueia a ação e exibe um alerta de erro, obrigando o usuário a escolher um nome único.
- **Regra de Sobrescrita:** Ao editar os golpes de um combo existente e salvá-lo, o sistema sempre sobrescreve a versão original (não há "Salvar como cópia").
- **Regra de Ordenação:** Na listagem lateral, as pastas devem ser exibidas em ordem alfabética. Dentro de cada pasta, os combos devem ser ordenados do mais recente (criado ou editado) para o mais antigo. *Nota:* Mover um combo entre pastas por arrastar e soltar não conta como "edição" e não atualiza sua data de ordenação.
- **Regra de Exclusão:** Quando o usuário tenta excluir uma pasta ou combo, o sistema deve exibir um aviso de confirmação. Após a confirmação, a exclusão é permanente (não existe lixeira).
- **Regra do Estado Vazio:** Se o usuário não tiver pastas ou combos salvos, a interface deve exibir uma mensagem amigável de boas-vindas com instruções sobre como criar o primeiro combo.

## 8. Informações que o Sistema Precisa Controlar

| Informação | Para que serve no sistema | Observações importantes |
| ---------- | ------------------------- | ----------------------- |
| Preferência de Visualização | Define se a tela exibe Setas ou Numpad por padrão para o usuário. | Alterado via toggle global no cabeçalho. |
| Personagens | Lista fixa para escolha ao criar o combo. | Usado apenas como referência de seleção no formulário inicial. |
| Pastas | Agrupadores organizacionais no menu lateral. | Possuem nome e guardam a lista de combos dentro delas. |
| Combos | Registro principal da jogada criada pelo usuário. | Guarda o nome, o personagem, a data da última edição de conteúdo/nome (para ordenação) e a lista sequencial de botões e modificadores. |

## 9. Fluxos Principais de Uso

### Fluxo de Criação de Combo
1. O usuário acessa a tela principal e clica em "Novo Combo".
2. O sistema exibe uma janela solicitando o nome do combo e a escolha do personagem.
3. O usuário preenche os dados e confirma.
4. O sistema libera a paleta de botões visuais na tela.
5. O usuário clica nos botões desejados, que vão aparecendo em linha.
6. O usuário clica em "Salvar".
7. O sistema valida as informações e salva o combo localmente, criando a pasta do personagem (caso não exista) e exibindo o combo na lista.

### Fluxo de Edição de Combo Existente
1. O usuário clica em uma pasta na lista e seleciona um combo.
2. O sistema exibe o combo em modo de leitura (botões bloqueados).
3. O usuário clica no botão "Editar".
4. O sistema destrava a paleta de botões.
5. O usuário adiciona novos golpes ou apaga os últimos golpes da sequência.
6. O usuário clica em "Salvar".
7. O sistema sobrescreve o combo original e atualiza a data de modificação.

## 10. Histórias de Usuário

- Como jogador, eu quero escolher o personagem antes de criar um combo para manter minhas anotações sempre categorizadas corretamente.
- Como jogador, eu quero montar o combo clicando em botões com o mesmo visual do jogo para não precisar ler textos complexos.
- Como jogador, eu quero alternar entre setas direcionais e teclado numérico através de um controle global para visualizar a sequência da forma que me for mais confortável.
- Como jogador, eu quero arrastar meus combos para pastas personalizadas para organizar meu repertório por situações (ex: combos no canto da tela).
- Como jogador, eu quero copiar o combo em formato de texto (numpad) para colar e compartilhar com meus amigos no Discord rapidamente.

## 11. Critérios de Aceitação

- [ ] O sistema impede a criação de um combo sem nome ou sem personagem.
- [ ] O usuário consegue adicionar golpes e visualizá-los em uma linha horizontal sequencial.
- [ ] O usuário consegue usar o botão "desfazer" para apagar o último item da sequência (incluindo ícones modificadores como +, > e CH).
- [ ] O sistema exibe uma barra de rolagem horizontal se o combo for muito longo.
- [ ] O usuário consegue criar pastas e arrastar combos para dentro delas com sucesso.
- [ ] O sistema avisa e pede confirmação antes de salvar um combo novo com nome duplicado na mesma pasta.
- [ ] O sistema bloqueia a renomeação (via lápis) se o nome escolhido já existir no mesmo nível.
- [ ] O sistema avisa e pede confirmação antes de excluir pastas ou combos.
- [ ] As pastas aparecem em ordem alfabética na interface.
- [ ] A área de transferência recebe o combo em formato Numpad (ex: `236P`) ao clicar em "Copiar como Texto".
- [ ] O combo salvo persiste na tela mesmo se o usuário recarregar a página (graças ao armazenamento local).

## 12. Consultas, Relatórios e Indicadores

O sistema não possui relatórios gerenciais ou indicadores numéricos. 
A única consulta necessária é a listagem lateral (estilo explorador de arquivos) que exibe as pastas criadas e, ao serem expandidas, exibe apenas os nomes dos combos salvos ali dentro, ordenados do mais recente (por data de edição) para o mais antigo.

## 13. Permissões e Segurança Funcional

O sistema é rodado integralmente na máquina do usuário sem controle de contas.

| Perfil | Pode fazer | Não pode fazer | Observações |
| ------ | ---------- | -------------- | ----------- |
| Jogador (Usuário Único) | Visualizar, cadastrar, editar e excluir combos e pastas; alternar preferências visuais. | Acessar dados de outros usuários. | Os dados ficam restritos ao navegador em que o usuário está acessando. Se ele limpar o histórico de navegação, perderá os dados. |

## 14. Limitações da Primeira Versão

- O sistema funcionará apenas de forma local no navegador. Não haverá sincronização na nuvem; se o usuário formatar o computador ou limpar os dados do navegador, os combos serão perdidos.
- A interface não terá adaptações complexas de toque e usabilidade para telas pequenas (smartphones), sendo focada no uso com mouse em computadores.
- Não haverá suporte à tradução do sistema (bilíngue); a interface será inteiramente em Português (mantendo as siglas originais dos golpes).
- A inserção e correção de golpes durante a criação ocorrerá sempre no final da fila (não é possível inserir ou deletar botões no meio da linha, apenas através de desfazer do fim para o começo).

## 15. Pontos Pendentes Antes do FSD

- **Ativos Visuais (Imagens):** O usuário mencionou que possui uma imagem de referência para o visual dos principais botões. É necessário confirmar como esses ativos visuais serão disponibilizados para a equipe de desenvolvimento (ou se deverão ser recriados integralmente via código com base na referência) antes do início técnico, para que sejam mapeados corretamente no design do FSD.
- Fora esse ponto sobre design, o escopo comportamental funcional está fechado.

## 16. Resumo Final do PRD

O **GGST Combo Maker** é uma ferramenta web de uso pessoal e armazenamento local para jogadores do game de luta *Guilty Gear -Strive-*. O sistema permitirá criar combos visualmente através de uma paleta de botões iterativa (incluindo os golpes, modificadores e o botão vermelho de RC), agrupá-los em pastas por personagens (ou pastas livres) via drag-and-drop, e traduzir esses combos visuais para a notação textual "Numpad" com um clique. Ficam de fora desta primeira versão a sincronização na nuvem, o uso otimizado para celulares e ferramentas avançadas de edição ou cálculo de dano. O projeto encontra-se com as regras de negócio e fluxos comportamentais bem definidos, pronto para avançar para a fase de Especificação Funcional e Técnica (FSD).