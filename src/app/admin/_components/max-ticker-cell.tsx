"use client"

import { ExtendedUser } from "@supabase/supabase-js"
import { CellContext } from "@tanstack/react-table"
import { useState } from "react"
import CurrencyInput from "react-currency-input-field"

type CellType = CellContext<ExtendedUser, unknown>

const MaxTickersCol: React.FC<CellType> = ({ row, column, table }) => {
  const userId = row.original.id
  const initialValue = (row.getValue("maxTickers") as number) || 50
  const [tickerValue, setTickerValue] = useState<string>(
    initialValue.toString()
  )

  const handleTickerChange = (value: string | undefined) => {
    setTickerValue(value || "0")
  }

  const handleBlur = () => {
    const newValue = +tickerValue
    if (initialValue !== newValue) {
      if (newValue > 0 && newValue <= 50) {
        table.options.meta?.handleBlur(userId, initialValue, newValue)
      }
    }
  }

  return (
    <div className="flex items-center justify-center">
      <CurrencyInput
        className="bg-inherit w-12 border px-3 py-1 font-semibold"
        id={`maxTickers-${row.index}`}
        value={tickerValue}
        allowDecimals={false}
        onValueChange={handleTickerChange}
        onBlur={handleBlur}
        allowNegativeValue={false}
      />
    </div>
  )
}

export default MaxTickersCol
