"use client"

import { useEffect } from "react"
import { CellType } from "../position/columns"

const ExpectedLossCell: React.FC<CellType> = ({ row, column, table }) => {
  const initialValue = row.getValue(column.id) as number
  const positionType = row.getValue("positionType") as string
  const quantity = row.getValue("quantity") as number
  const askPrice = row.getValue("askPrice") as number
  const stopLoss = row.getValue("stopLoss") as number
  const cost = row.getValue("cost") as number

  const calculateLoss = () => {
    if (!stopLoss || stopLoss === 0) {
      return null
    }

    if (stopLoss >= askPrice && positionType === "buy") return 0

    const lossCalculation = quantity * stopLoss - quantity * askPrice

    if (positionType === "buy") {
      return Math.round(lossCalculation) * -1
    }
    return Math.round(lossCalculation)
  }

  const updateData = table.options.meta?.updateData

  useEffect(() => {
    let updatedLoss = calculateLoss()
    if (updatedLoss === null) return

    let updatedLossPer = Math.round((+updatedLoss / cost) * 100)

    if (updatedLoss !== null && +updatedLoss !== +initialValue) {
      updateData?.(row.index, {
        [column.id]: +updatedLoss,
        expectedLossPercent: +updatedLossPer,
      })
    }
  }, [initialValue, stopLoss, quantity, askPrice, cost, positionType])

  const displayLoss = calculateLoss()

  const formattedLoss =
    displayLoss !== null
      ? displayLoss.toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })
      : ""

  const prefix = displayLoss && displayLoss > 0 ? "-" : ""

  return (
    <div className="text-center w-24 text-red-500">
      {formattedLoss !== "" ? `$${prefix}${formattedLoss}` : ""}
    </div>
  )
}

export default ExpectedLossCell
