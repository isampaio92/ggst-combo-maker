# DECISÕES TÉCNICAS DO PROJETO

## 1. Documentos recebidos

- O arquivo `PRD.md` foi recebido, analisado e utilizado como base funcional.
- O arquivo `DESIGN.md` foi recebido e analisado para as diretrizes visuais e estruturais da interface, garantindo que o FSD aplique os conceitos sem necessidade de uploads de ativos.

## 2. Identificação do sistema

- **Nome do sistema:** GGST Combo Maker (provisório)
- **Objetivo principal:** Fornecer uma ferramenta web intuitiva e visual para montar, salvar e organizar combos de *Guilty Gear -Strive-*.
- **Público usuário:** Jogadores do game, com foco em iniciantes e intermediários.
- **Contexto de uso:** Uso individual e local (desktop focado), rodando diretamente no navegador web.
- **Resumo funcional:** O sistema permite criar combos através de uma paleta visual de botões emulando os controles do jogo, agrupá-los em pastas criadas automaticamente ou manualmente via drag-and-drop, e exportar as sequências em formato texto (Numpad) com um clique.

## 3. Decisões técnicas confirmadas

- **Stack:** TypeScript, React, HTML, CSS.
- **Ambientes:** 
  - Local: Node.js com Vite.
  - Testes: Sem ambiente dedicado na nuvem (testes locais antes do deploy).
  - Produção: GitHub Pages.
- **Arquitetura:** Frontend em React organizado de forma inspirada no padrão MVC.
- **Armazenamento:** Local Storage nativo do navegador (sem banco de dados em nuvem, dispensando servidor e infraestrutura).
- **Entregas (FSD):** Orientação para que a implementação da IA seja dividida em etapas pequenas, progressivas e testáveis.
- **Fora de escopo técnico:** Autenticação, banco de dados em nuvem, controle de perfis de usuário, soft delete (a exclusão é permanente) e integrações externas foram descartados para esta primeira versão.

## 4. Decisões adotadas por padrão

- **Padrão de entrega para a IA codificadora:** Adoção do padrão sugerido. O FSD orientará a divisão em etapas progressivas e testáveis, começando pela estrutura de dados local, passando pelos componentes de interface em React e finalizando com a integração.

## 5. Stack e ambientes

- **Linguagem:** TypeScript
- **Banco de dados:** Nenhum (uso exclusivo de Local Storage)
- **Tecnologias de interface:** React, HTML, CSS
- **Bibliotecas ou frameworks:** Vite (para *build* e *bundling* de desenvolvimento local)
- **Ambiente local:** Node.js com Vite
- **Ambiente de testes ou homologação:** Não haverá ambiente obrigatório; testes apenas locais na máquina do desenvolvedor.
- **Ambiente de produção:** GitHub Pages
- **Observações sobre deploy:** O FSD deverá prever a necessidade de scripts básicos no `package.json` para facilitar a construção (*build*) e o deploy estático para o GitHub Pages. O fluxo de deploy em si será tratado em etapa própria.

## 6. Arquitetura obrigatória

O sistema deverá seguir organização baseada em MVC. 

Como o sistema é um *Single Page Application* (SPA) estático feito em React e TypeScript, a inspiração MVC deve se traduzir na separação clara entre:
- Onde os dados são salvos e estruturados (integração com Local Storage correspondendo ao *Model*).
- Onde a interface e os componentes React são renderizados (correspondendo à *View*).
- Onde a lógica, o gerenciamento de estados, as validações e as regras de negócio acontecem, como nos Hooks customizados e funções tratadoras de eventos (correspondendo ao *Controller*).

## 7. Recursos estruturais definidos

- **Autenticação:** Não haverá (sistema 100% local e individual).
- **RBAC:** Não haverá.
- **Auditoria:** Não aplicável (sem multiusuário).
- **Soft delete:** Não haverá (exclusão direta e permanente de pastas e combos após confirmação do usuário).
- **Log de erros:** Não haverá servidor para registro em arquivo ou banco. O FSD deverá focar no tratamento amigável de erros no frontend (ex: limite de quota do Local Storage).
- **Log de segurança:** Não aplicável.
- **Configurações globais:** Restrito apenas à preferência visual do usuário (Setas ou Numpad), que também será salva no Local Storage.
- **Uploads e anexos:** Não aplicável (design construído via CSS conforme `DESIGN.md`).
- **Exportações:** Apenas visualização em tela e cópia textual para a área de transferência nativa do sistema operacional (texto simples no padrão Numpad).
- **APIs:** Não haverá.
- **Integrações externas:** Não haverá.

