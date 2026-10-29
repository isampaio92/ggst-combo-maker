# Registro de Erros e Soluções (`docs/ERROS.md`)

Este documento funciona como uma memória técnica viva do projeto **GGST Combo Maker**. Sempre que um erro técnico, falha de build, problema de tipagem, comportamento inesperado de persistência ou regressão de interface ocorrer durante o desenvolvimento, registre-o abaixo utilizando o modelo padrão para evitar reincidência.

## Modelo de Registro

```text
## <data> - <título curto do erro>

- Sintoma:
- Causa:
- Solução aplicada:
- Como evitar no futuro:
```

---

## Histórico de Registros

## 2026-10-29 - Regra genérica `logs/` no `.gitignore` e ausência de `*.tsbuildinfo`

- **Sintoma:** A regra `logs/` (sem barra inicial) no `.gitignore` inicial poderia ignorar indevidamente o diretório de código-fonte `src/logs/`, e o arquivo de cache incremental `tsconfig.tsbuildinfo` gerado pelo TypeScript (`tsc -b`) aparecia como arquivo não rastreado para commit.
- **Causa:** No Git, um padrão `logs/` sem barra inicial casa com qualquer diretório chamado `logs` em qualquer nível da árvore (incluindo `src/logs/`). Além disso, o flag `-b` do compilador TypeScript gera o arquivo `tsconfig.tsbuildinfo` na raiz.
- **Solução aplicada:** A regra no `.gitignore` foi alterada para `/logs/` (restrita à raiz do projeto), preservando o versionamento de `src/logs/index.ts`, e foram adicionadas as regras `*.tsbuildinfo` e `.vite/` no `.gitignore`.
- **Como evitar no futuro:** Sempre utilizar barra inicial (`/logs/`) no `.gitignore` quando existir uma pasta de código-fonte com o mesmo nome dentro de `src/`, e conferir a lista de arquivos com `git add --dry-run .` antes do commit.

---

## 2026-10-29 - Setas direcionais em texto sem contraste devido a `-webkit-text-fill-color: transparent` + `text-shadow`

- **Sintoma:** Os botões direcionais e *motions* na paleta e na área de sequência apareciam escuros e sem contraste, dificultando a leitura.
- **Causa:** A classe base `.ggst-token` aplicava `text-shadow` escuro intenso (`rgba(0,0,0,0.95)`) enquanto `.ggst-token--directional .ggst-token__text` aplicava `background-clip: text` com `-webkit-text-fill-color: transparent` sobre caracteres Unicode de setas. No CSS, o `text-shadow` é desenhado sobre/atrás do texto transparente e ofusca o gradiente de fundo, além de usar setas tipográficas simples em vez da cruz D-Pad de `docs/ggst_inputs.png`.
- **Solução aplicada:** Foi criado o componente vetorial `DpadDirectionalSvgIcon` em `src/views/GameInputTokenBadge.tsx` que reproduz fielmente a cruz 3D do D-Pad de `docs/ggst_inputs.png` com setas e curvas de comando (*motions*) em SVG usando `linearGradient` real (`#FFEE55` -> `#FFCC00` -> `#FF6600`) e bordas de alto contraste, além de remover `-webkit-text-fill-color: transparent` em `src/assets/styles/combo-editor.css`.
- **Como evitar no futuro:** Nunca combinar `-webkit-text-fill-color: transparent` (`background-clip: text`) com `text-shadow` escuro herdado, e utilizar ícones vetoriais SVG com `<linearGradient>` para reproduzir elementos gráficos de `docs/ggst_inputs.png`.
