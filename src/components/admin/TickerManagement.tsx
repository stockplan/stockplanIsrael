import React from "react"
import { BeatLoader } from "react-spinners"
import useSWR from "swr"

// Assuming this is the structure of each position
interface IPosition {
  ticker: string
  quantity: number
  askPrice: number
  exitPrice: number
  stopLoss: number
  creator: string // Assuming creator is a user identifier
}

// Structure for the aggregated ticker data
interface ITickerData {
  ticker: string
  averageQuantity: number
  averageAskPrice: number
  averageExitPrice: number
  averageStopLoss: number
  userCount: number
}

// prettier-ignore
const positionFetcher =  () =>  fetch("/api/position").then((res) => res.json())

const TickerManagement = ({}) => {
  // prettier-ignore
  const { data: positions = [], isLoading } = useSWR("/api/position", positionFetcher, {
    revalidateOnFocus: true,  
  })

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

  const tickerData = aggregateTickerData(positions)

  if (isLoading) return <BeatLoader />
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Tickers Overview</h3>
      <div className="space-y-2">
        {tickerData.map((data) => (
          <div
            key={data.ticker}
            className="bg-white text-gray-900 shadow-md rounded-lg p-4"
          >
            <h4 className="font-medium text-xl">{data.ticker}</h4>
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

export default TickerManagement
