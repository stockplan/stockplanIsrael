import { NumberFormatValues } from "react-number-format"

type val = string | number

function safeNumber(value: any): number {
  // Validate that value is either a string or a number
  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error("Invalid input: value must be a string or number.")
  }

  // Convert to number and validate if it's finite and not NaN
  const num = Number(value)

  if (isNaN(num) || !isFinite(num)) {
    return 0
  }

  // Return integers as they are
  if (Number.isInteger(num)) return num

  // Split integer and decimal parts to check decimal length
  const decimalPart = num.toString().split(".")[1]

  // Return as-is if there is only one decimal place
  if (decimalPart && decimalPart.length === 1) return num

  // Round to two decimal places if there are more than two decimal places
  return Math.round(num * 100) / 100
}

export function calculateCost(askPrice: val, quantity: val): number {
  return safeNumber(askPrice) * safeNumber(quantity)
}

export function calculateExpectedProfit(positionType: string, askPrice: val, exitPrice: val, quantity: val): number {
  askPrice = safeNumber(askPrice)
  exitPrice = safeNumber(exitPrice)
  quantity = safeNumber(quantity)

  if (!exitPrice || !askPrice || !quantity) return 0

  //prettier-ignore
  const profitPerUnit =  positionType === "buy" ? exitPrice - askPrice : askPrice - exitPrice

  let profit = profitPerUnit * quantity
  return profit
}

export function calculateExpectedProfitPercent(expectedProfit: number, cost: number): number {
  expectedProfit = safeNumber(expectedProfit)
  cost = safeNumber(cost)
  let profitPercent = (expectedProfit / cost) * 100
  return safeNumber(profitPercent)
}

export function calculateExpectedLoss(positionType: string, askPrice: val, stopLoss: val, quantity: val): number {
  askPrice = safeNumber(askPrice)
  stopLoss = safeNumber(stopLoss)
  quantity = safeNumber(quantity)

  if (!quantity || !stopLoss || !askPrice) return 0

  const loss = positionType === "sell" ? (askPrice - stopLoss) * quantity : (stopLoss - askPrice) * quantity

  return loss
}

export function calculateExpectedLossPercent(expectedLoss: number, cost: number): number {
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

  let exitPrice: number

  if (positionType === "buy") {
    exitPrice = askPrice + expectedProfit / quantity
  } else {
    const profitPercent = expectedProfit / (askPrice * quantity)
    exitPrice = askPrice * (1 - profitPercent)
  }
  return safeNumber(exitPrice)
}

export function calculateStopLossFromLossPercent(newExpectedLoss: val, quantity: val, askPrice: val): number {
  quantity = safeNumber(quantity)
  newExpectedLoss = safeNumber(newExpectedLoss)
  askPrice = safeNumber(askPrice)

  if (!quantity || !newExpectedLoss) return askPrice

  // Stop Loss = (Expected Loss / Quantity) + Ask Price
  let newStopLoss = newExpectedLoss / quantity + askPrice
  return safeNumber(newStopLoss)
}

export function formatFractionDigits(num?: number | null): string {
  if (num) {
    num = safeNumber(num)
    return String(num)
  }
  return "0"
}

export function allowNegativeValue(values: NumberFormatValues) {
  if (+values.value < 0 || values.value.startsWith("-")) return false
  return true
}

export function compareNumbers(num1: number, num2: number): boolean {
  // Validation for finite numbers only
  if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
    throw new Error("Invalid input: both inputs must be finite numbers.")
  }

  // Format both numbers to two decimal places by using a toFixed string comparison
  const formattedNum1 = num1.toFixed(2)
  const formattedNum2 = num2.toFixed(2)

  // Comparing the formatted values
  return formattedNum1 === formattedNum2
}

export function extractNegationAndNumber(value: val) {
  const NEGATION_FORMAT_REGEX = /^\((.*)\)$/
  let hasNegation = false
  if (typeof value === "number") {
    hasNegation = value < 0
    value = hasNegation ? value * -1 : value
  } else if (value?.[0] === "-") {
    hasNegation = true
    value = value.substring(1)
  } else if (value?.match(NEGATION_FORMAT_REGEX)) {
    hasNegation = true
    value = value.replace(NEGATION_FORMAT_REGEX, "$1")
  }

  return { hasNegation, value } as { hasNegation: boolean; value: number }
}
