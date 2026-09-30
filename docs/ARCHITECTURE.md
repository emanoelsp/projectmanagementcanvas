# Arquitetura

## Stack principal

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Firebase Auth
- Firestore
- Firebase Storage (se necessário)
- Vercel

## Bibliotecas recomendadas

- Zod para validação
- React Hook Form para formulários
- TanStack Query para cache e estado assíncrono
- Zustand para estado global simples
- `@axe-core/playwright` para auditoria de acessibilidade (ver `docs/TESTING.md`)
- Sentry para monitoramento de erros
- PostHog para analytics
- Resend para e-mails
- Stripe para pagamentos (se necessário)
- Toastify para retorno de ações básicas
- SweetAlert2 para ações complexas que precisam de confirmação

## Estrutura sugerida

```txt
/src
  /app
  /components
    /ui
    /shared
    /features
  /features
  /lib
  /hooks
  /schemas
  /services
  /types
  /stores
  /tests
  /ai          → opcional: agentes de IA (ver docs/AI_AGENT.md)
  /extraction  → opcional: pipeline OCR/extração (ver docs/DOCUMENT_EXTRACTION.md)
/firebase
/playwright    → testes E2E, regressão visual e acessibilidade
/docs
```

## Regras técnicas

- Preferir Server Components quando possível.
- Usar Client Components apenas quando necessário.
- Separar lógica de UI.
- Validar dados com Zod.
- Nunca acessar Firestore diretamente em componentes complexos.
- Centralizar configuração Firebase em `/src/lib/firebase`.
- Criar services para operações de banco.

## Design tokens

- Definir cores em **OKLCH** e as curvas/durações de animação como variáveis CSS
  semânticas (ex.: `--ease-out`, `--ease-drawer`). Regras completas em `docs/DESIGN.md`.
- Centralizar os tokens em um único ponto (ex.: `globals.css` / config do Tailwind)
  para manter consistência de tema e motion em todo o projeto.
