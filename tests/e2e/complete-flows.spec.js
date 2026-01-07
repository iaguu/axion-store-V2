import { test, expect } from '@playwright/test'

test.describe('Fluxo de Upsell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('deve exibir banner de upsell', async ({ page }) => {
    await expect(page.locator('text=OFERTA IMPERDÍVEL')).toBeVisible()
    await expect(page.locator('text=R$ 997/mês')).toBeVisible()
  })

  test('deve abrir modal ao clicar em serviço', async ({ page }) => {
    await page.click('text=Cards Marketplace')
    await expect(page.locator('text=Escolha seu plano Cards Marketplace')).toBeVisible()
  })

  test('deve redirecionar para checkout', async ({ page }) => {
    await page.click('text=Cards Marketplace')
    await page.click('text=Começar')
    await expect(page).toHaveURL(/.*checkout.*service=1.*plan=basic/)
  })
})

test.describe('Dashboard Usuário', () => {
  test.beforeEach(async ({ page }) => {
    // Mock login
    await page.goto('/login')
    await page.fill('[type="email"]', 'test@example.com')
    await page.fill('[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('deve exibir estatísticas', async ({ page }) => {
    await expect(page.locator('text=47')).toBeVisible()
    await expect(page.locator('text=12')).toBeVisible()
  })

  test('deve permitir navegação', async ({ page }) => {
    await page.click('text=Catálogo')
    await expect(page.locator('text=Catálogo')).toHaveClass(/text-yellow-500/)
  })
})

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Mock admin login
    await page.goto('/login')
    await page.fill('[type="email"]', 'axion_admin_2024')
    await page.fill('[type="password"]', 'AxionSecure@2024!#$')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')
  })

  test('deve exibir painel admin', async ({ page }) => {
    await expect(page.locator('text=Painel Administrativo')).toBeVisible()
  })

  test('deve exibir estatísticas admin', async ({ page }) => {
    await expect(page.locator('text=1.247')).toBeVisible()
  })
})

test.describe('Affiliate Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Mock affiliate login
    await page.goto('/login')
    await page.fill('[type="email"]', 'affiliate@example.com')
    await page.fill('[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.goto('/affiliate')
  })

  test('deve exibir painel afiliado', async ({ page }) => {
    await expect(page.locator('text=Painel de Afiliado')).toBeVisible()
  })

  test('deve exibir código afiliado', async ({ page }) => {
    await expect(page.locator('text=AXTESTUSER')).toBeVisible()
  })
})
