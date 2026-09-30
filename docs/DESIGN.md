# Design System, Anti-Slop & Motion Engineering

Este documento define o padrão de qualidade visual do projeto. O objetivo é
produzir interfaces com personalidade e acabamento de produção — não o resultado
genérico e amador típico de geração automática de código ("AI slop").

## Estilo visual

- Interface limpa, estruturada, responsiva e intencional.
- Boa hierarquia visual e espaçamento consistente.
- Nada de elemento decorativo vazio: cada peça de UI justifica sua existência.

## UI stack

- Tailwind CSS com variáveis CSS semânticas (tokens de tema).
- shadcn/ui como fundação obrigatória — nunca reinventar componente existente.
- lucide-react para ícones.

## Regras de UI

- Usar shadcn/ui como base. Não criar componentes do zero se existir equivalente.
- Componentes devem ser acessíveis.
- Layout mobile-first.
- Usar cards, tabs, dialogs e forms de forma consistente.

## Estados obrigatórios

Todo componente que faz requisição deve ter:

| Estado | Implementação |
|--------|---------------|
| `loading` | Skeleton UI — nunca spinner genérico |
| `empty` | Mensagem clara com ação sugerida |
| `error` | Mensagem específica e acionável |
| `success` | Feedback positivo visível |

---

## Cor & temas (OKLCH)

- **Definir tokens de cor em OKLCH.** O espaço OKLCH torna claridade e contraste
  previsíveis, evitando saltos de percepção entre tons. Ex.:
  `--primary: oklch(0.62 0.19 255);`
- **Neutros tinteados**: some `0.005`–`0.015` de *chroma* na direção do *hue* da
  marca em vez de cinzas puros mortos. Evita a sensação de "template".
- **Travas de contraste (WCAG AA):**
  - Texto de corpo e botões: mínimo **4.5:1** contra o fundo.
  - Texto grande (≥18px, ou ≥14px negrito): mínimo **3.0:1**.
  - Placeholder de input: mínimo **4.5:1** — proibido cinza claro apagado por padrão.

### Regra anti-bege ("cream / sand / beige")

Fundos quentes desbotados (OKLCH L 0.84–0.97, C < 0.06, hue 40–100) viraram o
padrão default de geradores. **Não use** como superfície principal a menos que a
marca peça explicitamente. Prefira off-white neutro puro, um fundo escuro
intencional ou uma cor sólida da marca.

---

## Proibições absolutas (Anti-AI-Slop)

Não gere nem aceite nenhuma destas soluções:

1. **Bordas laterais coloridas** (`border-left`/`border-right` acentuados em cards,
   callouts ou alertas). Use borda completa sutil de 1px, fundo levemente tintado
   ou ícone/número como indicador.
2. **Texto com gradiente** (`background-clip: text` + gradiente). Use cor sólida com
   hierarquia clara de peso (`font-semibold`, `font-bold`).
3. **Glassmorphism decorativo** (`backdrop-blur` sem função real de sobreposição).
4. **Template "hero-metric"**: número gigante + legenda minúscula + gradiente.
5. **Grid de cards idênticos** (Ícone + Título + Texto curto repetido). Varie o ritmo.
6. **Kicker/eyebrow em caixa alta antes de todo título** (`uppercase tracking-wider`
   tipo "PROCESS", "ABOUT" acima de cada seção).
7. **Arredondamento excessivo**: cards e seções no máximo `rounded-xl`/`rounded-2xl`
   (12–16px). `24px+` em card é padrão descalibrado.

---

## Tipografia & hierarquia

- **Comprimento de linha**: corpo e parágrafos no máximo **65–75 caracteres**
  (`max-w-prose` ou `max-w-[65ch]`).
- **Tracking de títulos display** (H1/hero): nunca acima de `-0.04em`
  (`tracking-[-0.04em]`) para as letras não se sobreporem.
- **Teto do hero**: escala `clamp()` não passa de `~6rem` (96px).
- **Equilíbrio de linhas**: `text-wrap: balance` em H1–H3; `text-wrap: pretty` em
  blocos de texto para eliminar órfãos.
- **Números**: `tabular-nums` em colunas numéricas e tabelas financeiras.
- Fonte mínima de **14px** em mobile.

---

## Motion Engineering

Animação existe para explicar mudança de estado, não para decorar. Regras:

### Filtro de frequência (gating)

- **Ações muito frequentes** (100+/dia — atalhos de teclado, command bar, toggles):
  **sem animação de entrada/saída**. Mudança de estado instantânea.
- **Ações intermediárias** (hover em botão, navegação de lista): micro-interação de
  no máximo **100–150ms**.
- **Modais, drawers, toasts**: **150–250ms**. Nenhuma animação de UI passa de **300ms**.

### Performance (GPU)

- Animar **apenas** `transform` e `opacity`.
- Proibido animar `width`, `height`, `margin`, `padding`, `top`, `left`
  (causam layout thrashing).
- Nunca iniciar entrada com `scale(0)`. Comece em `scale(0.95)` + `opacity: 0`.
- Em Framer Motion, use a string completa (`transform: "translateX(100px)"`) para
  garantir aceleração por hardware.

### Curvas de easing

- Nunca use `ease-in` em elemento que está **entrando** na tela.
- Padrões:
  - Entrada/saída: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`
  - Movimento na tela: `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`
  - Drawer: `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`

### Acessibilidade & gestos

- Toda animação inclui a variante `@media (prefers-reduced-motion: reduce)`
  (mantém apenas opacidade/crossfade simples).
- Hover com animação protegido por `@media (hover: hover) and (pointer: fine)`
  para não disparar em telas de toque.

---

## Mobile UX (obrigatório para qualquer tela mobile)

### Thumb Zone

- CTAs e ações primárias ficam nos **dois terços inferiores** da tela.
- Cantos superiores: navegação secundária, cabeçalhos ou ações destrutivas/raras.

### Touch Targets

- Mínimo de **44×44pt (iOS)** / **48×48dp (Android)** para qualquer elemento clicável.
- Espaçamento mínimo entre botões adjacentes para evitar toques acidentais.

### Interações

- Usar **toast com "Desfazer"** para ações não destrutivas — não interromper o fluxo
  com dialogs de confirmação.
- Nunca empilhar modais. Apenas um contexto modal por vez.

### Formulários

- `type="tel"` para telefone, `type="email"` para e-mail, `inputMode="numeric"` para
  valores monetários/numéricos.
- Validação no evento `blur` ou no submit — nunca a cada tecla.
- Mensagens de erro específicas: diga exatamente o que o usuário deve corrigir.

---

## Acessibilidade (WCAG 2.2 mínimos)

- Contraste mínimo de **4.5:1** para textos normais (ver travas OKLCH acima).
- Fonte mínima de **14px** em mobile.
- Estados `:focus-visible` claros e legíveis em todo elemento interativo.
- `aria-label` ou `alt` em todos os ícones e imagens interativas.
- Suporte a redimensionamento de fonte do sistema operacional.
