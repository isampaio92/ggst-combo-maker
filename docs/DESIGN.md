---
title: "Design System: GGST Interface"
version: "1.0.0"
theme: "Dark, High-Contrast, Fighting Game"
description: "Guia de estilos e componentes inspirado na interface de Guilty Gear -Strive- e nos inputs do jogo."
---

# Design System: GGST Interface

Este documento define as diretrizes visuais e estruturais para a criação de interfaces baseadas na estética de *Guilty Gear -Strive-*, combinando o design moderno e agressivo do site oficial com a clareza e skeuomorfismo dos botões de input do jogo (conforme a imagem `ggst_inputs.png`).

## 1. Identidade Visual Geral
A identidade visual é caracterizada por um estilo "Rock/Metal Moderno". É primariamente **Dark Mode**, com contrastes extremos, uso de ângulos duros (diagonais) na estrutura, e cores vibrantes e neons para destacar ações e elementos de jogo. A interface deve transmitir energia, impacto e precisão.

## 2. Paleta de Cores

### Cores de Fundo e Texto (Interface)
*   **Background Principal:** `#121212` (Quase preto, fundo geral)
*   **Background Secundário:** `#1E1E1E` (Cinza muito escuro, para cards e modais)
*   **Texto Principal:** `#F5F5F5` (Branco off-white, para leitura confortável)
*   **Texto Secundário:** `#A0A0A0` (Cinza claro, para descrições)
*   **Cor de Destaque (Brand Red):** `#E31818` (Vermelho vibrante GGST, usado em detalhes, bordas e chamadas de ação primárias)

### Cores de Inputs do Jogo (Baseado em `ggst_inputs.png` e regras do FSD)
*   **Fundo do Botão (Base):** `#2A2A2A` a `#333333` (Cinza escuro com leve gradiente para efeito 3D)
*   **Punch (P):** `#FF77CC` (Rosa/Magenta)
*   **Kick (K):** `#33CCFF` (Azul Claro/Ciano)
*   **Slash (c.S / f.S):** `#00E676` (Verde Menta/Neon — usado para ambos os botões circulares `c.S` e `f.S`)
*   **Heavy Slash (HS):** `#FF3333` (Vermelho Claro)
*   **Dust (D):** `#FF9900` (Laranja)
*   **Red Roman Cancel (RC):** Texto `"RC"` e borda/destaque em vermelho (`#E31818` / `#FF3333`) sobre o botão circular escuro
*   **Dash:** Botão circular escuro com ícone vetorial (SVG) de boneco correndo e aro interno em branco (`#F5F5F5`), conforme referência visual de `ggst_inputs.png`
*   **Setas Direcionais e Motions:** Gradiente de Laranja (`#FF6600`) para Amarelo (`#FFCC00`)
*   **Modificadores de Ligação (`+`, `>`, `~`) e `j.`:** Conectores visuais destacados em branco/cinza claro (`#F5F5F5`)
*   **Counter Hit (`CH`):** Badge/botão com destaque em vermelho/laranja de alerta (`#E31818` / `#FF9900`) e texto `"CH"`

## 3. Tipografia Sugerida
*   **Títulos e Destaques (Headings):** `Teko`, `Oswald` ou `Impact` (Fontes "condensed", sem serifa, peso Bold/Black). Devem ser preferencialmente usadas em **CAIXA ALTA** para emular a agressividade do jogo.
*   **Texto Base (Body):** `Inter` ou `Roboto` (Sem serifa, limpas e legíveis, pesos Regular e Medium).
*   **Inputs (Letras dentro dos botões):** Fonte sem serifa clara e arredondada (ex: `Arial Rounded MT Bold` ou similar), peso fino a médio, para replicar a imagem.

## 4. Espaçamentos
Utilizar um sistema de grid de 8px para consistência.
*   **Micro (xs):** 4px (espaço entre ícone e texto)
*   **Pequeno (sm):** 8px (espaço entre botões adjacentes)
*   **Médio (md):** 16px (padding padrão de inputs e botões)
*   **Grande (lg):** 24px (margem entre componentes)
*   **Extra Grande (xl):** 32px ou 48px (separação de seções)

## 5. Arredondamento de Bordas (Border-Radius)
O design intercala cantos extremamente afiados com círculos perfeitos:
*   **Interface Geral (Cards, Menus, Modais):** `0px` (Bordas retas e afiadas). Opcionalmente, pode-se usar um corte chanfrado em um dos cantos usando `clip-path` para um visual cibernético/edgy.
*   **Botões de Sistema (Primários):** `0px`.
*   **Botões de Inputs do Jogo (P, K, S, etc.):** `50%` (Completamente circulares).

