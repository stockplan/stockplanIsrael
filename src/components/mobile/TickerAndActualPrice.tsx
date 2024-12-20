import React from "react"
import { Input } from "../ui/input"
import CurrencyInput from "react-currency-input-field"
import axios from "axios"
import useSWR from "swr"
import { ClipLoader } from "react-spinners"

interface TickerAndActualPriceProps {
  handleInputChange: (name: "ticker" | "actualPrice", value: string) => void
  handleBlur: (name: "ticker" | "actualPrice", value: string) => void
  tickerValue: string
  actualPriceValue: number
}

const fetcher = async (url: string, currTicker: string) =>
  await axios.get(`${url}?ticker=${currTicker}`).then((res) => {
    return res.data
  })
const TickerAndActualPrice: React.FC<TickerAndActualPriceProps> = ({
  handleInputChange,
  handleBlur,
  tickerValue,
  actualPriceValue,
}) => {
  const { data, error, isLoading, isValidating } = useSWR(
    tickerValue ? ["/api/tickerPrice", tickerValue] : null,
    ([url, currTicker]) => fetcher(url, currTicker),
    {
      fallbackData: actualPriceValue,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      // refreshInterval: 2 * 60 * 1000,
    }
  )

  const formattedPrice = data
    ? data % 1 === 0
      ? data?.toString()
      : data?.toFixed(2).replace(/\.00$/, "")
    : 0

  return (
    <div className="mb-2">
      <div className="border border-gray-600 p-2 rounded-md flex justify-between items-center">
        <Input
          value={tickerValue}
          onChange={(e) =>
            handleInputChange("ticker", tickerValue.toUpperCase())
          }
          name="ticker"
          onBlur={(e) => handleBlur("ticker", tickerValue)}
          className="w-1/2 border-none bg-transparent focus:outline-none text-white"
        />
        {isLoading ? (
          <ClipLoader color="#ffffff" size={25} />
        ) : (
          `${formattedPrice}$`
        )}
      </div>
    </div>
  )
}

export default TickerAndActualPrice
