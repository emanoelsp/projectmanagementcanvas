import { test, expect } from '@playwright/test';

/**
 * Script de debug para diagnosticar o canvas em branco.
 * Captura screenshots em cada etapa e coleta logs do console.
 */
test('Debug: Canvas deve mostrar nós após criar conta', async ({ page }) => {
  const consoleLogs: string[] = [];
  const consoleErrors: string[] = [];

  // Coleta TODOS os logs do console
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  // Coleta erros de página (uncaught exceptions)
  page.on('pageerror', err => {
    consoleErrors.push(`[pageerror] ${err.message}`);
  });

  // Gera email único para cada execução
  const uniqueId = Date.now();
  const email = `debug_canvas_${uniqueId}@test.com`;

  console.log('=== INICIO DO TESTE DE DEBUG DO CANVAS ===');
  console.log(`Email: ${email}`);

  // ====== STEP 1: Página de registro ======
  console.log('\n--- STEP 1: Abrindo registro ---');
  await page.goto('/auth/register');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'playwright/debug-screenshots/01-register-step1.png', fullPage: true });
  console.log('Screenshot: 01-register-step1.png');

  // Preenche Step 1
  const nameInput = page.locator('input[placeholder*="nome" i], input[type="text"]').first();
  await nameInput.fill('DebugUser');

  const emailInput = page.locator('input[type="email"]').first();
  await emailInput.fill(email);

  const passwordInputs = page.locator('input[type="password"]');
  await passwordInputs.nth(0).fill('Debug123456!');
  if (await passwordInputs.count() > 1) {
    await passwordInputs.nth(1).fill('Debug123456!');
  }

  await page.screenshot({ path: 'playwright/debug-screenshots/02-register-step1-filled.png', fullPage: true });
  console.log('Screenshot: 02-register-step1-filled.png');

  // Clica Próximo
  const nextButton = page.locator('button:has-text("Próximo"), button:has-text("Next"), button:has-text("Continuar"), button[type="submit"]').first();
  await nextButton.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'playwright/debug-screenshots/03-register-step2.png', fullPage: true });
  console.log('Screenshot: 03-register-step2.png');

  // ====== STEP 2: Nome da equipe ======
  console.log('\n--- STEP 2: Preenchendo equipe ---');
  const teamInput = page.locator('input[placeholder*="equipe" i], input[placeholder*="projeto" i], input[placeholder*="team" i], input[type="text"]').first();
  await teamInput.fill('DebugTeam');

  await page.screenshot({ path: 'playwright/debug-screenshots/04-register-step2-filled.png', fullPage: true });
  console.log('Screenshot: 04-register-step2-filled.png');

  // Submete o registro
  const submitButton = page.locator('button:has-text("Criar"), button:has-text("Registrar"), button:has-text("Cadastrar"), button[type="submit"]').first();
  await submitButton.click();

  // Espera redirecionar para dashboard
  console.log('\n--- STEP 3: Aguardando dashboard ---');
  await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(() => {
    console.log('WARN: Não redirecionou para /dashboard em 15s');
  });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'playwright/debug-screenshots/05-dashboard.png', fullPage: true });
  console.log(`Screenshot: 05-dashboard.png | URL: ${page.url()}`);

  // ====== STEP 4: Abre o Canvas ======
  console.log('\n--- STEP 4: Abrindo Canvas ---');
  const canvasButton = page.locator('a:has-text("Abrir Canvas"), button:has-text("Abrir Canvas")').first();

  if (await canvasButton.isVisible()) {
    await canvasButton.click();
  } else {
    console.log('WARN: Botão "Abrir Canvas" não encontrado, navegando diretamente');
    await page.goto('/canvas');
  }

  // Espera a página do canvas carregar
  await page.waitForURL('**/canvas', { timeout: 10000 }).catch(() => {
    console.log('WARN: Não redirecionou para /canvas em 10s');
  });
  await page.waitForLoadState('networkidle');

  // Espera o "Carregando canvas..." desaparecer (se aparecer)
  console.log('\n--- STEP 5: Aguardando canvas carregar ---');
  const loadingText = page.locator('text=Carregando');
  if (await loadingText.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('Canvas está em "Carregando canvas..."');
    await loadingText.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      console.log('WARN: "Carregando canvas..." não desapareceu em 10s');
    });
  }

  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'playwright/debug-screenshots/06-canvas-initial.png', fullPage: true });
  console.log(`Screenshot: 06-canvas-initial.png | URL: ${page.url()}`);

  // ====== STEP 6: Diagnóstico do Canvas ======
  console.log('\n--- STEP 6: Diagnóstico do DOM do Canvas ---');

  // Verifica se o ReactFlow está presente
  const reactFlowContainer = page.locator('.react-flow');
  const rfExists = await reactFlowContainer.count();
  console.log(`ReactFlow container encontrado: ${rfExists > 0}`);

  // Verifica nós do ReactFlow
  const reactFlowNodes = page.locator('.react-flow__node');
  const nodeCount = await reactFlowNodes.count();
  console.log(`Número de nós ReactFlow visíveis: ${nodeCount}`);

  // Verifica edges
  const reactFlowEdges = page.locator('.react-flow__edge');
  const edgeCount = await reactFlowEdges.count();
  console.log(`Número de edges visíveis: ${edgeCount}`);

  // Verifica o viewport/transform do ReactFlow
  const viewport = page.locator('.react-flow__viewport');
  if (await viewport.count() > 0) {
    const transform = await viewport.getAttribute('style');
    console.log(`Viewport transform: ${transform}`);
  }

  // Lista todos os nós com seus IDs e classes
  if (nodeCount > 0) {
    for (let i = 0; i < nodeCount; i++) {
      const node = reactFlowNodes.nth(i);
      const nodeId = await node.getAttribute('data-id');
      const className = await node.getAttribute('class');
      const style = await node.getAttribute('style');
      const text = await node.innerText().catch(() => '(sem texto)');
      console.log(`  Nó ${i}: id=${nodeId}, class=${className?.substring(0, 80)}, style=${style?.substring(0, 100)}`);
      console.log(`    Texto: ${text.substring(0, 80)}`);
    }
  }

  // Verifica o conteúdo do Zustand store via JavaScript no browser
  console.log('\n--- STEP 7: Inspecionando estado interno ---');
  const storeState = await page.evaluate(() => {
    // Tenta acessar o store via window (se exposto) ou via __NEXT_DATA__
    try {
      // O Zustand store não é acessível diretamente, mas podemos inspecionar o DOM
      const rfNodes = document.querySelectorAll('.react-flow__node');
      const rfEdges = document.querySelectorAll('.react-flow__edge');
      const rfViewport = document.querySelector('.react-flow__viewport');
      const rfPane = document.querySelector('.react-flow__pane');
      const rfRenderer = document.querySelector('.react-flow__renderer');
      
      return {
        nodesCount: rfNodes.length,
        edgesCount: rfEdges.length,
        viewportTransform: rfViewport?.getAttribute('style') || 'não encontrado',
        paneExists: !!rfPane,
        rendererExists: !!rfRenderer,
        bodyHeight: document.body.scrollHeight,
        rfContainerHeight: document.querySelector('.react-flow')?.getBoundingClientRect().height || 0,
        rfContainerWidth: document.querySelector('.react-flow')?.getBoundingClientRect().width || 0,
        nodeIds: Array.from(rfNodes).map(n => n.getAttribute('data-id')),
        nodePositions: Array.from(rfNodes).map(n => {
          const style = (n as HTMLElement).style;
          return { id: n.getAttribute('data-id'), transform: style.transform, zIndex: style.zIndex };
        }),
      };
    } catch (e) {
      return { error: String(e) };
    }
  });
  console.log('Estado do DOM ReactFlow:', JSON.stringify(storeState, null, 2));

  // Screenshot com mais detalhes
  await page.screenshot({ path: 'playwright/debug-screenshots/07-canvas-after-wait.png', fullPage: true });

  // ====== STEP 8: Verifica se o container tem dimensões ======
  console.log('\n--- STEP 8: Dimensões do container ---');
  const containerDimensions = await page.evaluate(() => {
    const main = document.querySelector('main');
    const flexDiv = main?.querySelector('.flex-1');
    const rfContainer = document.querySelector('.react-flow');
    
    return {
      mainRect: main?.getBoundingClientRect(),
      flexDivRect: flexDiv?.getBoundingClientRect(),
      rfContainerRect: rfContainer?.getBoundingClientRect(),
      windowInnerHeight: window.innerHeight,
      windowInnerWidth: window.innerWidth,
    };
  });
  console.log('Dimensões:', JSON.stringify(containerDimensions, null, 2));

  // ====== RESUMO ======
  console.log('\n========== RESUMO ==========');
  console.log(`URL final: ${page.url()}`);
  console.log(`Nós ReactFlow visíveis: ${nodeCount}`);
  console.log(`Edges visíveis: ${edgeCount}`);
  console.log(`Container ReactFlow: ${storeState.rfContainerWidth}x${storeState.rfContainerHeight}`);
  console.log(`Total console logs: ${consoleLogs.length}`);
  console.log(`Total console errors: ${consoleErrors.length}`);

  if (consoleErrors.length > 0) {
    console.log('\n--- ERROS DO CONSOLE ---');
    consoleErrors.forEach(err => console.log(err));
  }

  // Filtra logs relevantes (Firestore, canvas, etc.)
  const relevantLogs = consoleLogs.filter(log =>
    log.includes('canvas') || log.includes('Canvas') ||
    log.includes('Error') || log.includes('error') ||
    log.includes('initCanvas') || log.includes('loadCanvas') ||
    log.includes('node') || log.includes('unlock')
  );
  if (relevantLogs.length > 0) {
    console.log('\n--- LOGS RELEVANTES ---');
    relevantLogs.forEach(log => console.log(log));
  }

  console.log('\n=== FIM DO TESTE DE DEBUG ===');

  // Assert: deve ter pelo menos 1 nó visível (step1 - Escopo)
  expect(nodeCount, 'Canvas deve ter pelo menos 1 nó visível (step1)').toBeGreaterThan(0);
});
