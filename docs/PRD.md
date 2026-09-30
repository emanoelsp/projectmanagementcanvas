# PRD - Product Requirements Document

## Tipo de projeto

Sistema Web

## Objetivo

Desenvolver uma plataforma educacional de planejamento estratégico onde alunos criam conta, formam equipes e preenchem um **canvas interativo de 8 passos** com desbloqueio progressivo gamificado. Instrutores visualizam todos os projetos das equipes.

## Público-alvo

- **Primário**: Alunos do ensino superior em cursos de empreendedorismo e inovação
- **Secundário**: Instrutores/coordenadores que supervisionam os projetos

## Problema que resolve

Metodologia estruturada de planejamento (PMC - Project Management Canvas) requer ferramental visual e interativo que motive o preenchimento sequencial de frameworks (Escopo → Paradigma → Mercado → TAM/SAM/SOM → Formatos → BMC → Stack → Protótipo).

## Funcionalidades principais

- [x] Autenticação Firebase (email/senha)
- [x] Registro em 2 etapas (credenciais + equipe)
- [x] Dashboard com info da equipe
- [x] Canvas interativo (React Flow) com 8 nós
- [x] Desbloqueio progressivo de nós (gamificado)
- [x] Sincronização com Firestore
- [ ] Painel de instrutor (lista de equipes + canvas read-only)
- [ ] Toolbar de anotações (molduras, linhas, formas)
- [ ] Testes E2E (Playwright)
- [ ] Deploy Vercel

## Requisitos funcionais

- RF001: Usuário deve conseguir criar conta com email/senha e dados de equipe
- RF002: Ao preencher um nó, o próximo deve desbloquear com animação
- RF003: Equipes podem ter múltiplos membros (cada um com login próprio)
- RF004: Instrutor deve ver progresso de todas as equipes
- RF005: Dados devem persistir em Firestore (debounce de 800ms)

## Requisitos não funcionais

- Performance: canvas fluido com 8 nós em laptop/mobile
- Segurança: autenticação via Firebase, sem armazenamento de secrets no frontend
- UI: responsiva (mobile-first, thumb zone respeitada)
- Acessibilidade: WCAG 2.2 AA (contraste ≥4.5:1, focus-visible)
- Testes: E2E (registro → preenchimento de steps), unit (Zustand logic)
- Deploy: Vercel com CI/CD

## Critérios de aceite

- Usuário consegue registrar, fazer login e abrir canvas
- Preenchimento de step1 desbloqueia step2 com animação visível
- Step2 ramificação (A/B) mostra nós filhos condicionais
- Todos os 8 steps são preenchíveis (UX completa)
- Dashboard mostra progresso em barras/percentual
- `npm run build` passa sem erros
- Funciona em desktop (1920px) e mobile (390px)
