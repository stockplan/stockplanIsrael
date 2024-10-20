import { test, expect } from "@playwright/test"

test.describe("Profit and Loss Calculator Tests", () => {
  test("should calculate cost, expected profit, expected profit percent, expected loss, and expected loss percent correctly for Buy position", async ({
    page,
  }) => {
    // נווט לעמוד המחשבון
    await page.goto("/calculator/lossprofit")

    // איתור השדות והאלמנטים
    const quantityInput = page.locator("input#quantity-0")
    const askPriceInput = page.locator("input#askPrice-0")
    const exitPriceInput = page.locator("input#exitPrice-0")
    const expectedProfitElement = page.locator('[id="0_expectedProfit"] div')
    const expectedProfitPercentInput = page.locator(
      '[id="0_expectedProfitPercent"] input'
    )
    const stopLossInput = page.locator("input#stopLoss-0")
    const expectedLossElement = page.locator('[id="0_expectedLoss"] div')
    const expectedLossPercentInput = page.locator(
      '[id="0_expectedLossPercent"] input'
    )
    const costElement = page.locator('[id="0_cost"] div')

    // מילוי השדות Quantity, Ask Price, ו-Exit Price
    await quantityInput.click()
    await quantityInput.fill("10")
    await quantityInput.blur()

    await askPriceInput.click()
    await askPriceInput.fill("15")
    await askPriceInput.blur()

    await exitPriceInput.click()
    await exitPriceInput.fill("20")
    await exitPriceInput.blur()

    // המתנה להתעדכנות החישובים
    await page.waitForTimeout(500)

    // בדיקת חישוב Cost
    await expect(costElement).toHaveText("$150") // 10 * 15 = 150

    // בדיקת חישוב Expected Profit
    await expect(expectedProfitElement).toHaveText("$50") // (20 - 15) * 10 = 50

    // בדיקת חישוב Expected Profit Percent
    await expect(expectedProfitPercentInput).toHaveValue("33%") // (50 / 150) * 100 = 33%

    // מילוי Stop Loss
    await stopLossInput.click()
    await stopLossInput.fill("12")
    await stopLossInput.blur()

    // המתנה להתעדכנות החישובים
    await page.waitForTimeout(500)

    // בדיקת חישוב Expected Loss
    await expect(expectedLossElement).toHaveText("-$30") // (12 - 15) * 10 = -30

    // בדיקת חישוב Expected Loss Percent
    await expect(expectedLossPercentInput).toHaveValue("-20%") // (-30 / 150) * 100 = -20%

    // שינוי Expected Profit Percent ובדיקת עדכונים
    await expectedProfitPercentInput.click()
    await expectedProfitPercentInput.fill("40")
    await expectedProfitPercentInput.blur()

    // המתנה להתעדכנות החישובים
    await page.waitForTimeout(500)

    await expect(expectedProfitElement).toHaveText("$60") // (40% * 150) / 100 = 60
    await expect(exitPriceInput).toHaveValue("$21") // (60 / 10) + 15 = 21

    // שינוי Expected Loss Percent ובדיקת עדכונים
    await expectedLossPercentInput.click()
    await expectedLossPercentInput.fill("10")
    await expectedLossPercentInput.blur()

    // המתנה להתעדכנות החישובים
    await page.waitForTimeout(500)

    await expect(expectedLossElement).toHaveText("-$15") // (-10% * 150) / 100 = -15
    await expect(stopLossInput).toHaveValue("$13.5") // (-15 / 10) + 15 = 13.5
  })

  test("should calculate cost, expected profit, expected profit percent, expected loss, and expected loss percent correctly for Sell position", async ({
    page,
  }) => {
    // נווט לעמוד המחשבון
    await page.goto("/calculator/lossprofit")

    // איתור השדות והאלמנטים
    const quantityInput = page.locator("input#quantity-0")
    const askPriceInput = page.locator("input#askPrice-0")
    const exitPriceInput = page.locator("input#exitPrice-0")
    const expectedProfitElement = page.locator('[id="0_expectedProfit"] div')
    const expectedProfitPercentInput = page.locator(
      '[id="0_expectedProfitPercent"] input'
    )
    const stopLossInput = page.locator("input#stopLoss-0")
    const expectedLossElement = page.locator('[id="0_expectedLoss"] div')
    const expectedLossPercentInput = page.locator(
      '[id="0_expectedLossPercent"] input'
    )
    const costElement = page.locator('[id="0_cost"] div')

    // מעבר למצב Sell
    const sellButton = page.locator('[id="0_positionType"] button', {
      hasText: "Sell",
    })
    await sellButton.click()

    // מילוי השדות Quantity, Ask Price, ו-Exit Price
    await quantityInput.click()
    await quantityInput.fill("10")
    await quantityInput.blur()

    await askPriceInput.click()
    await askPriceInput.fill("20")
    await askPriceInput.blur()

    await exitPriceInput.click()
    await exitPriceInput.fill("15")
    await exitPriceInput.blur()

    // המתנה להתעדכנות החישובים
    await page.waitForTimeout(500)

    // בדיקת חישוב Cost
    await expect(costElement).toHaveText("$200") // 10 * 20 = 200

    // בדיקת חישוב Expected Profit
    await expect(expectedProfitElement).toHaveText("$50") // (20 - 15) * 10 = 50

    // בדיקת חישוב Expected Profit Percent
    await expect(expectedProfitPercentInput).toHaveValue("25%") // (50 / 200) * 100 = 25%

    // מילוי Stop Loss
    await stopLossInput.click()
    await stopLossInput.fill("22")
    await stopLossInput.blur()

    // המתנה להתעדכנות החישובים
    await page.waitForTimeout(500)

    // בדיקת חישוב Expected Loss
    await expect(expectedLossElement).toHaveText("-$20") // (20 - 22) * 10 = -20

    // בדיקת חישוב Expected Loss Percent
    await expect(expectedLossPercentInput).toHaveValue("-10%") // (-20 / 200) * 100 = -10%

    // שינוי Expected Profit Percent ובדיקת עדכונים
    await expectedProfitPercentInput.click()
    await expectedProfitPercentInput.fill("30")
    await expectedProfitPercentInput.blur()

    // המתנה להתעדכנות החישובים
    await page.waitForTimeout(500)

    await expect(expectedProfitElement).toHaveText("$60") // (30% * 200) / 100 = 60
    await expect(exitPriceInput).toHaveValue("$14") // 20 - (60 / 10) = 14

    // שינוי Expected Loss Percent ובדיקת עדכונים
    await expectedLossPercentInput.click()
    await expectedLossPercentInput.fill("15")
    await expectedLossPercentInput.blur()

    // המתנה להתעדכנות החישובים
    await page.waitForTimeout(500)

    await expect(expectedLossElement).toHaveText("-$30") // (-15% * 200) / 100 = -30
    await expect(stopLossInput).toHaveValue("$23") // 20 - (-30 / 10) = 23
  })
})
