"use client"

import React, { useState, useEffect } from "react"
import CurrencyInput from "react-currency-input-field"
import { CellType } from "../position/columns"

const ExpectedProfitPercentCell: React.FC<CellType> = ({
  row,
  column,
  table,
}) => {
  const initialData = row.getValue(column.id) as string
  const quantity = row.getValue("quantity") as number
  const askPrice = row.getValue("askPrice") as number
  const totalCost = row.getValue("cost") as number
  const expectedProfit = row.getValue("expectedProfit") as number
  const ticker = row.getValue("ticker") as string
  const exitPrice = row.getValue("exitPrice") as number

  const updateData = table.options.meta?.updateData

  const calculateProfitPercent = () => {
    if (!totalCost || !ticker || !exitPrice || !quantity || !askPrice)
      return "0"
    const res = (expectedProfit / totalCost) * 100
    return Math.round(res).toString()
  }

  const [profitPercent, setProfitPercent] = useState(initialData)

  useEffect(() => {
    const newProfitPercent = calculateProfitPercent()

    if (newProfitPercent !== profitPercent) {
      setProfitPercent(newProfitPercent)
      // updateData?.(row.index, { [column.id]: +newProfitPercent })
    }
  }, [expectedProfit, initialData])

  const handleBlur = () => {
    if (+initialData === +profitPercent) return
    const newExpectedProfit = (+profitPercent * totalCost) / 100
    const newExitPrice = newExpectedProfit / quantity + askPrice

    updateData?.(row.index, {
      [column.id]: +profitPercent,
      expectedProfit: +newExpectedProfit,
      exitPrice: newExitPrice,
    })
  }

  return (
    <CurrencyInput
      allowDecimals={false}
      allowNegativeValue={false}
      suffix="%"
      className="flex h-9 w-24 text-center border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm  text-green-500"
      value={profitPercent}
      onValueChange={(value) => setProfitPercent(value || "0")}
      onBlur={handleBlur}
    />
  )
}

export default ExpectedProfitPercentCell
