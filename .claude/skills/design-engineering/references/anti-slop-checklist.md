# Checklist anti-AI-slop

Rode antes de entregar qualquer UI. Qualquer item marcado = corrigir antes de concluir.
Regras completas e justificativas em `docs/DESIGN.md`.

## Proibições absolutas (rejeitar)

- [ ] **Gradient text** (`background-clip: text` + gradiente) → cor sólida com peso.
- [ ] **Bordas laterais coloridas** (`border-l`/`border-r` acentuados em cards/alertas)
      → borda completa sutil de 1px, fundo tintado ou ícone/número.
- [ ] **Glassmorphism decorativo** (`backdrop-blur` sem sobreposição real).
- [ ] **Hero-metric** (número gigante + legenda minúscula + gradiente).
- [ ] **Grid de cards idênticos** (Ícone + Título + Texto curto repetido) → variar ritmo.
- [ ] **Kicker/eyebrow uppercase** antes de todo título (`uppercase tracking-wider`).
- [ ] **Fundo bege/creme/areia** como superfície principal sem pedido de marca.
- [ ] **Over-rounding**: card acima de `rounded-2xl` (16px).

## Cor & contraste

- [ ] Tokens em OKLCH (não hex/hsl solto).
- [ ] Texto de corpo/botão ≥ 4.5:1; placeholder ≥ 4.5:1 (sem cinza apagado default).
- [ ] Neutros tinteados (0.005–0.015 de chroma no hue da marca), não cinza puro morto.

## Tipografia

- [ ] Corpo limitado a 65–75 caracteres (`max-w-prose` / `max-w-[65ch]`).
- [ ] Título display com `tracking-[-0.04em]` e `text-wrap: balance`.
- [ ] Blocos longos com `text-wrap: pretty`; números com `tabular-nums`.
- [ ] Hero `clamp()` não passa de ~6rem.

## Motion

- [ ] Anima só `transform`/`opacity` (nunca width/height/margin/padding/top/left).
- [ ] Entrada em `scale(0.95)` + `opacity: 0` (nunca `scale(0)`).
- [ ] Duração < 300ms; ações 100+/dia sem animação.
- [ ] Sem `ease-in` na entrada; usa os tokens de `motion-tokens.css`.
- [ ] `@media (prefers-reduced-motion: reduce)` presente.
- [ ] Hover animado protegido por `@media (hover: hover) and (pointer: fine)`.

## Estados & acessibilidade

- [ ] `loading` (skeleton, não spinner), `empty`, `error`, `success`.
- [ ] `:focus-visible` claro em todo interativo; navegável por teclado.
- [ ] `aria-label`/`alt` em ícones e imagens interativas.
- [ ] Touch targets ≥ 44×44pt (iOS) / 48×48dp (Android); CTAs na thumb zone.
