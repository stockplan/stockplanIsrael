import React, { useMemo } from "react"
import { Position } from "@/schemas"

interface TotalsProps {
  tableData: Position[]
}

const Totals: React.FC<TotalsProps> = ({ tableData }) => {
  const {
    totalInvestment,
    totalProfit,
    totalLoss,
    totalProfitPercent,
    totalLossPercent,
  } = useMemo(() => {
    if (!Array.isArray(tableData) || tableData.length === 0) {
      return {
        totalInvestment: "0",
        totalProfit: "0",
        totalLoss: "0",
        totalProfitPercent: "0",
        totalLossPercent: "0",
      }
    }
    let totalInvestment = 0
    let totalProfit = 0
    let totalLoss = 0

    tableData.forEach(
      ({ quantity, askPrice, expectedProfit, expectedLoss }) => {
        totalInvestment += quantity * askPrice
        totalProfit += expectedProfit
        totalLoss += expectedLoss
      }
    )

    const totalProfitPercent = totalInvestment
      ? (totalProfit / totalInvestment) * 100
      : 0
    const totalLossPercent = totalInvestment
      ? (totalLoss / totalInvestment) * 100
      : 0

    const formatNumber = (value: number) => {
      if (value % 1 === 0) return value.toString() // If it's a whole number
      const decimalValue = value.toFixed(2) // Always two decimals
      return decimalValue.endsWith("0")
        ? parseFloat(decimalValue).toString()
        : decimalValue
    }

    return {
      totalInvestment: formatNumber(totalInvestment),
      totalProfit: formatNumber(totalProfit),
      totalLoss: formatNumber(totalLoss),
      totalProfitPercent: formatNumber(totalProfitPercent),
      totalLossPercent: formatNumber(totalLossPercent),
    }
  }, [tableData])

  return (
    <div className="p-4 text-white bg-[#2D3131] rounded-md font-semibold text-sm md:text-base">
      <div className="flex justify-between mt-4">
        <div className="text-green-500">
          Total Investment: ${totalInvestment}
        </div>
        <div className="text-green-500">
          Total Profit: ${totalProfit} ({totalProfitPercent}%)
        </div>
        <div className="text-red-500">
          Total Loss: ${totalLoss} ({totalLossPercent}%)
        </div>
      </div>
    </div>
  )
}

export default Totals
