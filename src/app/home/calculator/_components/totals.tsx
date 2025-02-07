import React, { useMemo } from "react"
import { Position } from "@/types"

interface TotalsProps {
  tableData: Position[]
  isMobile?: boolean
}

const Totals: React.FC<TotalsProps> = ({ tableData, isMobile = false }) => {
  const { totalInvestment, totalProfit, totalLoss, totalProfitPercent, totalLossPercent } = useMemo(() => {
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

    tableData.forEach(({ quantity, askPrice, expectedProfit, expectedLoss }) => {
      totalInvestment += quantity * askPrice
      totalProfit += expectedProfit
      totalLoss += expectedLoss
    })

    let totalProfitPercent = totalInvestment ? (totalProfit / totalInvestment) * 100 : 0
    let totalLossPercent = totalInvestment ? (totalLoss / totalInvestment) * 100 : 0

    totalProfit = Math.max(0, totalProfit)
    totalProfitPercent = Math.max(0, totalProfitPercent)

    totalLoss = Math.min(0, totalLoss)
    totalLossPercent = Math.min(0, totalLossPercent)

    const formatNumber = (value: number) => {
      const parts = value.toString().split(".")
      parts[0] = parseInt(parts[0], 10).toLocaleString("en-US")
      if (parts.length > 1) {
        const decimalValue = parseFloat("0." + parts[1]).toFixed(2)
        parts[1] = decimalValue.endsWith("0")
          ? parseFloat(decimalValue).toString().split(".")[1] || "0"
          : decimalValue.split(".")[1]
      }
      return parts.join(".")
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
    <div className={`bg-[#2D3131] text-white rounded-md ${isMobile ? "p-2 text-xs" : "p-4 text-sm md:text-base"}`}>
      {isMobile ? (
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center px-4">
            <span className="text-green-500 text-right">Total Investment</span>
            <span className="font-bold text-white">$ {totalInvestment}</span>
          </div>
          <div className="flex justify-between items-center px-4">
            <span className="text-green-500 text-right">Total Profit</span>
            <span className="font-bold text-white">
              $ {totalProfit} ({totalProfitPercent}%)
            </span>
          </div>
          <div className="flex justify-between items-center px-4">
            <span className="text-red-500 text-right">Total Loss</span>
            <span className="font-bold text-white">
              $ {totalLoss} ({totalLossPercent}%)
            </span>
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
          <div className="text-green-500">Total Investment: ${totalInvestment}</div>
          <div className="text-green-500">
            Total Profit: ${totalProfit} ({totalProfitPercent}%)
          </div>
          <div className="text-red-500">
            Total Loss: ${totalLoss} ({totalLossPercent}%)
          </div>
        </div>
      )}
    </div>
  )
}

export default Totals
