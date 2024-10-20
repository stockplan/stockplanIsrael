import { test, expect } from "@playwright/test"

test("should calculate cost, expected profit, and expected profit percentage correctly", async ({
  page,
}) => {
  // Navigate to the calculator page
  await page.goto("/calculator/lossprofit")

  // Set values for Quantity, Ask Price, and Exit Price
  const quantityInput = page.locator('input[id="quantity-0"]')
  const askPriceInput = page.locator('input[id="askPrice-0"]')
  const exitPriceInput = page.locator('input[id="exitPrice-0"]')

  // Fill values
  await quantityInput.fill("10")
  await askPriceInput.fill("15")
  await exitPriceInput.fill("20")

  // Verify the Cost calculation (Cost = Quantity * Ask Price)
  const costElement = page.locator("#0_cost div")
  await expect(costElement).toHaveText("$150") // 10 * 15 = 150

  // Verify the Expected Profit calculation (Expected Profit = (Exit Price - Ask Price) * Quantity)
  const expectedProfitElement = page.locator("#0_expectedProfit div")
  await expect(expectedProfitElement).toHaveText("$50") // (20 - 15) * 10 = 50

  // Verify the Expected Profit % calculation ((Expected Profit / Cost) * 100)
  const expectedProfitPercentInput = page.locator(
    "#0_expectedProfitPercent input"
  )
  await expect(expectedProfitPercentInput).toHaveValue("33.33%") // (50 / 150) * 100 = 33.33
})
