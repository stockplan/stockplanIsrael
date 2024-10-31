import React, { useEffect, useState } from "react"
import { CellType } from "./columns"
import useSWR from "swr"
import axios from "axios"
import { ClipLoader, FadeLoader, SyncLoader } from "react-spinners"

const fetcher = async (url: string, currTicker: string) =>
  await axios.get(`${url}?ticker=${currTicker}`).then((res) => {
    return res.data
  })

const ActualPriceCell: React.FC<CellType> = ({ row, column, table }) => {
  const ticker = row.getValue("ticker") as string
  const actualPrice = row.getValue(column.id) as number

  const [price, setPrice] = useState<number>(actualPrice)

  const updateData = table.options.meta!.updateData!

  const { data, error, isLoading, isValidating } = useSWR(
    ticker ? ["/api/tickerPrice", ticker] : null,
    ([url, currTicker]) => fetcher(url, currTicker),
    {
      fallbackData: actualPrice,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  useEffect(() => {
    if (error) {
      setPrice(0)
      updateData(row.index, {
        actualPrice: 0,
      })
    } else if (data && data.fetchedPrice && price !== data.fetchedPrice) {
      setPrice(+data.fetchedPrice)
      updateData(row.index, {
        actualPrice: +data.fetchedPrice,
      })
    }
  }, [data, error, ticker])

  useEffect(() => {
    setPrice(actualPrice)
  }, [actualPrice])

  const formattedPrice = price
    ? price % 1 === 0
      ? price.toString()
      : price.toFixed(2).replace(/\.00$/, "")
    : 0

  return (
    <div className={`px-6 w-24 text-center ${error ? "text-red-500" : ""}`}>
      {isValidating ? (
        <ClipLoader color="#ffffff" size={25} />
      ) : (
        `$${formattedPrice}`
      )}
    </div>
  )
}

export default ActualPriceCell
