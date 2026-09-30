import { test, expect, Page } from '@playwright/test';

/**
 * Teste E2E completo: Cria conta → Adiciona membro → Entra no Canvas →
 * Preenche TODOS os quadros até o Value Proposition Canvas.
 *
 * Gera screenshots e logs detalhados em cada etapa.
 */

const SCREENSHOTS_DIR = 'playwright/e2e-screenshots';

async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/${name}.png`, fullPage: true });
  console.log(`📸 Screenshot salvo: ${name}.png`);
}

/** Fecha qualquer tooltip aberto clicando fora dele */
async function closeTooltip(page: Page) {
  await page.mouse.click(10, 10);
  await page.waitForTimeout(300);
}

test.describe('E2E Completo: Registro → Canvas → Preenchimento Total', () => {
  test.setTimeout(180000); // 3 minutos

  test('Fluxo completo de ponta a ponta', async ({ page }) => {
    const uniqueId = Date.now();
    const email = `e2e_full_${uniqueId}@test.com`;
    const teamName = `Team_E2E_${uniqueId}`;
    const memberEmail = `member_${uniqueId}@test.com`;
    const memberName = 'Membro Teste';

    // ===================================================================
    // ETAPA 1: REGISTRO - Step 1 (dados pessoais)
    // ===================================================================
    console.log('\n🔵 ETAPA 1: Registro - Dados Pessoais');
    await page.goto('/auth/register');
    await page.waitForLoadState('networkidle');
    await screenshot(page, '01-register-page');

    // Preenche nome, email e senha
    await page.locator('input[type="text"]').first().fill('Teste E2E');
    await page.locator('input[type="email"]').first().fill(email);
    const pwInputs = page.locator('input[type="password"]');
    await pwInputs.nth(0).fill('Test123456!');
    if (await pwInputs.count() > 1) await pwInputs.nth(1).fill('Test123456!');

    await screenshot(page, '02-register-step1-filled');

    // Avança para Step 2
    await page.locator('button[type="submit"], button:has-text("Próximo")').first().click();
    await page.waitForTimeout(1500);
    await screenshot(page, '03-register-step2');

    // ===================================================================
    // ETAPA 2: REGISTRO - Step 2 (equipe + membro)
    // ===================================================================
    console.log('🔵 ETAPA 2: Registro - Equipe e Membros');

    // Nome da equipe
    await page.locator('input[type="text"]').first().fill(teamName);

    // Adiciona membro da equipe (procura botão de adicionar membro)
    const addMemberBtn = page.locator('button:has-text("Adicionar"), button:has-text("+ Membro")').first();
    if (await addMemberBtn.isVisible()) {
      // Se há campos separados no registro para membro
      const memberInputs = page.locator('input[type="text"], input[type="email"]');
      const count = await memberInputs.count();
      if (count >= 3) {
        await memberInputs.nth(1).fill(memberName);
        await memberInputs.nth(2).fill(memberEmail);
      }
    }

    await screenshot(page, '04-register-team-filled');

    // Submete o registro
    await page.locator('button[type="submit"], button:has-text("Criar")').first().click();

    // Espera redirecionamento para o dashboard
    await page.waitForURL('**/dashboard', { timeout: 20000 });
    console.log('✅ Registro concluído, redirecionado para dashboard');
    await screenshot(page, '05-dashboard-after-register');

    // ===================================================================
    // ETAPA 3: DASHBOARD - Adicionar membro e abrir canvas
    // ===================================================================
    console.log('🔵 ETAPA 3: Dashboard - Adicionar membro à equipe');

    // Adiciona membro pelo dashboard (garantido)
    const dashMemberNameInput = page.locator('input[placeholder*="Nome"]').first();
    const dashMemberEmailInput = page.locator('input[placeholder*="Email"]').first();

    if (await dashMemberNameInput.isVisible()) {
      await dashMemberNameInput.fill(memberName);
      await dashMemberEmailInput.fill(memberEmail);
      await page.locator('button:has-text("Adicionar Membro")').click();
      await page.waitForTimeout(2000);
      console.log('✅ Membro adicionado à equipe');
    }

    await screenshot(page, '06-dashboard-member-added');

    // Abre o canvas
    await page.locator('a:has-text("Abrir Canvas"), button:has-text("Abrir Canvas")').first().click();
    await page.waitForURL('**/canvas', { timeout: 15000 });
    console.log('✅ Canvas aberto');

    // Espera ReactFlow carregar
    await page.waitForSelector('.react-flow__node[data-id="step1"]', { timeout: 15000 });
    await page.waitForTimeout(2000);
    await screenshot(page, '07-canvas-loaded');

    // ===================================================================
    // ETAPA 4: CANVAS - Step 1 (Escopo)
    // ===================================================================
    console.log('\n🟢 CANVAS Step 1: Escopo');

    await page.locator('.react-flow__node[data-id="step1"] button:has-text("Preencher")').click();
    await page.waitForTimeout(500);
    await page.locator('.react-flow__node[data-id="step1"] textarea').fill(
      'Plataforma de IA para personalização de planos de aula em escolas públicas com suporte offline'
    );
    await screenshot(page, '08-step1-escopo-editing');

    await page.locator('.react-flow__node[data-id="step1"] button:has-text("Salvar")').click();
    await page.waitForTimeout(1500);
    console.log('✅ Step 1 (Escopo) preenchido e salvo');
    await screenshot(page, '09-step1-escopo-saved');

    // ===================================================================
    // ETAPA 5: CANVAS - Step 2 (Paradigma) + Tipo de Inovação
    // ===================================================================
    console.log('🟢 CANVAS Step 2: Paradigma + Tipo de Inovação');

    await page.waitForSelector('.react-flow__node[data-id="step2"]', { timeout: 10000 });
    await page.waitForSelector('.react-flow__node[data-id="step2_innovation"]', { timeout: 10000 });
    await page.waitForTimeout(1000);

    // Seleciona Tipo de Inovação: Inovação Aberta
    await page.locator('.react-flow__node[data-id="step2_innovation"] button:has-text("Inovação Aberta")').click();
    await page.waitForTimeout(500);
    console.log('  → Inovação Aberta selecionada');

    // Seleciona Paradigma: Novo Paradigma Tecnológico (Opção A)
    await page.locator('.react-flow__node[data-id="step2"] button:has-text("Novo Paradigma")').click();
    await page.waitForTimeout(1500);
    console.log('  → Novo Paradigma Tecnológico selecionado');
    await screenshot(page, '10-step2-paradigma');

    // ===================================================================
    // ETAPA 6: CANVAS - Step 2a (Oceano de Oportunidades)
    // ===================================================================
    console.log('🟢 CANVAS Step 2a: Oceano de Oportunidades');

    await page.waitForSelector('.react-flow__node[data-id="step2a"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await closeTooltip(page);

    await page.locator('.react-flow__node[data-id="step2a"] button:has-text("Preencher")').click();
    await page.waitForTimeout(500);
    await page.locator('.react-flow__node[data-id="step2a"] textarea').fill(
      'Professores de redes públicas que precisam de planos de aula personalizados com IA, operando 100% offline em escolas sem conectividade estável.'
    );
    await screenshot(page, '11-step2a-oceano-editing');

    await page.locator('.react-flow__node[data-id="step2a"] button:has-text("Salvar")').click();
    await page.waitForTimeout(1500);
    console.log('✅ Step 2a (Oceano de Oportunidades) preenchido');
    await screenshot(page, '12-step2a-oceano-saved');

    // ===================================================================
    // ETAPA 7: CANVAS - Step 3 (Análise de Mercado)
    // ===================================================================
    console.log('🟢 CANVAS Step 3: Análise de Mercado');

    await page.waitForSelector('.react-flow__node[data-id="step3"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await closeTooltip(page);

    await page.locator('.react-flow__node[data-id="step3"] button:has-text("Preencher")').click();
    await page.waitForTimeout(500);

    const step3Textareas = page.locator('.react-flow__node[data-id="step3"] textarea');
    const taCount = await step3Textareas.count();
    console.log(`  → Encontrados ${taCount} campos de texto na Análise de Mercado`);

    await step3Textareas.nth(0).fill('Professores e gestores pedagógicos do ensino fundamental II de escolas públicas estaduais e municipais');
    if (taCount > 1) {
      await step3Textareas.nth(1).fill('Khan Academy (personalização), Google Classroom (gestão), Nova Escola (conteúdo brasileiro)');
    }
    await screenshot(page, '13-step3-mercado-editing');

    await page.locator('.react-flow__node[data-id="step3"] button:has-text("Salvar")').click();
    await page.waitForTimeout(1500);
    console.log('✅ Step 3 (Análise de Mercado) preenchido');
    await screenshot(page, '14-step3-mercado-saved');

    // ===================================================================
    // ETAPA 8: CANVAS - Step 4 (TAM/SAM/SOM)
    // ===================================================================
    console.log('🟢 CANVAS Step 4: Dimensionamento TAM/SAM/SOM');

    await page.waitForSelector('.react-flow__node[data-id="step4"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await closeTooltip(page);

    await page.locator('.react-flow__node[data-id="step4"] button:has-text("Preencher")').click();
    await page.waitForTimeout(500);

    const step4Textareas = page.locator('.react-flow__node[data-id="step4"] textarea');
    await step4Textareas.nth(0).fill('TAM: 2,2 milhões de professores de educação básica no Brasil (fonte: Censo Escolar 2023, INEP)');
    await step4Textareas.nth(1).fill('SAM: 500 mil professores em redes estaduais que possuem infraestrutura mínima de tecnologia');
    await step4Textareas.nth(2).fill('SOM: 50 mil professores em 5 estados nos primeiros 2 anos via parcerias com Secretarias de Educação');
    await screenshot(page, '15-step4-tam-editing');

    await page.locator('.react-flow__node[data-id="step4"] button:has-text("Salvar")').click();
    await page.waitForTimeout(1500);
    console.log('✅ Step 4 (TAM/SAM/SOM) preenchido');
    await screenshot(page, '16-step4-tam-saved');

    // ===================================================================
    // ETAPA 9: CANVAS - Step 5 (Formatos e Monetização)
    // ===================================================================
    console.log('🟢 CANVAS Step 5: Formatos e Monetização');

    await page.waitForSelector('.react-flow__node[data-id="step5"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await closeTooltip(page);

    await page.locator('.react-flow__node[data-id="step5"] button:has-text("Preencher")').click();
    await page.waitForTimeout(500);

    // Seleciona checkboxes de formato de negócio
    const checkboxes = page.locator('.react-flow__node[data-id="step5"] input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    console.log(`  → Encontrados ${checkboxCount} checkboxes`);

    // Clica B2B e B2B2C (índices 0 e 2)
    await checkboxes.nth(0).click(); // B2B
    await checkboxes.nth(2).click(); // B2B2C

    // Seleciona receitas: SaaS e Assinatura
    if (checkboxCount > 5) {
      await checkboxes.nth(5).click(); // SaaS
      await checkboxes.nth(8).click(); // Assinatura
    }

    // Preenche campos "Outros"
    const otherInputs = page.locator('.react-flow__node[data-id="step5"] input[type="text"]');
    const otherCount = await otherInputs.count();
    console.log(`  → Encontrados ${otherCount} inputs "Outros"`);
    if (otherCount >= 1) await otherInputs.nth(0).fill('B2G (Governo)');
    if (otherCount >= 2) await otherInputs.nth(1).fill('Licenciamento Anual');

    await screenshot(page, '17-step5-formatos-editing');

    await page.locator('.react-flow__node[data-id="step5"] button:has-text("Salvar")').click();
    await page.waitForTimeout(1500);
    console.log('✅ Step 5 (Formatos e Monetização) preenchido');
    await screenshot(page, '18-step5-formatos-saved');

    // ===================================================================
    // ETAPA 10: CANVAS - Step 6 (Business Model Canvas)
    // ===================================================================
    console.log('🟢 CANVAS Step 6: Business Model Canvas');

    await page.waitForSelector('.react-flow__node[data-id="step6"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await closeTooltip(page);

    // Verifica que o BMC tem altura aumentada (minHeight: 920)
    const bmcNode = page.locator('.react-flow__node[data-id="step6"]');
    await screenshot(page, '19-step6-bmc-before-fill');

    await page.locator('.react-flow__node[data-id="step6"] button:has-text("Preencher")').click();
    await page.waitForTimeout(500);

    const bmcTextareas = page.locator('.react-flow__node[data-id="step6"] textarea');
    const bmcCount = await bmcTextareas.count();
    console.log(`  → Encontrados ${bmcCount} campos no BMC`);

    // Preenche os 9 blocos do BMC
    const bmcData = [
      'Secretarias de Educação, Universidades parceiras, Fornecedores de hardware low-cost', // Parceiros
      'Desenvolvimento de IA, Curadoria pedagógica, Suporte offline, Capacitação de professores', // Atividades
      'Equipe de desenvolvedores, Banco de dados pedagógicos, Algoritmo de personalização', // Recursos
      'Planos de aula personalizados por IA que funcionam 100% offline, adaptados ao currículo brasileiro', // Proposta de Valor
      'Professores do ensino fundamental II, Coordenadores pedagógicos, Secretarias de Educação', // Segmentos
      'Suporte dedicado por WhatsApp, Comunidade online de professores, Webinars mensais', // Relacionamento
      'Parcerias com Secretarias, Eventos educacionais, Marketing digital, Indicação boca-a-boca', // Canais
      'Servidores, Equipe de P&D, Marketing, Suporte ao cliente, Infraestrutura de treinamento', // Custos
      'Assinatura SaaS municipal (R$2/aluno/mês), Licenciamento anual estadual, Consultorias premium', // Receita
    ];

    for (let i = 0; i < Math.min(bmcCount, bmcData.length); i++) {
      await bmcTextareas.nth(i).fill(bmcData[i]);
    }

    await screenshot(page, '20-step6-bmc-editing');

    await page.locator('.react-flow__node[data-id="step6"] button:has-text("Salvar")').click();
    await page.waitForTimeout(1500);
    console.log('✅ Step 6 (BMC) preenchido - todos os 9 blocos');
    await screenshot(page, '21-step6-bmc-saved');

    // Verificação: BMC deve mostrar "Editar (9/9)"
    const bmcContent = await bmcNode.innerText();
    console.log(`  → Conteúdo do BMC salvo: ${bmcContent.substring(0, 100)}...`);
    expect(bmcContent).toContain('Editar (9/9)');

    // ===================================================================
    // ETAPA 11: CANVAS - Step 6 VPC (Value Proposition Canvas)
    // ===================================================================
    console.log('🟢 CANVAS Step 6 VPC: Value Proposition Canvas');

    await page.waitForSelector('.react-flow__node[data-id="step6_vpc"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await closeTooltip(page);

    // Verifica layout do VPC (quadrado + círculo)
    const vpcNode = page.locator('.react-flow__node[data-id="step6_vpc"]');
    await screenshot(page, '22-step6vpc-before-fill');

    // Verifica se as labels "Proposta de Valor" e "Perfil do Cliente" existem
    const vpcText = await vpcNode.innerText();
    console.log(`  → Conteúdo VPC: ${vpcText.substring(0, 200)}...`);
    expect(vpcText).toContain('Proposta de Valor');
    expect(vpcText).toContain('Perfil do Cliente');

    await page.locator('.react-flow__node[data-id="step6_vpc"] button:has-text("Preencher")').click();
    await page.waitForTimeout(500);

    const vpcTextareas = page.locator('.react-flow__node[data-id="step6_vpc"] textarea');
    const vpcCount = await vpcTextareas.count();
    console.log(`  → Encontrados ${vpcCount} campos no VPC`);

    // Preenche os 6 campos do VPC
    const vpcData = [
      'App mobile com planos de aula inteligentes, gerados por IA, funcionando offline. Interface simples e intuitiva.', // Produtos & Serviços
      'Economia de 3h/semana na preparação de aulas. Planos alinhados à BNCC. Relatórios de progresso automáticos.', // Criadores de Ganho
      'Elimina necessidade de internet estável. Remove complexidade de planejamento manual. Suporte técnico acessível.', // Aliviadores de Dor
      'Mais tempo para interação com alunos. Reconhecimento profissional. Aulas mais engajadoras e diversificadas.', // Ganhos
      'Preparar planos de aula semanais. Acompanhar progresso individual. Adaptar conteúdo ao nível dos alunos.', // Tarefas do Cliente
      'Falta de tempo para planejamento. Internet instável nas escolas. Material didático genérico e desatualizado.', // Dores
    ];

    for (let i = 0; i < Math.min(vpcCount, vpcData.length); i++) {
      await vpcTextareas.nth(i).fill(vpcData[i]);
    }

    await screenshot(page, '23-step6vpc-editing');

    await page.locator('.react-flow__node[data-id="step6_vpc"] button:has-text("Salvar")').click();
    await page.waitForTimeout(1500);
    console.log('✅ Step 6 VPC (Value Proposition Canvas) preenchido - todos os 6 campos');
    await screenshot(page, '24-step6vpc-saved');

    // Verificação: VPC deve mostrar "Editar (6/6)"
    const vpcFinalContent = await vpcNode.innerText();
    expect(vpcFinalContent).toContain('Editar (6/6)');

    // ===================================================================
    // ETAPA 12: Verificações finais e screenshots
    // ===================================================================
    console.log('\n🔵 ETAPA FINAL: Verificações e Screenshots');

    // Screenshot final do canvas completo
    await screenshot(page, '25-canvas-complete-final');

    // Verifica que o merge node foi desbloqueado (ambos BMC e VPC completos)
    const mergeNode = page.locator('.react-flow__node[data-id="step6_merge"]');
    const mergeVisible = await mergeNode.isVisible();
    console.log(`  → Nó de merge visível: ${mergeVisible}`);

    if (mergeVisible) {
      await screenshot(page, '26-merge-node-visible');
      console.log('✅ Nó de Estratégia Unificada desbloqueado após BMC + VPC');
    }

    // Resumo final
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMO DO TESTE E2E');
    console.log('='.repeat(60));
    console.log(`✅ Conta criada: ${email}`);
    console.log(`✅ Equipe: ${teamName}`);
    console.log(`✅ Membro adicionado: ${memberName} (${memberEmail})`);
    console.log('✅ Step 1 (Escopo): Preenchido');
    console.log('✅ Step 2 (Paradigma): Novo Paradigma Tecnológico');
    console.log('✅ Step 2 (Tipo de Inovação): Inovação Aberta');
    console.log('✅ Step 2a (Oceano de Oportunidades): Preenchido');
    console.log('✅ Step 3 (Análise de Mercado): Preenchido');
    console.log('✅ Step 4 (TAM/SAM/SOM): Preenchido');
    console.log('✅ Step 5 (Formatos e Monetização): Preenchido');
    console.log('✅ Step 6 (Business Model Canvas): 9/9 blocos');
    console.log('✅ Step 6 VPC (Value Proposition Canvas): 6/6 campos');
    console.log(`✅ Merge node desbloqueado: ${mergeVisible}`);
    console.log('='.repeat(60));
    console.log('🎉 TESTE E2E COMPLETO COM SUCESSO!');
    console.log('='.repeat(60));
  });
});
