"use client"

import React, { useEffect, useState } from "react"
import { CellType } from "../position/columns"

const ExpectedProfitCell: React.FC<CellType> = ({ row, column, table }) => {
  const defaultValue = row.getValue(column.id) as number

  const positionType = row.getValue("positionType") as string
  const exitPrice = row.getValue("exitPrice") as number
  const quantity = row.getValue("quantity") as number
  const askPrice = row.getValue("askPrice") as number
  const cost = row.getValue("cost") as number

  const calculateExpectedProfit = () => {
    if (!exitPrice) return 0
    const calc = exitPrice * quantity - askPrice * quantity
    if (positionType === "buy") {
      return Math.round(calc)
    }
    return Math.round(calc) * -1
  }

  const updateData = table.options.meta?.updateData

  useEffect(() => {
    let updatedProfit = Math.max(calculateExpectedProfit(), 0)
    let updatedProfitPer = Math.round((updatedProfit / cost) * 100)

    if (defaultValue !== updatedProfit) {
      updateData?.(row.index, {
        [column.id]: +updatedProfit,
        expectedProfitPercent: +updatedProfitPer,
      })
    }
  }, [defaultValue, exitPrice, quantity, askPrice])

  // const displayProfit = Math.max(calculateExpectedProfit(), 0)

  const formattedProfit = (defaultValue || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })

  return (
    <div className="text-center w-24 text-green-500">${formattedProfit}</div>
  )
}

export default ExpectedProfitCell
