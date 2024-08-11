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

    return {
      totalInvestment: totalInvestment.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }),
      totalProfit: totalProfit.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }),
      totalLoss: totalLoss.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }),
      totalProfitPercent: totalProfitPercent.toFixed(0),
      totalLossPercent: totalLossPercent.toFixed(0),
    }
  }, [tableData])

  return (
    <div className="p-4 text-white bg-[#2D3131] rounded-md font-semibold">
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
