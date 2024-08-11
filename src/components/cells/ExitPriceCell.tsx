"use client"

import React, { useState, useEffect } from "react"
import CurrencyInput from "react-currency-input-field"
import { CellType } from "../position/columns"

const ExitPriceCell: React.FC<CellType> = ({ row, column, table }) => {
  const defaultValue = (row.getValue(column.id) as string) || "0"
  const [exitPrice, setExitPrice] = useState<string>(defaultValue)

  const positionType = row.getValue("positionType") as string
  const quantity = row.getValue("quantity") as number
  const askPrice = row.getValue("askPrice") as number
  const totalCost = row.getValue("cost") as number

  useEffect(() => {
    setExitPrice(defaultValue)
  }, [defaultValue])

  const updateData = table.options.meta?.updateData

  const handleBlurExitPrice = () => {
    if (+defaultValue === +exitPrice) return

    // Calculate Expected Profit
    const calc = +exitPrice * quantity - askPrice * quantity
    const expectedProfit = positionType === "buy" ? calc : calc * -1

    const expectedProfitPercent = (expectedProfit / totalCost) * 100

    // Update Exit Price and Expected Profit in one go
    updateData?.(row.index, {
      [column.id]: +exitPrice,
      expectedProfit: Math.max(Math.round(expectedProfit), 0),
      expectedProfitPercent: Math.round(expectedProfitPercent),
    })
  }

  return (
    <CurrencyInput
      className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
      id={`exitPrice-${row.index}`}
      value={exitPrice}
      onValueChange={(value: any) => setExitPrice(value || "0")}
      onBlur={handleBlurExitPrice}
      decimalsLimit={2}
      allowNegativeValue={false}
      prefix="$"
    />
  )
}

export default ExitPriceCell
