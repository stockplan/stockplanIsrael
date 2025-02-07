import { cn } from "@/lib/utils"
import { Position } from "@/types"
import React from "react"

interface TickerPreviewProps {
  stock: Position
  onClick: (stock?: Position) => void
}

const TickerPreview: React.FC<TickerPreviewProps> = ({ stock, onClick }) => {
  return (
    <button
      className={`w-32 h-12 bg-gray-800 text-white rounded-md p-1 border-t-2 flex flex-col justify-between ${cn(
        stock.positionType === "buy" ? " border-t-green-500" : "border-t-red-500"
      )} `}
      onClick={() => onClick()}
    >
      <div className="flex justify-between items-start w-full text-sm gap-3">
        <span>{stock.ticker}</span>
        <span>{stock.actualPrice}$</span>
      </div>

      <div className="flex justify-between w-full text-xs">
        <span className="text-green-500">{stock.expectedProfit.toFixed(2)}$</span>
        <span className="text-red-500">{stock.expectedLoss.toFixed(2)}$</span>
      </div>
    </button>
  )
}

export default TickerPreview
