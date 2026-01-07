import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('carrega a landing page corretamente', async ({ page }) => {
    await expect(page).toHaveTitle(/AXION STORE/);
    await expect(page.locator('h1')).toContainText('Cards Inteligentes');
    await expect(page.locator('text=AXION')).toBeVisible();
    await expect(page.locator('text=STORE')).toBeVisible();
  });

  test('navegação para página de login', async ({ page }) => {
    await page.click('text=Entrar');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toContainText('AXION');
    await expect(page.locator('text=Entre na sua conta')).toBeVisible();
  });

  test('navegação para página de registro', async ({ page }) => {
    await page.click('text=Começar');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('text=Criar sua conta')).toBeVisible();
  });

  test('rolagem suave para seções', async ({ page }) => {
    await page.click('text=Serviços');
    await page.waitForTimeout(500);
    await expect(page.locator('#services')).toBeInViewport();
    
    await page.click('text=Preços');
    await page.waitForTimeout(500);
    await expect(page.locator('#pricing')).toBeInViewport();
    
    await page.click('text=Prova Social');
    await page.waitForTimeout(500);
    await expect(page.locator('#testimonials')).toBeInViewport();
    
    await page.click('text=Contato');
    await page.waitForTimeout(500);
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('exibe todas as seções principais', async ({ page }) => {
    await expect(page.locator('text=CARDS LIVE V2.0')).toBeVisible();
    await expect(page.locator('text=Serviços')).toBeVisible();
    await expect(page.locator('text=Nossos Planos')).toBeVisible();
    await expect(page.locator('text=Depoimentos')).toBeVisible();
    await expect(page.locator('text=Contato')).toBeVisible();
  });

  test('menu mobile responsivo', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Menu mobile deve estar visível
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Abrir menu mobile
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('text=Serviços')).toBeVisible();
    await expect(page.locator('text=Preços')).toBeVisible();
    await expect(page.locator('text=Prova Social')).toBeVisible();
    await expect(page.locator('text=Contato')).toBeVisible();
  });

  test('CTAs da página principal', async ({ page }) => {
    await expect(page.locator('text=Começar Gratuitamente')).toBeVisible();
    await expect(page.locator('text=Ver Planos')).toBeVisible();
    
    // Testar CTA principal
    await page.click('text=Começar Gratuitamente');
    await expect(page).toHaveURL('/register');
  });

  test('seção de estatísticas', async ({ page }) => {
    await expect(page.locator('text=98%')).toBeVisible();
    await expect(page.locator('text=Taxa de Satisfação')).toBeVisible();
    await expect(page.locator('text=500+')).toBeVisible();
    await expect(page.locator('text=Clientes Ativos')).toBeVisible();
  });
});
