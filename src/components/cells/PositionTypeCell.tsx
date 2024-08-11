"use client"

import React from "react"
import { CellType } from "../position/columns"

const PositionTypeCell: React.FC<CellType> = ({ row, column, table }) => {
  const positionType = row.getValue(column.id) as string
  const updateData = table.options.meta?.updateData

  // const expectedLoss = row.getValue("expectedLoss")
  // const expectedLossPercent = row.getValue("expectedLossPercent")
  const quantity = row.getValue("quantity") as number
  const askPrice = row.getValue("askPrice") as number
  const exitPrice = row.getValue("exitPrice") as number
  const stopLoss = row.getValue("stopLoss") as number
  const cost = row.getValue("cost") as number

  const chooseSell = () => {
    //prettier-ignore
    const expProfit = Math.max((+exitPrice * quantity - askPrice * quantity) * -1, 0)
    const expectedProfitPercent = (expProfit / cost) * 100
    updateData?.(row.index, {
      [column.id]: "sell",
      expectedProfit: +expProfit,
      expectedProfitPercent: +expectedProfitPercent,
    })
  }

  const chooseBuy = () => {
    const expProfit = Math.max(+exitPrice * quantity - askPrice * quantity, 0)
    const expectedProfitPercent = (expProfit / cost) * 100

    updateData?.(row.index, {
      [column.id]: "buy",
      expectedProfit: +expProfit,
      expectedProfitPercent: +expectedProfitPercent,
    })
  }

  return (
    <div className="flex gap-2 w-28 items-center justify-center">
      <button
        className={`px-2 py-1 rounded text-white ${
          positionType === "buy" ? "bg-green-500" : "bg-gray-400"
        }`}
        onClick={chooseBuy}
      >
        Buy
      </button>
      <button
        className={`px-2 py-1 rounded text-white ${
          positionType === "sell" ? "bg-red-500" : "bg-gray-400"
        }`}
        onClick={chooseSell}
      >
        Sell
      </button>
    </div>
  )
}

export default PositionTypeCell
