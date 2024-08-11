import React, { useEffect, useState } from "react"
import { CellType } from "../position/columns"
import CurrencyInput from "react-currency-input-field"

const DaysToTargetCell: React.FC<CellType> = ({ row, column, table }) => {
  const entryDateString = row.original.entryDate || new Date().toISOString()
  const entryDate = new Date(entryDateString)

  const initialValue = (row.getValue(column.id) as string) || "0"
  const today = new Date()
  const timeDiff = today.getTime() - entryDate.getTime()
  const daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24))
  const daysLeft = Math.max(0, parseInt(initialValue) - daysPassed).toString()

  const [value, setValue] = useState<string>(daysLeft)

  const updateData = table.options.meta?.updateData

  useEffect(() => {
    setValue(daysLeft)
  }, [daysLeft])

  const handleBlur = () => {
    if (value === daysLeft) return

    // עדכון הנתונים בDB עם התאריך הנוכחי
    updateData?.(row.index, {
      [column.id]: +value,
      entryDate: new Date().toISOString(),
    })
  }

  return (
    <CurrencyInput
      className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
      name="daysLeft"
      id={`daysLeft-${row.index}`}
      value={value}
      onValueChange={(value) => setValue(value || "0")}
      onBlur={handleBlur}
      allowDecimals={false}
      allowNegativeValue={false}
    />
  )
}

export default DaysToTargetCell
