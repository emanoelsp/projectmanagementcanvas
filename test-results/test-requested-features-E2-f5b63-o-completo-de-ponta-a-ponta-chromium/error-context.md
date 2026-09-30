# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-requested-features.spec.ts >> E2E Completo: Registro → Canvas → Preenchimento Total >> Fluxo completo de ponta a ponta
- Location: playwright/tests/test-requested-features.spec.ts:26:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - heading "Project Management Canvas" [level=1] [ref=e5]
        - paragraph [ref=e6]: Crie sua conta e começe a planejar
      - generic [ref=e7]:
        - generic [ref=e8]:
          - heading "Dados da Equipe" [level=2] [ref=e9]
          - paragraph [ref=e10]: Passo 2 de 2
        - generic [ref=e12]:
          - generic [ref=e13]:
            - text: Nome da Equipe
            - textbox "Nome da Equipe" [ref=e14]:
              - /placeholder: "Ex: StartUp XYZ"
              - text: Team_E2E_1790800711520
          - generic [ref=e15]:
            - text: Integrantes
            - generic [ref=e17]:
              - textbox "Email do membro" [active] [ref=e18]: Membro Teste
              - textbox "Nome do membro" [ref=e19]: member_1790800711520@test.com
              - button "Adicionar Membro" [ref=e20] [cursor=pointer]
          - button "Criar Conta" [ref=e21] [cursor=pointer]
      - button "Voltar" [ref=e22] [cursor=pointer]
  - alert [ref=e23]
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Teste E2E completo: Cria conta → Adiciona membro → Entra no Canvas →
  5   |  * Preenche TODOS os quadros até o Value Proposition Canvas.
  6   |  *
  7   |  * Gera screenshots e logs detalhados em cada etapa.
  8   |  */
  9   | 
  10  | const SCREENSHOTS_DIR = 'playwright/e2e-screenshots';
  11  | 
  12  | async function screenshot(page: Page, name: string) {
  13  |   await page.screenshot({ path: `${SCREENSHOTS_DIR}/${name}.png`, fullPage: true });
  14  |   console.log(`📸 Screenshot salvo: ${name}.png`);
  15  | }
  16  | 
  17  | /** Fecha qualquer tooltip aberto clicando fora dele */
  18  | async function closeTooltip(page: Page) {
  19  |   await page.mouse.click(10, 10);
  20  |   await page.waitForTimeout(300);
  21  | }
  22  | 
  23  | test.describe('E2E Completo: Registro → Canvas → Preenchimento Total', () => {
  24  |   test.setTimeout(180000); // 3 minutos
  25  | 
  26  |   test('Fluxo completo de ponta a ponta', async ({ page }) => {
  27  |     const uniqueId = Date.now();
  28  |     const email = `e2e_full_${uniqueId}@test.com`;
  29  |     const teamName = `Team_E2E_${uniqueId}`;
  30  |     const memberEmail = `member_${uniqueId}@test.com`;
  31  |     const memberName = 'Membro Teste';
  32  | 
  33  |     // ===================================================================
  34  |     // ETAPA 1: REGISTRO - Step 1 (dados pessoais)
  35  |     // ===================================================================
  36  |     console.log('\n🔵 ETAPA 1: Registro - Dados Pessoais');
  37  |     await page.goto('/auth/register');
  38  |     await page.waitForLoadState('networkidle');
  39  |     await screenshot(page, '01-register-page');
  40  | 
  41  |     // Preenche nome, email e senha
  42  |     await page.locator('input[type="text"]').first().fill('Teste E2E');
  43  |     await page.locator('input[type="email"]').first().fill(email);
  44  |     const pwInputs = page.locator('input[type="password"]');
  45  |     await pwInputs.nth(0).fill('Test123456!');
  46  |     if (await pwInputs.count() > 1) await pwInputs.nth(1).fill('Test123456!');
  47  | 
  48  |     await screenshot(page, '02-register-step1-filled');
  49  | 
  50  |     // Avança para Step 2
  51  |     await page.locator('button[type="submit"], button:has-text("Próximo")').first().click();
  52  |     await page.waitForTimeout(1500);
  53  |     await screenshot(page, '03-register-step2');
  54  | 
  55  |     // ===================================================================
  56  |     // ETAPA 2: REGISTRO - Step 2 (equipe + membro)
  57  |     // ===================================================================
  58  |     console.log('🔵 ETAPA 2: Registro - Equipe e Membros');
  59  | 
  60  |     // Nome da equipe
  61  |     await page.locator('input[type="text"]').first().fill(teamName);
  62  | 
  63  |     // Adiciona membro da equipe (procura botão de adicionar membro)
  64  |     const addMemberBtn = page.locator('button:has-text("Adicionar"), button:has-text("+ Membro")').first();
  65  |     if (await addMemberBtn.isVisible()) {
  66  |       // Se há campos separados no registro para membro
  67  |       const memberInputs = page.locator('input[type="text"], input[type="email"]');
  68  |       const count = await memberInputs.count();
  69  |       if (count >= 3) {
  70  |         await memberInputs.nth(1).fill(memberName);
  71  |         await memberInputs.nth(2).fill(memberEmail);
  72  |       }
  73  |     }
  74  | 
  75  |     await screenshot(page, '04-register-team-filled');
  76  | 
  77  |     // Submete o registro
  78  |     await page.locator('button[type="submit"], button:has-text("Criar")').first().click();
  79  | 
  80  |     // Espera redirecionamento para o dashboard
> 81  |     await page.waitForURL('**/dashboard', { timeout: 20000 });
      |                ^ TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
  82  |     console.log('✅ Registro concluído, redirecionado para dashboard');
  83  |     await screenshot(page, '05-dashboard-after-register');
  84  | 
  85  |     // ===================================================================
  86  |     // ETAPA 3: DASHBOARD - Adicionar membro e abrir canvas
  87  |     // ===================================================================
  88  |     console.log('🔵 ETAPA 3: Dashboard - Adicionar membro à equipe');
  89  | 
  90  |     // Adiciona membro pelo dashboard (garantido)
  91  |     const dashMemberNameInput = page.locator('input[placeholder*="Nome"]').first();
  92  |     const dashMemberEmailInput = page.locator('input[placeholder*="Email"]').first();
  93  | 
  94  |     if (await dashMemberNameInput.isVisible()) {
  95  |       await dashMemberNameInput.fill(memberName);
  96  |       await dashMemberEmailInput.fill(memberEmail);
  97  |       await page.locator('button:has-text("Adicionar Membro")').click();
  98  |       await page.waitForTimeout(2000);
  99  |       console.log('✅ Membro adicionado à equipe');
  100 |     }
  101 | 
  102 |     await screenshot(page, '06-dashboard-member-added');
  103 | 
  104 |     // Abre o canvas
  105 |     await page.locator('a:has-text("Abrir Canvas"), button:has-text("Abrir Canvas")').first().click();
  106 |     await page.waitForURL('**/canvas', { timeout: 15000 });
  107 |     console.log('✅ Canvas aberto');
  108 | 
  109 |     // Espera ReactFlow carregar
  110 |     await page.waitForSelector('.react-flow__node[data-id="step1"]', { timeout: 15000 });
  111 |     await page.waitForTimeout(2000);
  112 |     await screenshot(page, '07-canvas-loaded');
  113 | 
  114 |     // ===================================================================
  115 |     // ETAPA 4: CANVAS - Step 1 (Escopo)
  116 |     // ===================================================================
  117 |     console.log('\n🟢 CANVAS Step 1: Escopo');
  118 | 
  119 |     await page.locator('.react-flow__node[data-id="step1"] button:has-text("Preencher")').click();
  120 |     await page.waitForTimeout(500);
  121 |     await page.locator('.react-flow__node[data-id="step1"] textarea').fill(
  122 |       'Plataforma de IA para personalização de planos de aula em escolas públicas com suporte offline'
  123 |     );
  124 |     await screenshot(page, '08-step1-escopo-editing');
  125 | 
  126 |     await page.locator('.react-flow__node[data-id="step1"] button:has-text("Salvar")').click();
  127 |     await page.waitForTimeout(1500);
  128 |     console.log('✅ Step 1 (Escopo) preenchido e salvo');
  129 |     await screenshot(page, '09-step1-escopo-saved');
  130 | 
  131 |     // ===================================================================
  132 |     // ETAPA 5: CANVAS - Step 2 (Paradigma) + Tipo de Inovação
  133 |     // ===================================================================
  134 |     console.log('🟢 CANVAS Step 2: Paradigma + Tipo de Inovação');
  135 | 
  136 |     await page.waitForSelector('.react-flow__node[data-id="step2"]', { timeout: 10000 });
  137 |     await page.waitForSelector('.react-flow__node[data-id="step2_innovation"]', { timeout: 10000 });
  138 |     await page.waitForTimeout(1000);
  139 | 
  140 |     // Seleciona Tipo de Inovação: Inovação Aberta
  141 |     await page.locator('.react-flow__node[data-id="step2_innovation"] button:has-text("Inovação Aberta")').click();
  142 |     await page.waitForTimeout(500);
  143 |     console.log('  → Inovação Aberta selecionada');
  144 | 
  145 |     // Seleciona Paradigma: Novo Paradigma Tecnológico (Opção A)
  146 |     await page.locator('.react-flow__node[data-id="step2"] button:has-text("Novo Paradigma")').click();
  147 |     await page.waitForTimeout(1500);
  148 |     console.log('  → Novo Paradigma Tecnológico selecionado');
  149 |     await screenshot(page, '10-step2-paradigma');
  150 | 
  151 |     // ===================================================================
  152 |     // ETAPA 6: CANVAS - Step 2a (Oceano de Oportunidades)
  153 |     // ===================================================================
  154 |     console.log('🟢 CANVAS Step 2a: Oceano de Oportunidades');
  155 | 
  156 |     await page.waitForSelector('.react-flow__node[data-id="step2a"]', { timeout: 10000 });
  157 |     await page.waitForTimeout(500);
  158 |     await closeTooltip(page);
  159 | 
  160 |     await page.locator('.react-flow__node[data-id="step2a"] button:has-text("Preencher")').click();
  161 |     await page.waitForTimeout(500);
  162 |     await page.locator('.react-flow__node[data-id="step2a"] textarea').fill(
  163 |       'Professores de redes públicas que precisam de planos de aula personalizados com IA, operando 100% offline em escolas sem conectividade estável.'
  164 |     );
  165 |     await screenshot(page, '11-step2a-oceano-editing');
  166 | 
  167 |     await page.locator('.react-flow__node[data-id="step2a"] button:has-text("Salvar")').click();
  168 |     await page.waitForTimeout(1500);
  169 |     console.log('✅ Step 2a (Oceano de Oportunidades) preenchido');
  170 |     await screenshot(page, '12-step2a-oceano-saved');
  171 | 
  172 |     // ===================================================================
  173 |     // ETAPA 7: CANVAS - Step 3 (Análise de Mercado)
  174 |     // ===================================================================
  175 |     console.log('🟢 CANVAS Step 3: Análise de Mercado');
  176 | 
  177 |     await page.waitForSelector('.react-flow__node[data-id="step3"]', { timeout: 10000 });
  178 |     await page.waitForTimeout(500);
  179 |     await closeTooltip(page);
  180 | 
  181 |     await page.locator('.react-flow__node[data-id="step3"] button:has-text("Preencher")').click();
```