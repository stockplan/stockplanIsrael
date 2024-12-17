import React, { useOptimistic } from "react"
import TickerPreview from "./TickerPreview"
import { useLossProfitState } from "./useLossprofitState"
import AddTickerBtn from "./AddTickerBtn"

interface MobileAllTickers {}

const MobileAllTickers: React.FC<MobileAllTickers> = ({}) => {
  const { handleTickerSelect, tickersData, selectedTicker } = useLossProfitState()
  const [optimalData, setOptimalData] = useOptimistic(tickersData)

  return (
    <div className="flex flex-col bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold" onClick={() => console.log(tickersData, selectedTicker)}>
          All My Tickers
        </h1>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search a symbol (for example: AAPL)"
          className="w-full p-2 bg-gray-800 rounded-md text-white placeholder-gray-400 text-xs"
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-center items-center">
        {tickersData?.map((item, index) => (
          <TickerPreview key={`${item._id}-${index}`} stock={item} onClick={() => handleTickerSelect(item)} />
        ))}
      </div>

      <div className="mt-4">
        <AddTickerBtn />
      </div>
    </div>
  )
}

export default MobileAllTickers
