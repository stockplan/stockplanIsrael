"use client"

import React, { useState, useEffect } from "react"
import CurrencyInput from "react-currency-input-field"
import { CellType } from "../position/columns"

const AskPriceCell: React.FC<CellType> = ({ row, column, table }) => {
  const defaultValue = (row.getValue(column.id) as string) || "0"
  const [askPrice, setAskPrice] = useState<string>(defaultValue)

  const quantity = row.getValue("quantity") as number

  const updateData = table.options.meta?.updateData!

  useEffect(() => {
    setAskPrice(defaultValue)
  }, [defaultValue])

  const handleBlur = () => {
    if (+askPrice === +defaultValue) return

    const updatedCost = +askPrice * quantity

    updateData &&
      updateData(row.index, { [column.id]: +askPrice, cost: +updatedCost })
  }

  return (
    <CurrencyInput
      className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
      id={`askPrice-${row.index}`}
      name="askPrice"
      value={askPrice}
      decimalsLimit={2}
      onValueChange={(value: any) => setAskPrice(value || "0")}
      onBlur={handleBlur}
      allowNegativeValue={false}
      prefix="$"
    />
  )
}

export default AskPriceCell
