import { test, expect } from '@playwright/test';

/**
 * Debug aprofundado: por que o nó step1 está com visibility: hidden e sem texto?
 */
test('Debug detalhado: inspecionar nó step1 do canvas', async ({ page }) => {
  const consoleLogs: string[] = [];
  const consoleErrors: string[] = [];

  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') consoleErrors.push(text);
  });
  page.on('pageerror', err => {
    consoleErrors.push(`[pageerror] ${err.message}\n${err.stack}`);
  });

  const uniqueId = Date.now();
  const email = `debug2_${uniqueId}@test.com`;

  console.log('=== DEBUG DETALHADO DO NÓ DO CANVAS ===');

  // Registro rápido
  await page.goto('/auth/register');
  await page.waitForLoadState('networkidle');

  // Step 1
  await page.locator('input[type="text"]').first().fill('DebugUser2');
  await page.locator('input[type="email"]').first().fill(email);
  const pwInputs = page.locator('input[type="password"]');
  await pwInputs.nth(0).fill('Debug123456!');
  if (await pwInputs.count() > 1) await pwInputs.nth(1).fill('Debug123456!');
  
  await page.locator('button[type="submit"], button:has-text("Próximo")').first().click();
  await page.waitForTimeout(1000);

  // Step 2
  await page.locator('input[type="text"]').first().fill('DebugTeam2');
  await page.locator('button[type="submit"], button:has-text("Criar")').first().click();
  
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.waitForLoadState('networkidle');

  // Abrir canvas
  await page.locator('a:has-text("Abrir Canvas"), button:has-text("Abrir Canvas")').first().click();
  await page.waitForURL('**/canvas', { timeout: 10000 });
  
  // Espera mais generoso para o canvas
  console.log('Aguardando canvas por 8 segundos...');
  await page.waitForTimeout(8000);

  // === DIAGNÓSTICO PROFUNDO ===
  console.log('\n=== DIAGNÓSTICO DO NÓ ===');

  // 1. Verifica o HTML completo do nó
  const nodeHtml = await page.evaluate(() => {
    const node = document.querySelector('.react-flow__node');
    return {
      outerHTML: node?.outerHTML?.substring(0, 2000) || 'NÃO ENCONTRADO',
      innerHTML: node?.innerHTML?.substring(0, 2000) || 'NÃO ENCONTRADO',
      computedStyle: node ? {
        visibility: getComputedStyle(node).visibility,
        display: getComputedStyle(node).display,
        opacity: getComputedStyle(node).opacity,
        width: getComputedStyle(node).width,
        height: getComputedStyle(node).height,
        overflow: getComputedStyle(node).overflow,
      } : null,
      childCount: node?.childElementCount || 0,
      textContent: node?.textContent?.substring(0, 200) || '(vazio)',
    };
  });
  console.log('HTML do nó:', JSON.stringify(nodeHtml, null, 2));

  // 2. Verifica se o NodeWrapper renderizou
  const wrapperInfo = await page.evaluate(() => {
    const node = document.querySelector('.react-flow__node');
    if (!node) return { error: 'Nó não encontrado' };
    
    const children = node.children;
    const childrenInfo = [];
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      childrenInfo.push({
        tagName: child.tagName,
        className: child.className?.substring(0, 100),
        style: (child as HTMLElement).style?.cssText?.substring(0, 200),
        innerHTML: child.innerHTML?.substring(0, 300),
      });
    }
    return { childrenCount: children.length, children: childrenInfo };
  });
  console.log('Wrapper info:', JSON.stringify(wrapperInfo, null, 2));

  // 3. Verifica se o componente React renderizou
  const reactFiberInfo = await page.evaluate(() => {
    const node = document.querySelector('.react-flow__node');
    if (!node) return { error: 'Nó não encontrado' };
    
    // Verifica o tipo do nó no atributo data
    const dataType = node.getAttribute('data-testid');
    const dataId = node.getAttribute('data-id');
    const classList = Array.from(node.classList);
    
    // Verifica se há um NodeResizer (indica que NodeWrapper renderizou)
    const hasResizer = !!node.querySelector('.react-flow__resize-control');
    
    // Verifica se há um Handle
    const handles = node.querySelectorAll('.react-flow__handle');
    
    // Verifica se há conteúdo de texto em qualquer descendente
    const allTextContent = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    let textNode;
    while (textNode = walker.nextNode()) {
      const text = textNode.textContent?.trim();
      if (text) allTextContent.push(text);
    }
    
    return {
      dataId,
      dataType,
      classList,
      hasResizer,
      handleCount: handles.length,
      allTextContent,
      // Verifica dimensões do nó e seus filhos
      nodeBBox: node.getBoundingClientRect(),
    };
  });
  console.log('React fiber info:', JSON.stringify(reactFiberInfo, null, 2));

  // 4. Injeta log no componente para ver o que o React recebe
  const reactState = await page.evaluate(() => {
    // Tenta encontrar a fiber React para ver as props
    const node = document.querySelector('.react-flow__node');
    if (!node) return { error: 'Nó não encontrado' };
    
    // Procura pela key __reactFiber ou __reactInternalInstance
    const fiberKey = Object.keys(node).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance'));
    if (!fiberKey) return { error: 'Fiber não encontrada', keys: Object.keys(node).filter(k => k.startsWith('__')) };
    
    const fiber = (node as any)[fiberKey];
    
    // Navega pela árvore de fiber para encontrar o componente
    let current = fiber;
    const components: string[] = [];
    const propsFound: any[] = [];
    for (let i = 0; i < 20 && current; i++) {
      if (current.type && typeof current.type === 'function') {
        components.push(current.type.name || current.type.displayName || 'Anonymous');
        if (current.memoizedProps) {
          propsFound.push({
            component: current.type.name || 'Anonymous',
            propsKeys: Object.keys(current.memoizedProps),
            data: current.memoizedProps.data ? {
              label: current.memoizedProps.data.label,
              content: current.memoizedProps.data.content,
              locked: current.memoizedProps.data.locked,
              hasNodeStyle: !!current.memoizedProps.data.nodeStyle,
              description: current.memoizedProps.data.description?.substring(0, 50),
            } : undefined,
            id: current.memoizedProps.id,
            type: current.memoizedProps.type,
          });
        }
      }
      current = current.return;
    }
    
    return { components, propsFound };
  });
  console.log('React state:', JSON.stringify(reactState, null, 2));

  // 5. Screenshot final
  await page.screenshot({ path: 'playwright/debug-screenshots/08-canvas-debug-detail.png', fullPage: true });

  // === RESUMO ===
  console.log('\n========== RESUMO ==========');
  if (consoleErrors.length > 0) {
    console.log('\n--- ERROS DO CONSOLE ---');
    consoleErrors.forEach(err => console.log(err));
  }
  
  // Todos os logs
  console.log('\n--- TODOS OS LOGS ---');
  consoleLogs.forEach(log => console.log(log));

  console.log('\n=== FIM DO DEBUG DETALHADO ===');

  // Assert: nó deve ter conteúdo visível
  expect(reactFiberInfo?.allTextContent?.length ?? 0, 'Nó deve ter texto renderizado').toBeGreaterThan(0);
});
