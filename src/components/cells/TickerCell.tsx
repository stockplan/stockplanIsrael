"use client"

import React, { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { CellType } from "../position/columns"
import { mutate } from "swr"

const TickerCell: React.FC<CellType> = ({ getValue, row, column, table }) => {
  const initialValue = getValue() as string

  const [localTicker, setLocalTicker] = useState<string>(initialValue)

  const updateData = table.options.meta!.updateData!

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (/^[A-Z]*$/.test(value)) {
      setLocalTicker(value)
    }
  }

  const handleBlur = () => {
    if (initialValue !== localTicker) {
      if (!localTicker) {
        updateData(row.index, {
          [column.id]: "",
          actualPrice: 0,
        })
      } else {
        updateData(row.index, {
          [column.id]: localTicker,
        })
        mutate(["/api/tickerPrice", localTicker])
      }
    }
  }

  useEffect(() => {
    setLocalTicker(initialValue)
  }, [initialValue])

  return (
    <Input
      className="w-24"
      type="text"
      value={localTicker}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  )
}

export default TickerCell
