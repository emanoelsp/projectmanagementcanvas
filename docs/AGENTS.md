# Regras do Agente

As regras completas do agente estão centralizadas em `CLAUDE.md` (raiz do projeto) para Claude Code e em `.cursor/rules/project.mdc` para o Cursor.

Ambos os arquivos são a fonte de verdade. Não duplique regras aqui.

## Resumo rápido

- Leia toda a `/docs` antes de agir.
- Explique o plano antes de codar.
- Implemente uma etapa por vez.
- Atualize `TASKS.md` ao concluir cada tarefa.
- Rode `lint` → `test` → `build` antes de finalizar.
- Use TypeScript estrito, shadcn/ui, Tailwind CSS, Firebase Auth e Firestore.
- Deploy padrão: Vercel.

## Ciclo de revisão (Worker-Reviewer)

Primeira versão gerada nunca é a final. Antes de dar uma tarefa por concluída, o
agente roda um passe interno de crítica sobre o próprio resultado:

1. **Crítica de código** — a solução introduziu redundância, duplicação ou estilo
   fora do design system?
2. **Checagem anti-slop** — o código tem gradient text, side-stripe borders,
   glassmorphism decorativo, fundo bege ou componente fora do padrão shadcn/ui?
   (Ver proibições em `docs/DESIGN.md`.)
3. **Refatorar e re-testar** até atingir conformidade estrita.

## Auditoria visual (se Playwright MCP disponível)

Para tarefas com impacto visual, não confie só no código — veja a renderização:

1. Abrir a rota alterada em modo headless via Playwright MCP.
2. Capturar screenshots em **1920px (desktop)** e **390px (mobile)**.
3. Comparar contra as regras de `docs/DESIGN.md` (hierarquia, contraste, alinhamento,
   thumb zone) e corrigir o CSS até a interface ficar limpa.

> Passo condicional: só se aplica quando o servidor Playwright MCP estiver configurado.
> Sem ele, use os testes de regressão visual descritos em `docs/TESTING.md`.

## Skills e recursos disponíveis

| Recurso | Tipo | Uso |
|---------|------|-----|
| `design-engineering` | Skill (`.claude/skills/`) | Qualidade visual, anti-slop, OKLCH, tipografia e motion |
| `document-extraction` | Skill (`.claude/skills/`) | OCR híbrido, resolução de tabelas/referências, introspecção de templates e extração validada por schema |
| `active-learning` | Skill (`.claude/commands/`) | Sessões de aprendizagem ativa (PBL, troubleshooting) |
| `ui-designer` | Subagente (`.claude/agents/`) | Layouts React/Tailwind: Mobile UX, thumb zone, WCAG 2.2, anti-slop e motion |

Invocado automaticamente quando a tarefa se encaixa, ou explicitamente
(ex.: `use ui-designer`).
