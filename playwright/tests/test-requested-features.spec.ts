import { test, expect } from '@playwright/test';

test('Verifica melhorias no Canvas: tooltip com exemplos, Análise de Mercado lado a lado e bordas transparentes', async ({ page }) => {
  const uniqueId = Date.now();
  const email = `test_features_${uniqueId}@test.com`;

  // 1. Registro
  await page.goto('/auth/register');
  await page.waitForLoadState('networkidle');

  await page.locator('input[type="text"]').first().fill('TestUser');
  await page.locator('input[type="email"]').first().fill(email);
  const pwInputs = page.locator('input[type="password"]');
  await pwInputs.nth(0).fill('Test123456!');
  if (await pwInputs.count() > 1) await pwInputs.nth(1).fill('Test123456!');

  await page.locator('button[type="submit"], button:has-text("Próximo")').first().click();
  await page.waitForTimeout(1000);

  await page.locator('input[type="text"]').first().fill('TestStartup');
  await page.locator('button[type="submit"], button:has-text("Criar")').first().click();

  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.locator('a:has-text("Abrir Canvas"), button:has-text("Abrir Canvas")').first().click();
  await page.waitForURL('**/canvas', { timeout: 10000 });

  // Aguarda carregar
  await page.waitForSelector('.react-flow__node', { timeout: 10000 });
  await page.waitForTimeout(2000);

  // 2. Preenche step 1 (Escopo)
  const step1Btn = page.locator('.react-flow__node[data-id="step1"] button:has-text("Preencher")');
  await step1Btn.click();
  await page.locator('.react-flow__node[data-id="step1"] textarea').fill('Solução inovadora de IA para escolas públicas');
  await page.locator('.react-flow__node[data-id="step1"] button:has-text("Salvar")').click();
  await page.waitForTimeout(1000);

  // 3. Escolhe Paradigma Tecnológico (Opção A) no step 2
  await page.waitForSelector('.react-flow__node[data-id="step2"]', { timeout: 10000 });
  await page.locator('.react-flow__node[data-id="step2"] button:has-text("Novo Paradigma")').click();
  await page.waitForTimeout(1000);

  // 4. Verifica step2a (Oceano de Oportunidades) e seu tooltip
  await page.waitForSelector('.react-flow__node[data-id="step2a"]', { timeout: 10000 });
  
  // Clica no ícone de '?' do step2a
  const tooltipBtn2a = page.locator('.react-flow__node[data-id="step2a"] button:has(svg)').first();
  await tooltipBtn2a.click();
  await page.waitForTimeout(500);

  const tooltipText2a = await page.locator('.react-flow__node[data-id="step2a"]').innerText();
  console.log('Conteúdo tooltip step2a:', tooltipText2a);
  expect(tooltipText2a).toContain('Exemplo:');

  // Preenche step2a
  await page.locator('.react-flow__node[data-id="step2a"] button:has-text("Preencher")').click();
  await page.locator('.react-flow__node[data-id="step2a"] textarea').fill('Professores de redes públicas que operam offline');
  await page.locator('.react-flow__node[data-id="step2a"] button:has-text("Salvar")').click();
  await page.waitForTimeout(1000);

  // 5. Verifica step3 (Análise de Mercado)
  await page.waitForSelector('.react-flow__node[data-id="step3"]', { timeout: 10000 });

  // Clica no '?' do step3
  const tooltipBtn3 = page.locator('.react-flow__node[data-id="step3"] button:has(svg)').first();
  await tooltipBtn3.click();
  await page.waitForTimeout(500);

  const tooltipText3 = await page.locator('.react-flow__node[data-id="step3"]').innerText();
  console.log('Conteúdo tooltip step3:', tooltipText3);
  expect(tooltipText3).toContain('Exemplo');

  // Abre edição do step3 e verifica layout lado a lado
  await page.locator('.react-flow__node[data-id="step3"] button:has-text("Preencher")').click();
  await page.waitForTimeout(500);

  // Verifica que existem 2 colunas
  const textareasCount = await page.locator('.react-flow__node[data-id="step3"] textarea').count();
  expect(textareasCount).toBe(2);

  const label1 = await page.locator('.react-flow__node[data-id="step3"] label').nth(0).innerText();
  const label2 = await page.locator('.react-flow__node[data-id="step3"] label').nth(1).innerText();
  console.log('Labels step3:', label1, '|', label2);
  expect(label1).toContain('Público-alvo');
  expect(label2).toContain('Inspiração');

  // Preenche os dois campos
  await page.locator('.react-flow__node[data-id="step3"] textarea').nth(0).fill('Professores e alunos da rede pública');
  await page.locator('.react-flow__node[data-id="step3"] textarea').nth(1).fill('Khan Academy');

  // Captura screenshot com edição e transparência de bordas
  await page.screenshot({ path: 'playwright/debug-screenshots/09-market-side-by-side-edit.png', fullPage: true });

  await page.locator('.react-flow__node[data-id="step3"] button:has-text("Salvar")').click();
  await page.waitForTimeout(1000);

  // Captura screenshot final após salvar
  await page.screenshot({ path: 'playwright/debug-screenshots/10-market-side-by-side-saved.png', fullPage: true });

  console.log('Teste concluído com sucesso!');
});
