import { test, expect } from '@playwright/test';

test.describe('Admin Panel E2E Tests', () => {
  test('acesso ao painel administrativo', async ({ page }) => {
    await page.goto('/admin');
    
    // Verifica se carrega o painel admin
    await expect(page.locator('text=Painel Administrativo')).toBeVisible();
    await expect(page.locator('text=Dashboard Admin')).toBeVisible();
  });

  test('estatísticas administrativas', async ({ page }) => {
    await page.goto('/admin');
    
    // Verificar estatísticas principais
    await expect(page.locator('text=Total de Usuários')).toBeVisible();
    await expect(page.locator('text=Usuários Ativos')).toBeVisible();
    await expect(page.locator('text=Receita Mensal')).toBeVisible();
    await expect(page.locator('text=Cards Criados')).toBeVisible();
  });

  test('gestão de usuários', async ({ page }) => {
    await page.goto('/admin');
    
    // Navegar para gestão de usuários
    await page.click('text=Gerenciar Usuários');
    
    // Verificar tabela de usuários
    await expect(page.locator('text=Lista de Usuários')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    
    // Verificar colunas
    await expect(page.locator('text=ID')).toBeVisible();
    await expect(page.locator('text=Nome')).toBeVisible();
    await expect(page.locator('text=Email')).toBeVisible();
    await expect(page.locator('text=Plano')).toBeVisible();
    await expect(page.locator('text=Status')).toBeVisible();
    await expect(page.locator('text=Ações')).toBeVisible();
  });

  test('ações de usuário', async ({ page }) => {
    await page.goto('/admin');
    await page.click('text=Gerenciar Usuários');
    
    // Encontrar primeiro usuário e testar ações
    const firstUserRow = page.locator('tbody tr').first();
    await expect(firstUserRow).toBeVisible();
    
    // Testar botão de suspender/ativar
    const toggleButton = firstUserRow.locator('button').first();
    await expect(toggleButton).toBeVisible();
    
    // Testar botão de editar
    const editButton = firstUserRow.locator('button').nth(1);
    await expect(editButton).toBeVisible();
  });

  test('sistema de alertas', async ({ page }) => {
    await page.goto('/admin');
    
    // Verificar se há seção de alertas
    await expect(page.locator('text=Alertas do Sistema')).toBeVisible();
    
    // Verificar tipos de alerta
    await expect(page.locator('text=Críticos')).toBeVisible();
    await expect(page.locator('text=Avisos')).toBeVisible();
    await expect(page.locator('text=Informações')).toBeVisible();
  });

  test('exportação de dados', async ({ page }) => {
    await page.goto('/admin');
    
    // Testar exportação de usuários
    await page.click('text=Exportar Dados');
    
    // Verificar opções de exportação
    await expect(page.locator('text=Exportar Usuários')).toBeVisible();
    await expect(page.locator('text=Exportar Cards')).toBeVisible();
    await expect(page.locator('text=Exportar Analytics')).toBeVisible();
    
    // Testar exportação (simulação)
    await page.click('text=Exportar Usuários');
    
    // Verificar mensagem de sucesso
    await expect(page.locator('text=Exportação iniciada')).toBeVisible();
  });

  test('relatórios administrativos', async ({ page }) => {
    await page.goto('/admin');
    
    // Navegar para relatórios
    await page.click('text=Relatórios');
    
    // Verificar tipos de relatórios
    await expect(page.locator('text=Relatório de Usuários')).toBeVisible();
    await expect(page.locator('text=Relatório de Receita')).toBeVisible();
    await expect(page.locator('text=Relatório de Uso')).toBeVisible();
  });

  test('configurações do sistema', async ({ page }) => {
    await page.goto('/admin');
    
    // Navegar para configurações
    await page.click('text=Configurações');
    
    // Verificar opções de configuração
    await expect(page.locator('text=Configurações Gerais')).toBeVisible();
    await expect(page.locator('text=Configurações de Email')).toBeVisible();
    await expect(page.locator('text=Configurações de Pagamento')).toBeVisible();
  });

  test('busca e filtros de usuários', async ({ page }) => {
    await page.goto('/admin');
    await page.click('text=Gerenciar Usuários');
    
    // Testar campo de busca
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    await expect(searchInput).toBeVisible();
    
    // Preencher busca
    await searchInput.fill('demo');
    await page.waitForTimeout(500);
    
    // Verificar se os resultados são filtrados
    const filteredResults = page.locator('tbody tr');
    await expect(filteredResults.first()).toBeVisible();
  });

  test('responsividade do painel admin', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin');
    
    // Menu mobile deve estar adaptado
    await expect(page.locator('text=Painel Administrativo')).toBeVisible();
    
    // Verificar se as estatísticas se adaptam
    await expect(page.locator('text=Total de Usuários')).toBeVisible();
  });
});
