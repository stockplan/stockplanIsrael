"use client"

import React, { useState, useEffect } from "react"
import CurrencyInput from "react-currency-input-field"
import { CellType } from "../position/columns"

const QuantityCell: React.FC<CellType> = ({ row, column, table }) => {
  const defaultValue = (row.getValue(column.id) as string) || "0"
  const [quantity, setQuantity] = useState<string>(defaultValue)

  const askPrice = row.getValue("askPrice") as number

  const updateData = table.options.meta?.updateData

  useEffect(() => {
    setQuantity(defaultValue)
  }, [defaultValue])

  const handleBlurQuantity = () => {
    if (+quantity === +defaultValue) return

    const updatedCost = askPrice * +quantity
    updateData &&
      updateData(row.index, { [column.id]: +quantity, cost: +updatedCost })
  }

  return (
    <CurrencyInput
      className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
      name="quantity"
      id={`quantity-${row.index}`}
      value={quantity}
      onValueChange={(value: any) => setQuantity(value || "0")}
      onBlur={handleBlurQuantity}
      allowNegativeValue={false}
      allowDecimals={false}
    />
  )
}

export default QuantityCell
