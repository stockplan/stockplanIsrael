type val = string | number

function safeNumber(value: any): number {
  const num = parseFloat(value)
  return isNaN(num) ? 0 : num
}

export function calculateCost(askPrice: val, quantity: val): number {
  return safeNumber(askPrice) * safeNumber(quantity)
}

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

  //prettier-ignore
  const profitPerUnit =  positionType === "buy" ? exitPrice - askPrice : askPrice - exitPrice

  let profit = profitPerUnit * quantity
  return profit
}

export function calculateExpectedProfitPercent(
  expectedProfit: number,
  cost: number
): number {
  expectedProfit = safeNumber(expectedProfit)
  cost = safeNumber(cost)
  let profitPercent = (expectedProfit / cost) * 100
  return safeNumber(profitPercent)
}

export function calculateExpectedLoss(
  positionType: string,
  askPrice: val,
  stopLoss: val,
  quantity: val
): number {
  askPrice = safeNumber(askPrice)
  stopLoss = safeNumber(stopLoss)
  quantity = safeNumber(quantity)

  if (!quantity || !stopLoss || !askPrice) return 0

  const loss =
    positionType === "sell"
      ? (askPrice - stopLoss) * quantity
      : (stopLoss - askPrice) * quantity

  return loss
}

export function calculateExpectedLossPercent(
  expectedLoss: number,
  cost: number
): number {
  expectedLoss = safeNumber(expectedLoss)
  cost = safeNumber(cost)
  if (!cost) return 0
  const lossPercent = (expectedLoss / cost) * 100
  return safeNumber(lossPercent)
}

export function calculateExitPriceFromProfitPercent(
  positionType: string,
  askPrice: val,
  expectedProfit: val,
  quantity: val
): number {
  askPrice = safeNumber(askPrice)
  expectedProfit = safeNumber(expectedProfit)
  quantity = safeNumber(quantity)

  if (expectedProfit === 0 || quantity === 0) return askPrice
  // let exitPrice = expectedProfit / quantity + askPrice
  let exitPrice = 0
  if (positionType === "buy") {
    exitPrice = expectedProfit / quantity + askPrice
  } else if (positionType === "sell") {
    const profitPerUnit = expectedProfit / quantity
    exitPrice = askPrice * (1 - profitPerUnit / askPrice)
  }

  return safeNumber(exitPrice)
}

export function calculateStopLossFromLossPercent(
  newExpectedLoss: val,
  quantity: val,
  askPrice: val
): number {
  quantity = safeNumber(quantity)
  newExpectedLoss = safeNumber(newExpectedLoss)
  askPrice = safeNumber(askPrice)

  if (!quantity || !newExpectedLoss) return askPrice

  // Stop Loss = (Expected Loss / Quantity) + Ask Price
  let newStopLoss = newExpectedLoss / quantity + askPrice
  return safeNumber(newStopLoss)
}
