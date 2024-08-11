import { expect, test } from "@playwright/test"

// פונקציה להמרת מספר לפורמט עם פסיקים
function formatNumberWithCommas(number: any) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto("https://www.stocksplan.com/home")
  await page.getByLabel("Email").fill("admin@admin.com")
  await page.getByLabel("Password").fill("adminadmin")
  await page.getByRole("button", { name: "Login" }).click()
})

test("Validate cost", async ({ page }) => {
  await expect(page).toHaveURL("https://www.stocksplan.com/position")
  await page.fill("#quantity-0", "100")
  await page.fill("#askPrice-0", "60")

  const quantity = 100
  const askPrice = 60
  const totalCost = quantity * askPrice

  // נוודא שהערך מתעדכן באמצעות שימוש ב-waitForFunction
  await page.waitForFunction((totalCostFormatted) => {
    const element = document.querySelector(
      "#row_0 td:nth-child(6) .text-center"
    )
    return element && element.textContent === totalCostFormatted
  }, `$${formatNumberWithCommas(totalCost)}`)

  await expect(page.locator("#row_0 td:nth-child(6) .text-center")).toHaveText(
    `$${formatNumberWithCommas(totalCost)}`
  )
})

// test("validate stock calculations", async ({ page }) => {
//   // נוודא שאנו בדף הנכון לאחר ההתחברות
//   await expect(page).toHaveURL("https://www.stocksplan.com/position")

//   // נזין ערכים בשדות השורה הראשונה
//   await page.fill("#quantity-0", "100")
//   await page.fill("#askPrice-0", "60")
//   await page.fill("#exitPrice-0", "70")
//   await page.fill("#stopLoss-0", "50")

//   // נחשב את התוצאות הצפויות
//   const quantity = 100
//   const askPrice = 60
//   const actualPrice = 25 // ערך נתון (מתעדכן ע"י הטיקר)
//   const exitPrice = 70
//   const stopLoss = 50
//   const totalCost = quantity * askPrice
//   const expectedProfit = (exitPrice - askPrice) * quantity
//   const expectedProfitPercent = (expectedProfit / (quantity * askPrice)) * 100
//   const expectedLoss = (askPrice - stopLoss) * quantity
//   const expectedLossPercent = (expectedLoss / (quantity * askPrice)) * 100

//   // נאמת את החישובים בתאים הרלוונטיים
//   await expect(page.locator("#row_0 td:nth-child(6) .text-center")).toHaveText(
//     `$${formatNumberWithCommas(totalCost)}`
//   )
//   await expect(page.locator("#row_0 td:nth-child(8) .text-center")).toHaveText(
//     `$${formatNumberWithCommas(expectedProfit)}`
//   )
//   await expect(page.locator("#row_0 td:nth-child(9) .text-center")).toHaveValue(
//     `${expectedProfitPercent.toFixed(2)}%`
//   )
//   await expect(page.locator("#row_0 td:nth-child(11) .text-center")).toHaveText(
//     `$${formatNumberWithCommas(expectedLoss)}`
//   )
//   await expect(
//     page.locator("#row_0 td:nth-child(12) .text-center")
//   ).toHaveValue(`${expectedLossPercent.toFixed(2)}%`)
// })
