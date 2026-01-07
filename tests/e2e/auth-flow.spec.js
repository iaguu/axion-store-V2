import { test, expect } from '@playwright/test';

test.describe('Authentication Flow E2E Tests', () => {
  test('fluxo completo de registro', async ({ page }) => {
    await page.goto('/register');
    
    // Preencher formulário de registro
    await page.fill('input[placeholder="Seu nome completo"]', 'Usuário Teste');
    await page.fill('input[placeholder="seu@email.com"]', 'teste@exemplo.com');
    await page.fill('input[placeholder="••••••••"]', 'senha123');
    
    // Aceitar termos
    await page.check('input[type="checkbox"]');
    
    // Submeter formulário
    await page.click('text=Criar Conta');
    
    // Aguardar redirecionamento
    await page.waitForURL('/dashboard');
    
    // Verificar se está no dashboard
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Usuário Teste')).toBeVisible();
  });

  test('fluxo de login com credenciais demo', async ({ page }) => {
    await page.goto('/login');
    
    // Preencher com credenciais demo
    await page.fill('input[placeholder="seu@email.com"]', 'demo@axionstore.com');
    await page.fill('input[placeholder="••••••••"]', 'demo123');
    
    // Submeter formulário
    await page.click('text=Entrar');
    
    // Aguardar processamento
    await page.waitForTimeout(2000);
    
    // Verificar redirecionamento
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('funcionalidade de mostrar/ocultar senha', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.locator('input[placeholder="••••••••"]');
    const toggleButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    
    // Verificar tipo inicial
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Clicar para mostrar senha
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Clicar para ocultar senha
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('validação de formulário de login', async ({ page }) => {
    await page.goto('/login');
    
    // Tentar submeter formulário vazio
    await page.click('text=Entrar');
    
    // Verificar se há validação (campos obrigatórios)
    await expect(page.locator('input[placeholder="seu@email.com"]')).toBeFocused();
  });

  test('navegação entre login e registro', async ({ page }) => {
    await page.goto('/login');
    
    // Navegar para registro
    await page.click('text=Criar conta gratuita');
    await expect(page).toHaveURL('/register');
    
    // Voltar para login
    await page.click('text=Já tem uma conta?');
    await expect(page).toHaveURL('/login');
  });

  test('logout do dashboard', async ({ page }) => {
    // Fazer login primeiro
    await page.goto('/login');
    await page.fill('input[placeholder="seu@email.com"]', 'demo@axionstore.com');
    await page.fill('input[placeholder="••••••••"]', 'demo123');
    await page.click('text=Entrar');
    await page.waitForTimeout(2000);
    
    // Realizar logout
    await page.click('text=Sair');
    
    // Verificar redirecionamento
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Começar')).toBeVisible();
  });

  test('acesso negado a rotas protegidas sem autenticação', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Deve redirecionar para login
    await expect(page).toHaveURL('/login');
  });
});
