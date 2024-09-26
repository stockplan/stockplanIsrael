type val = string | number

/**
 * Ensures that the input value is a valid number.
 */
function safeNumber(value: any): number {
  const num = parseFloat(value)
  return isNaN(num) ? 0 : num
}

/**
 * Calculates the total cost of the position.
 * Formula: cost = askPrice * quantity
 */
export function calculateCost(askPrice: val, quantity: val): number {
  askPrice = safeNumber(askPrice)
  quantity = safeNumber(quantity)
  return askPrice * quantity
}

/**
 * Calculates the expected profit.
 * For 'buy' positions: (Exit Price - Ask Price) * Quantity
 * For 'sell' positions: (Ask Price - Exit Price) * Quantity
 */
export function calculateExpectedProfit(
  positionType: string,
  askPrice: val,
  exitPrice: val,
  quantity: val
): number {
  askPrice = safeNumber(askPrice)
  exitPrice = safeNumber(exitPrice)
  quantity = safeNumber(quantity)

  if (!exitPrice || !askPrice || !quantity) return 0

  const profitPerUnit =
    positionType === "buy" ? exitPrice - askPrice : askPrice - exitPrice
  const profit = profitPerUnit * quantity
  return Math.max(profit, 0)
}

/**
 * Calculates and formats the expected profit percentage.
 * Formula: (Expected Profit / Cost) * 100
 * Returns a formatted string with up to 2 decimal places.
 * If the result is an integer, it returns it as a whole number.
 * If it's a floating-point number, it rounds to 1 or 2 decimal places accordingly.
 *
 * @param {number} expectedProfit - The expected profit amount.
 * @param {number} cost - The total cost amount.
 * @returns {string} - The formatted expected profit percentage as a string.
 */
export function calculateExpectedProfitPercent(
  expectedProfit: number,
  cost: number
): number {
  expectedProfit = safeNumber(expectedProfit)
  cost = safeNumber(cost)
  let profitPercent = (expectedProfit / cost) * 100

  if (isNaN(profitPercent)) return 0

  let formattedProfitPercent = profitPercent.toString()

  if (profitPercent % 1 !== 0) {
    if (formattedProfitPercent.split(".")[1]?.length > 2) {
      formattedProfitPercent = profitPercent.toFixed(2)
    } else if (formattedProfitPercent.split(".")[1]?.length === 1) {
      formattedProfitPercent = profitPercent.toFixed(1)
    }
  }

  return +formattedProfitPercent
}

/**
 * Calculates the expected loss.
 * For 'buy' positions: (Ask Price - Stop Loss) * Quantity
 * For 'sell' positions: (Stop Loss - Ask Price) * Quantity
 */
export function calculateExpectedLoss(
  positionType: string,
  askPrice: val,
  stopLoss: val,
  quantity: val
): number {
  askPrice = safeNumber(askPrice)
  stopLoss = safeNumber(stopLoss)
  quantity = safeNumber(quantity)

  if (!quantity) return 0

  // Calculate the loss for 'buy' and 'sell' positions correctly
  const loss =
    positionType === "buy"
      ? (askPrice - stopLoss) * quantity
      : (stopLoss - askPrice) * quantity

  // Ensure loss is always negative
  return Math.min(0, loss)
}

/**
 * Calculates the expected loss percentage.
 * Formula: (Expected Loss / Cost) * 100
 */
export function calculateExpectedLossPercent(
  expectedLoss: number,
  cost: number
): number {
  expectedLoss = safeNumber(expectedLoss)
  cost = safeNumber(cost)
  if (!cost) return 0
  const lossPercent = (expectedLoss / cost) * 100

  if (isNaN(lossPercent)) return 0

  let formattedLossPercent = lossPercent.toString()

  if (lossPercent % 1 !== 0) {
    if (formattedLossPercent.split(".")[1]?.length > 2) {
      formattedLossPercent = lossPercent.toFixed(2)
    } else if (formattedLossPercent.split(".")[1]?.length === 1) {
      formattedLossPercent = lossPercent.toFixed(1)
    }
  }
  return +formattedLossPercent
}

/**
 * Calculates the exit price based on the desired profit percentage.
 * For 'buy' positions: Exit Price = Ask Price + (Desired Profit % * Cost) / (100 * Quantity)
 * For 'sell' positions: Exit Price = Ask Price - (Desired Profit % * Cost) / (100 * Quantity)
 */
export function calculateExitPriceFromProfitPercent(
  positionType: string,
  askPrice: val,
  desiredProfitPercent: val,
  cost: val,
  quantity: val
): number {
  askPrice = safeNumber(askPrice)
  quantity = safeNumber(quantity)
  cost = safeNumber(cost)
  desiredProfitPercent = safeNumber(desiredProfitPercent)

  if (!askPrice || !quantity || !cost) return 0

  const desiredProfit = (desiredProfitPercent / 100) * cost

  const newExitValue =
    positionType === "buy"
      ? desiredProfit / quantity + askPrice
      : askPrice - desiredProfit / quantity

  if (isNaN(newExitValue) && +newExitValue < 0) return 0

  return +newExitValue.toFixed(2)
}

export function calculateStopLossFromLossPercent(
  positionType: string,
  desiredLossPercent: val,
  cost: val,
  quantity: val,
  askPrice: val
): number {
  quantity = safeNumber(quantity)
  cost = safeNumber(cost)
  desiredLossPercent = safeNumber(desiredLossPercent)
  askPrice = safeNumber(askPrice)

  if (!askPrice || !quantity || !cost) return 0

  // Calculate desired loss from the percentage
  const desiredLoss = (desiredLossPercent / 100) * cost

  // Calculate the stop loss based on the position type
  let stopLoss =
    positionType === "buy"
      ? askPrice - desiredLoss / quantity
      : askPrice + desiredLoss / quantity

  stopLoss =
    positionType === "buy"
      ? Math.max(stopLoss, 0)
      : Math.max(stopLoss, askPrice)

  return +stopLoss.toFixed(2)
}
