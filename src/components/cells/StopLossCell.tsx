"use client"

import React, { useEffect, useState } from "react"
import { CellType } from "../position/columns"
import CurrencyInput from "react-currency-input-field"

const StopLossCell: React.FC<CellType> = ({ row, column, table }) => {
  const initialValue = (row.getValue(column.id) as string) || "0"
  const [stopLoss, setStopLoss] = useState<string>(initialValue)

  const positionType = row.getValue("positionType") as string
  const askPrice = row.getValue("askPrice") as number
  const quantity = row.getValue("quantity") as number
  const totalCost = row.getValue("cost") as number

  useEffect(() => {
    setStopLoss(initialValue)
  }, [initialValue])

  const updateData = table.options.meta?.updateData

  const handleBlur = () => {
    if (+initialValue === +stopLoss) return

    if (+stopLoss === 0) {
      updateData?.(row.index, {
        [column.id]: 0,
        expectedLoss: 0,
        expectedLossPercent: 0,
      })
      return
    }

    let expectedLoss = quantity * +stopLoss - quantity * askPrice
    expectedLoss = positionType === "buy" ? -expectedLoss : expectedLoss

    const expectedLossPercent = (expectedLoss / totalCost) * 100

    updateData?.(row.index, {
      [column.id]: +stopLoss,
      expectedLoss: Math.round(expectedLoss),
      expectedLossPercent: Math.round(expectedLossPercent),
    })
  }

  return (
    <CurrencyInput
      className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
      id={`stopLoss-${row.index}`}
      name="stopLoss"
      value={stopLoss}
      onValueChange={(value: any) => setStopLoss(value || "0")}
      onBlur={handleBlur}
      allowNegativeValue={false}
      decimalsLimit={2}
      prefix="$"
    />
  )
}

export default StopLossCell
