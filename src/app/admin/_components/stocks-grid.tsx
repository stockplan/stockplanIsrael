import React from "react"

// Assuming the structure of each position and ticker data
interface IPosition {
  ticker: string
  quantity: number
  askPrice: number
  exitPrice: number
  stopLoss: number
  creator: string // Assuming creator is a user identifier
}

interface ITickerData {
  ticker: string
  averageQuantity: number
  averageAskPrice: number
  averageExitPrice: number
  averageStopLoss: number
  userCount: number
}

interface StocksGridProps {
  positions: IPosition[]
}

const StocksGrid: React.FC<StocksGridProps> = ({ positions }) => {
  const aggregateTickerData = (positions: IPosition[]): ITickerData[] => {
    const tickerMap = new Map<
      string,
      {
        totalQuantity: number
        totalAskPrice: number
        totalExitPrice: number
        totalStopLoss: number
        users: Set<string>
      }
    >()

    positions.forEach(
      ({ ticker, quantity, askPrice, exitPrice, stopLoss, creator }) => {
        if (!ticker) return
        const tickerData = tickerMap.get(ticker) || {
          totalQuantity: 0,
          totalAskPrice: 0,
          totalExitPrice: 0,
          totalStopLoss: 0,
          users: new Set<string>(),
        }
        tickerData.totalQuantity += quantity
        tickerData.totalAskPrice += askPrice
        tickerData.totalExitPrice += exitPrice
        tickerData.totalStopLoss += stopLoss
        tickerData.users.add(creator)
        tickerMap.set(ticker, tickerData)
      }
    )

    return Array.from(tickerMap, ([ticker, data]) => ({
      ticker,
      averageQuantity: data.totalQuantity / data.users.size,
      averageAskPrice: data.totalAskPrice / data.users.size,
      averageExitPrice: data.totalExitPrice / data.users.size,
      averageStopLoss: data.totalStopLoss / data.users.size,
      userCount: data.users.size,
    }))
  }

  const data = aggregateTickerData(positions)

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((data) => (
          <div
            key={data.ticker}
            className="bg-white shadow-md rounded-lg p-6 space-y-2"
          >
            <h4 className="font-medium text-lg">{data.ticker}</h4>
            <div className="text-sm space-y-1">
              <p>Average Quantity: {data.averageQuantity.toFixed(2)}</p>
              <p>Average Ask Price: {data.averageAskPrice.toFixed(2)}</p>
              <p>Average Exit Price: {data.averageExitPrice.toFixed(2)}</p>
              <p>Average Stop Loss: {data.averageStopLoss.toFixed(2)}</p>
              <p>Selected by {data.userCount} Users</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StocksGrid