## 6. Estilo de Botões

### A. Botões do Sistema (Navegação/Ação de UI)
*   **Primário:** Fundo transparente, texto branco grosso em caixa alta, borda sólida de 2px a 4px na cor `#E31818`.
    *   *Hover:* O fundo preenche de `#E31818`, e o texto continua branco (ou muda para preto para maior contraste).
*   **Secundário:** Fundo `#1E1E1E`, texto `#F5F5F5`, sem borda ou com borda sutil `#333333`.
    *   *Hover:* Fundo `#333333`.

### B. Botões de Input (Igual à imagem `ggst_inputs.png`)
*   **Formato:** Círculo perfeito (`border-radius: 50%; aspect-ratio: 1/1`).
*   **Background:** Gradiente radial sutil simulando volume (ex: `radial-gradient(circle, #444 0%, #222 100%)`).
*   **Borda (Shadow/Bevel):** Box-shadow múltiplo para criar efeito 3D (sombra externa escura, sombra interna clara sutil). Exemplo: `box-shadow: inset 0 2px 4px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.5)`.
*   **Texto:** Cores vibrantes definidas na paleta, levemente contornadas ou com sutil `text-shadow` escuro para saltar do fundo cinza.

## 7. Estilo de Formulários
*   **Inputs de Texto:** Aparência minimalista.
*   **Background:** Transparente ou `#1A1A1A`.
*   **Bordas:** Sem bordas laterais ou superiores; apenas uma borda inferior (bottom border) espessa (2px) na cor `#555555`.
*   **Focus:** A borda inferior muda para a cor de destaque (`#E31818`) e ganha brilho sutil.
*   **Labels:** Em caixa alta, fonte condensada, cor `#A0A0A0`, posicionadas acima do campo.

## 8. Estilo de Componentes Principais
*   **Cards:** Retangulares, fundo `#1E1E1E`, bordas `0px`. Podem possuir uma linha de destaque superior (top border) de 4px na cor `#E31818`. Sombra seca (`box-shadow: 4px 4px 0px rgba(0,0,0,0.8)`).
*   **Menus (Navegação):** Abas (tabs) ou links devem utilizar a tipografia de destaque. Um link ativo recebe um sublinhado espesso ou uma barra vertical vermelha (`#E31818`) ao lado.
*   **Tabelas:** Design "Zebrado" com muito contraste. Cabeçalho (thead) com fundo `#E31818` e texto branco. Linhas alternando entre `#121212` e `#1E1E1E`. Bordas mínimas (apenas horizontais).

## 9. Estados Visuais
*   **Sucesso (Success):** `#00E676` (Mesmo verde do botão Slash). Usado para confirmações.
*   **Erro (Error):** `#FF3333` (Vermelho brilhante, para não confundir com o `#E31818` da marca que é mais fechado/sólido). Mensagens de erro devem ser incisivas.
*   **Alerta (Warning):** `#FF9900` (Laranja do botão Dust).
*   **Vazio (Empty State):** Ícones em tons de cinza (`#333333`), texto `#A0A0A0`. Sem contornos.
*   **Carregamento (Loading):** Elementos visuais como uma barra de progresso grossa e angular em `#E31818`, ou um ícone giratório estilizado como uma engrenagem (Gear).

## 10. Regras de Aplicação e Consistência
1.  **Regra do Contraste Máximo:** Nunca sobreponha cinza médio com cinza médio. Use preto absoluto ou quase preto contra branco ou as cores neon dos inputs.
2.  **Uso Semântico das Cores dos Inputs:** As cores dos inputs (Rosa para P, Azul para K, etc.) **NÃO DEVEM** ser usadas para estilizar elementos comuns da interface (como links de menu ou botões de salvar). Elas são exclusivas para representar os botões do jogo.
3.  **Agressividade Angular:** Sempre que possível, utilize linhas diagonais, barras (`/`) como separadores de pão de migalhas (breadcrumbs) e fundos recortados.
4.  **Caixa Alta para Impacto:** Títulos de seções, nomes de personagens e rótulos importantes devem estar sempre em `UPPERCASE` com a fonte condensada (ex: `Teko`). Textos longos de explicação devem estar em `Sentence case` com a fonte de corpo (ex: `Inter`).