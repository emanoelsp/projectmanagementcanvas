import { test, expect } from '@playwright/test';

test.describe('Registration and Canvas Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123';

  test('should register new user and access canvas', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');
    expect(await page.title()).toContain('PMC');

    // Click register button
    await page.click('text=Criar Conta');
    await expect(page).toHaveURL(/\/auth\/register/);

    // Step 1: Register credentials
    await page.fill('input[placeholder="seu@email.com"]', testEmail);
    await page.fill('input[placeholder*="••••••••"]', testPassword);

    const confirmPasswordInputs = await page.locator('input[type="password"]');
    await confirmPasswordInputs.last().fill(testPassword);

    await page.click('text=Próximo');

    // Step 2: Register team
    await page.fill('input[placeholder="Ex: StartUp XYZ"]', 'Test Team');
    await page.click('text=Criar Conta');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    expect(await page.textContent('h1')).toContain('Bem-vindo');

    // Navigate to canvas
    await page.click('text=Abrir Canvas');
    await expect(page).toHaveURL(/\/canvas/);

    // Verify canvas loaded (step1 should be visible)
    await expect(page.locator('text=Escopo')).toBeVisible();
  });

  test('should fill step1 and unlock step2', async ({ page }) => {
    // Register and navigate to canvas (reusing previous test flow)
    await page.goto('/');
    await page.click('text=Criar Conta');

    const email = `test-step2-${Date.now()}@example.com`;
    await page.fill('input[placeholder="seu@email.com"]', email);
    await page.fill('input[placeholder*="••••••••"]', testPassword);

    const confirmPasswordInputs = await page.locator('input[type="password"]');
    await confirmPasswordInputs.last().fill(testPassword);

    await page.click('text=Próximo');

    await page.fill('input[placeholder="Ex: StartUp XYZ"]', 'Test Team 2');
    await page.click('text=Criar Conta');

    await page.click('text=Abrir Canvas');

    // Fill step1
    await page.click('text=Preencher');
    await page.fill('textarea', 'Create an AI startup');
    await page.click('text=Salvar');

    // Verify step2 is now unlocked
    await expect(page.locator('text=Paradigma')).not.toHaveClass(/opacity-50/);
    await expect(page.locator('text=Novo Paradigma Tecnológico')).toBeVisible();
  });

  test('should show locked nodes initially', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Criar Conta');

    const email = `test-locked-${Date.now()}@example.com`;
    await page.fill('input[placeholder="seu@email.com"]', email);
    await page.fill('input[placeholder*="••••••••"]', testPassword);

    const confirmPasswordInputs = await page.locator('input[type="password"]');
    await confirmPasswordInputs.last().fill(testPassword);

    await page.click('text=Próximo');

    await page.fill('input[placeholder="Ex: StartUp XYZ"]', 'Test Team 3');
    await page.click('text=Criar Conta');

    await page.click('text=Abrir Canvas');

    // Only step1 should be unlocked
    const escopo = page.locator('text=Escopo').first();
    await expect(escopo).toBeVisible();

    // Step2 should show as locked
    const paradigma = page.locator('text=Paradigma').first();
    await expect(paradigma).toHaveClass(/opacity-50/);
  });
});
