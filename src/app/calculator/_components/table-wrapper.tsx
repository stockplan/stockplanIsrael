"use client"

import React from "react"

import { Position } from "@/schemas"
import { TableLossProfit } from "@/components/position/table-lossprofit"

interface TableLossProfitWrapperProps {
  columns: any
  creator: string
  userStocks: Position[]
}

const TableLossProfitWrapper: React.FC<TableLossProfitWrapperProps> = ({
  columns,
  creator,
  userStocks,
}) => {
  return (
    <TableLossProfit
      columns={columns}
      creator={creator}
      userStocks={userStocks}
    />
  )
}

export default TableLossProfitWrapper
