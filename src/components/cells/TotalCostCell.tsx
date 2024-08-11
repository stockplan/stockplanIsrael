"use client"

import React, { useEffect, useState } from "react"
import { CellType } from "../position/columns"

const TotalCostCell: React.FC<CellType> = ({ row, column, table }) => {
  const defaultValue = (row.getValue(column.id) as number) || 0

  const formattedCost = defaultValue.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })

  return <div className="text-center w-24">${formattedCost}</div>
}

export default TotalCostCell
