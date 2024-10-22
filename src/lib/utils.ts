import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { format } from "date-fns"
import { Position } from "@/types"

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
  } as Position
}

export const formatDate = (dateString?: string) => {
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

export function checkEmptyRow(row: Position): boolean {
  const defaultValues = getEmptyRow(row.creator)

  for (const key in defaultValues) {
    if (
      key !== "creator" &&
      row[key as keyof Position] !== defaultValues[key as keyof Position]
    )
      return false
  }

  return true
}

export function checkAdmin(email: string) {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
  return adminEmails.includes(email.trim())
}
