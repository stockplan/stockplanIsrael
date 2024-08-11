"use client"

import React, { useState, useEffect } from "react"
import CurrencyInput from "react-currency-input-field"
import { CellType } from "../position/columns"

const ExpectedLossPercentCell: React.FC<CellType> = ({
  row,
  column,
  table,
}) => {
  const initialData = row.getValue(column.id) as string
  const quantity = row.getValue("quantity") as number
  const askPrice = row.getValue("askPrice") as number
  const stopLoss = row.getValue("stopLoss") as number
  const expectedLoss = row.getValue("expectedLoss") as number
  const totalCost = row.getValue("cost") as number
  const ticker = row.getValue("ticker") as string

  const positionType = row.getValue("positionType") as string
  const updateData = table.options.meta?.updateData

  const calcLossPercent = (): string => {
    if (!totalCost || !quantity || !ticker || !askPrice || !+expectedLoss)
      return "0"
    const res = (expectedLoss / totalCost) * 100
    return Math.round(res).toString()
  }

  const [lossPercent, setLossPercent] = useState(initialData)

  useEffect(() => {
    const updatedLossPercent = calcLossPercent()

    if (+updatedLossPercent !== +lossPercent) {
      setLossPercent(updatedLossPercent)
    }
  }, [expectedLoss, totalCost, quantity, ticker, askPrice, stopLoss])

  const handleBlur = () => {
    if (+initialData === +lossPercent || +stopLoss === 0) return

    const absoluteLoss = Math.abs(+lossPercent)

    // (-1) * (Expected Loss % * total cost / 100
    const newExpectedLoss = ((+absoluteLoss * totalCost) / 100) * -1

    //                   (Expected Loss / Quantity) + Ask Price
    const newStopLoss1 = Math.abs(newExpectedLoss) / quantity + askPrice
    //prettier-ignore
    let newStopLoss = positionType === "sell" ? Math.abs(newExpectedLoss) / quantity + askPrice : newExpectedLoss / quantity + askPrice

    newStopLoss = Math.max(newStopLoss, 0)

    updateData?.(row.index, {
      expectedLossPercent: +lossPercent,
      expectedLoss: Math.round(newExpectedLoss),
      stopLoss: +newStopLoss,
    })
  }

  const prefix = +lossPercent > 0 ? "-" : ""

  return (
    <CurrencyInput
      allowDecimals={false}
      allowNegativeValue={false}
      suffix="%"
      prefix={prefix}
      className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm text-red-500"
      value={lossPercent}
      onValueChange={(value: any) => setLossPercent(value || "0")}
      onBlur={handleBlur}
    />
  )
}

export default ExpectedLossPercentCell
