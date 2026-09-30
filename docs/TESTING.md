# Estratégia de Testes

## Stack de testes

| Camada | Ferramenta | Uso |
|--------|-----------|-----|
| Unitário | Jest | Funções, hooks, schemas, services, regras de negócio |
| Componente | React Testing Library | Renderização, interações, estados de UI |
| E2E | Playwright | Fluxos críticos completos em múltiplos browsers |
| Regressão visual | Playwright (`toHaveScreenshot`) | Quebras acidentais de layout entre mudanças |
| Acessibilidade | `@axe-core/playwright` | Validação automatizada WCAG 2.2 AA em rotas-chave |

## Por que Playwright (e não Cypress)

- Suporte nativo a **Chromium, Firefox e WebKit (Safari)** — um único teste cobre os três.
- Execução **paralela** por padrão: suite completa em fração do tempo.
- **TypeScript first** com autocompletion nativo.
- Aguarda seletores e respostas de rede de forma inteligente — sem `wait()` arbitrários.
- Mantido pela Microsoft com atualizações alinhadas aos browsers modernos.

## Testes unitários com Jest

Usar para:
- Funções utilitárias
- Custom hooks
- Schemas Zod
- Services (com mock de dependências externas)
- Regras de negócio isoladas

## Testes de componente com React Testing Library

Usar para:
- Componentes reutilizáveis
- Formulários (validação, submissão, erros)
- Estados de loading, empty, error e success
- Interações do usuário (click, input, submit)

## Testes E2E com Playwright

Usar para fluxos críticos de ponta a ponta:
- Login / Cadastro / Logout
- Dashboard
- CRUD principal
- Fluxos de pagamento (se existir)
- Redirecionamentos e permissões (rotas protegidas)

## Testes de estados obrigatórios de UI

Todo componente que faz requisição assíncrona DEVE ter testes cobrindo os 4 estados:

1. **Loading** — Skeleton UI (proibido spinner genérico sem estrutura).
2. **Empty** — mensagem clara com ação/sugestão acionável.
3. **Error** — mensagem específica com opção de tentar novamente.
4. **Success** — dados renderizados corretamente com feedback quando aplicável.

## Regressão visual com Playwright

Captura e compara imagens das rotas principais para pegar quebras de layout:

- `await expect(page).toHaveScreenshot()` nas rotas críticas.
- Breakpoints obrigatórios: **1920×1080** (desktop) e **390×844** (mobile).
- Contra flakiness: desativar animações na captura com `animations: 'disabled'`.

## Auditoria automática de acessibilidade (WCAG 2.2 AA)

Rodar `@axe-core/playwright` nas rotas-chave:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('rota principal sem violações WCAG 2.2 AA', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

Checklist obrigatório:

- Contraste mínimo de **4.5:1** para texto de corpo (ver `docs/DESIGN.md`).
- Todo interativo com `:focus-visible` claro e navegável por teclado.
- Ícones/botões sem texto com `aria-label` descritivo.

## Regras obrigatórias

- Toda feature nova deve ter ao menos 1 teste unitário e 1 teste de componente.
- Todo bug corrigido deve ter teste cobrindo o caso exato.
- Não criar testes frágeis que dependem de seletores instáveis — preferir `role`, `label` e `text`.
- Priorizar comportamento do usuário, nunca detalhes internos de implementação.
- Rodar testes antes de finalizar qualquer tarefa.

## Scripts esperados

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:a11y": "playwright test tests/a11y.spec.ts",
    "test:visual": "playwright test --update-snapshots",
    "test:ci": "jest --ci && playwright test",
    "lint": "next lint",
    "build": "next build"
  }
}
```

## Setup inicial do Playwright

```bash
npm init playwright@latest
```

Configura automaticamente `playwright.config.ts`, pasta `/tests` e workflow para CI.
