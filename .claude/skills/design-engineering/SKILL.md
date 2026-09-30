---
name: design-engineering
description: Produz interfaces com acabamento de produção e elimina clichês de IA ("AI slop"). Use ao criar ou revisar componentes, páginas ou layouts (React/Tailwind/shadcn) — aplica OKLCH, tipografia rigorosa, motion performático e auditoria anti-slop. Regras completas em docs/DESIGN.md.
---

# Design Engineering

Skill de qualidade visual do template. O objetivo é interface com personalidade e
padrão de produção — não o resultado genérico de geração automática de código.

As regras completas (cor, tipografia, motion, mobile UX, acessibilidade) vivem em
`docs/DESIGN.md`. Este SKILL.md é o **procedimento** de como aplicá-las e auditar.

## Quando usar

- Criar componente, página ou fluxo novo.
- Revisar UI existente contra o design system.
- Auditar uma tela por clichês de AI slop antes de entregar.

## Fluxo (procedimento)

1. **Fundação shadcn/ui.** Nunca reinventar componente que já existe. Ícones: lucide-react.
2. **Cor em OKLCH.** Tokens em OKLCH; contraste mínimo 4.5:1 (corpo). Sem fundo
   bege/creme como superfície principal. Ver `references/motion-tokens.css` para os
   tokens de easing prontos.
3. **Tipografia.** Corpo `max-w-[65ch]`; títulos display `tracking-[-0.04em]` +
   `text-wrap: balance`; corpo `text-wrap: pretty`; `tabular-nums` em números.
4. **Estados de UI.** Todo componente com requisição tem `loading` (skeleton),
   `empty`, `error` e `success`.
5. **Motion.** Só `transform`/`opacity`; entrada em `scale(0.95)`; < 300ms; nunca
   `ease-in` na entrada; `prefers-reduced-motion` sempre. Copiar tokens de
   `references/motion-tokens.css`.
6. **Auto-crítica anti-slop.** Antes de entregar, rode a checklist em
   `references/anti-slop-checklist.md`. A primeira versão nunca é a final.

## Adaptação por projeto

Estas regras são o **padrão** para projetos com a stack do template (shadcn/ui).
Um projeto com design system próprio pode **sobrescrever tokens específicos**
(arredondamento, biblioteca de componentes, paleta, eyebrows de marca) — nesse caso
a skill de design do projeto (ex.: `ui-ux-stylist`) é a fonte de verdade dos tokens.

Mesmo assim, os **princípios universais continuam valendo** e não são negociáveis:

- Contraste ≥ 4.5:1 (corpo).
- Motion performático: só `transform`/`opacity`, < 300ms, entrada em `scale(0.95)`,
  sem `ease-in` na entrada, `prefers-reduced-motion` sempre.
- Tipografia legível: comprimento de linha controlado, `text-wrap`, `tabular-nums`.
- Anti-slop que não conflita com a marca: sem gradient text, sem side-stripe borders,
  sem glassmorphism decorativo, sem hero-metric.

## Recursos (carregar sob demanda)

- `references/anti-slop-checklist.md` — checklist de auditoria (o que proibir).
- `references/motion-tokens.css` — variáveis de easing + bloco prefers-reduced-motion.
