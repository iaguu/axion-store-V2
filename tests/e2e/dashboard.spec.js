import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/login');
    await page.fill('input[placeholder="seu@email.com"]', 'demo@axionstore.com');
    await page.fill('input[placeholder="••••••••"]', 'demo123');
    await page.click('text=Entrar');
    await page.waitForTimeout(2000);
  });

  test('carrega o dashboard corretamente', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Usuário Demo')).toBeVisible();
    await expect(page.locator('text=Plano Free')).toBeVisible();
  });

  test('navegação no menu lateral', async ({ page }) => {
    // Testar navegação para Meus Cards
    await page.click('text=Meus Cards');
    await expect(page.locator('text=Gerenciar seus Cards')).toBeVisible();
    
    // Testar navegação para Database
    await page.click('text=Database');
    await expect(page.locator('text=Database Central')).toBeVisible();
    
    // Testar navegação para Bots
    await page.click('text=Bots');
    await expect(page.locator('text=Automação')).toBeVisible();
    
    // Testar navegação para IA Tools
    await page.click('text=IA Tools');
    await expect(page.locator('text=Ferramentas de IA')).toBeVisible();
    
    // Testar navegação para Configurações
    await page.click('text=Configurações');
    await expect(page.locator('text=Configurações da Conta')).toBeVisible();
  });

  test('exibe estatísticas principais', async ({ page }) => {
    await expect(page.locator('text=Cards Ativos')).toBeVisible();
    await expect(page.locator('text=Conversões')).toBeVisible();
    await expect(page.locator('text=Taxa CTR')).toBeVisible();
    await expect(page.locator('text=Receita')).toBeVisible();
  });

  test('quick actions funcionam corretamente', async ({ page }) => {
    // Testar Criar Novo Card
    await page.click('text=Criar Novo Card');
    await expect(page.locator('text=Novo Card')).toBeVisible();
    
    // Voltar para dashboard
    await page.click('text=Visão Geral');
    
    // Testar Ver Analytics
    await page.click('text=Ver Analytics');
    await expect(page.locator('text=Analytics')).toBeVisible();
  });

  test('criação de novo card', async ({ page }) => {
    await page.click('text=Meus Cards');
    await page.click('text=Criar Novo Card');
    
    // Preencher formulário de card
    await page.fill('input[placeholder="Título do Card"]', 'Card de Teste');
    await page.fill('textarea[placeholder="Descrição"]', 'Descrição do card de teste');
    await page.fill('input[placeholder="Link de destino"]', 'https://exemplo.com');
    
    // Salvar card
    await page.click('text=Salvar Card');
    
    // Verificar se o card foi criado
    await expect(page.locator('text=Card de Teste')).toBeVisible();
  });

  test('upgrade de plano', async ({ page }) => {
    await page.click('text=Upgrade Plano');
    
    // Verificar se redireciona para página de preços
    await expect(page.locator('text=Nossos Planos')).toBeVisible();
    await expect(page.locator('text=Plano Pro')).toBeVisible();
    await expect(page.locator('text=Plano VIP')).toBeVisible();
  });

  test('perfil do usuário', async ({ page }) => {
    await page.click('text=Configurações');
    
    // Verificar informações do perfil
    await expect(page.locator('text=Perfil')).toBeVisible();
    await expect(page.locator('text=Usuário Demo')).toBeVisible();
    await expect(page.locator('text=demo@axionstore.com')).toBeVisible();
  });

  test('responsividade do dashboard', async ({ page }) => {
    // Testar em mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Menu mobile deve estar colapsado
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
    
    // Abrir menu mobile
    await page.click('[data-testid="mobile-menu-toggle"]');
    await expect(page.locator('text=Visão Geral')).toBeVisible();
    await expect(page.locator('text=Meus Cards')).toBeVisible();
  });

  test('activity feed', async ({ page }) => {
    await expect(page.locator('text=Atividade Recente')).toBeVisible();
    
    // Verificar se há itens de atividade
    const activityItems = page.locator('[data-testid="activity-item"]');
    await expect(activityItems.first()).toBeVisible();
  });
});
