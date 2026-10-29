# Inventário de insumos do projeto

Abaixo está o levantamento completo de todos os arquivos presentes na pasta `docs/`, sua finalidade e se devem ou não ser copiados futuramente para a pasta pública/assets da aplicação em tempo de execução.

| Arquivo | O que é | Usado pelo sistema em execução? | Onde será usado | Observações |
|---|---|---|---|---|
| `docs/FSD.md` | Documento de Especificação Funcional e Técnica principal do projeto. | Não | Documentação | Define stack, arquitetura MVC em React, modelo de dados em Local Storage, migrations, fluxos e regras de negócio. |
| `docs/DESIGN.md` | Guia de estilos e Design System (paleta de cores, tipografia, bordas e botões). | Não | Documentação / Referência visual | Orienta a estilização em CSS da interface e dos botões do jogo. |
| `docs/PRD.md` | Documento de Requisitos do Produto (visão geral, personas, escopo e histórias de usuário). | Não | Documentação | Serviu de base funcional para a elaboração do FSD. |
| `docs/DECISOES_TECNICAS.md` | Registro consolidado das decisões arquiteturais e técnicas do projeto. | Não | Documentação | Serviu de insumo técnico para a elaboração do FSD. |
| `docs/ggst_inputs.png` | Imagem (sprite sheet / referência visual) com os botões de ataque (P, K, S, HS, D), direcionais, comandos de meia-lua/Z, RC e ícone de Dash do *Guilty Gear -Strive-*. | Não | Referência visual | Confirmado como referência visual de documentação. Os botões e o ícone de boneco correndo do Dash serão reproduzidos via CSS/SVG no código conforme `docs/DESIGN.md` e `docs/FSD.md`, sem necessidade de copiar o arquivo PNG para `src/assets/`. |
| `docs/INSUMOS.md` | Este documento de inventário dos arquivos de documentação e apoio. | Não | Documentação | Mapeamento dos insumos do projeto. |