## 8. Perfis e permissões em nível alto

- **Jogador (Usuário Único):** Tem acesso total ao sistema local, podendo visualizar, cadastrar, editar, mover e excluir pastas e combos livremente, além de gerenciar suas configurações de exibição visual. 

## 9. Entidades prováveis em nível alto

O FSD deverá considerar a modelagem em TypeScript (interfaces/tipos) baseada nas seguintes entidades que serão guardadas em formato JSON no Local Storage:

- **Configurações** (preferência visual: setas ou numpad).
- **Pasta** (nome, atributos de identificação para organização).
- **Combo** (nome, personagem associado, pasta pertencente, lista sequencial de botões preenchidos, data da última atualização para fins de ordenação).

## 10. Módulos, telas e fluxos esperados em nível alto

O FSD deverá detalhar:

- **Módulo Principal de Interface:** Layout único inspirado no `DESIGN.md`, contemplando todas as interações sem troca de rotas complexas.
- **Módulo de Organização (Sidebar):** Listagem de pastas e combos, ordenação, e manipulação de eventos de *drag-and-drop*.
- **Módulo de Criação e Edição de Combos:** Janela inicial (*modal/popup*) de configuração (nome e personagem), paleta de botões inspirados nos *inputs* do jogo, funcionalidade de "Desfazer" para remover o último golpe e área de renderização sequencial.
- **Módulo de Compartilhamento:** Tratamento de dados para conversão da sequência visual para o texto numpad e injeção na área de transferência.

## 11. Alertas para relatórios, consultas, exportações e desempenho

- **Consultas/Listagens:** A lista principal deve garantir ordenação de pastas em ordem alfabética e de combos por data (do mais recente ao mais antigo).
- **Exportações confirmadas:** A ação "Copiar como Texto" deve obrigatoriamente converter a visualização atual do combo para o formato "Numpad", independentemente do modo visual que o usuário estiver usando na tela.
- **Alertas de desempenho:** Embora o uso seja leve e local, o FSD deve prever implementação de rolagem horizontal fluida (CSS/estrutural) na área de visualização do combo, já que não há limites teóricos de quantidade de golpes. O sistema também deve estar protegido contra o estouro de limite de tamanho do *Local Storage*.

## 12. Alertas para uploads, anexos e arquivos

O recurso não faz parte da primeira versão. A estética visual dos ícones do jogo será tratada nativamente no código da interface utilizando propriedades de CSS, conforme as especificações registradas no `DESIGN.md`.

## 13. Alertas para logs, auditoria e segurança

- Como o projeto armazena tudo localmente em JSON e renderiza na interface sem banco de dados, o principal cuidado de segurança que o FSD deverá detalhar é a sanitização de entradas.
- O sistema deve prevenir injeções de script (XSS) no nome das pastas e no nome dos combos criados pelo usuário antes de renderizá-los no DOM via React.

## 14. Itens que não devem ser inventados

Não devem ser incluídos no FSD sob nenhuma circunstância, pois não foram confirmados ou já foram explicitamente descartados:
- Integrações, Firebase ou bancos em nuvem.
- Tela de Login ou sistema de contas.
- Relatórios avançados, dashboards estatísticos ou cálculos de dano matemáticos de jogo.
- Aplicativo mobile nativo ou layouts que priorizem celular acima de computadores.
- Lixeira para recuperação de combos/pastas apagados.
- Botões para inserção de golpes no "meio" da linha de combo.
- Upload manual de imagens pelo usuário.

## 15. Pendências não bloqueantes

Não foram identificadas pendências não bloqueantes para a criação do FSD.

## 16. Pronto para o FSD

As decisões técnicas estão prontas e consolidadas para a criação do FSD. 

O próximo passo será gerar:
`docs/FSD.md`

O FSD deverá ser criado com base nos seguintes documentos:
- `PRD.md`
- `DECISOES_TECNICAS.md`
- `DESIGN.md`