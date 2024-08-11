import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEmptyRow(creator: string = "") {
  return {
    ticker: "",
    positionType: "buy",
    quantity: 0,
    actualPrice: 0,
    askPrice: 0,
    cost: 0,
    exitPrice: 0,
    expectedProfit: 0,
    expectedProfitPercent: 0,
    stopLoss: 0,
    expectedLoss: 0,
    expectedLossPercent: 0,
    creator,
  }
}

export const formatDate = (dateString: any) => {
  if (!dateString) return "N/A"

  try {
    return format(new Date(dateString), "PPpp")
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__")
}
