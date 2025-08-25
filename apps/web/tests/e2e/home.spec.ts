import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should display hero section with CTAs', async ({ page }) => {
    await page.goto('/')

    // Check hero title
    await expect(page.getByRole('heading', { name: /Find Your Perfect Fit/i })).toBeVisible()

    // Check CTA buttons
    await expect(page.getByRole('link', { name: /Start Sizing/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Start Searching/i })).toBeVisible()

    // Check navigation works
    await page.click('text=Start Sizing')
    await expect(page).toHaveURL('/fit')

    await page.goto('/')
    await page.click('text=Start Searching')
    await expect(page).toHaveURL('/find')
  })

  test('should display features section', async ({ page }) => {
    await page.goto('/')

    // Check feature titles
    await expect(page.getByText('Smart Sizing')).toBeVisible()
    await expect(page.getByText('Visual Search')).toBeVisible()
    await expect(page.getByText('Brand Coverage')).toBeVisible()
  })
})
