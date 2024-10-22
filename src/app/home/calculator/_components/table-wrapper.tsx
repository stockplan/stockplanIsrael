"use client"

import React, { useEffect, useState } from "react"

import { TableLossProfit } from "@/app/home/calculator/_components/table-lossprofit"
import { ColumnDef } from "@tanstack/react-table"
import { Position } from "@/types"

interface TableLossProfitWrapperProps {
  columns: ColumnDef<Position>[]
  creator: string
  serverUserStocks: Position[]
}

const TableLossProfitWrapper: React.FC<TableLossProfitWrapperProps> = ({
  columns,
  creator,
  serverUserStocks,
}) => {
  // const [userStocks, setUserStocks] = useState(serverUserStocks)

  // useEffect(() => {
  //   // Check if there's data in localStorage
  //   const localData = localStorage.getItem("unsavedChanges")
  //   if (localData) {
  //     const parsedData = JSON.parse(localData)

  //     // Use local data instead of server data
  //     setUserStocks(parsedData)
  //   }
  // }, [])

  return (
    <TableLossProfit
      columns={columns}
      creator={creator}
      serverUserStocks={serverUserStocks}
    />
  )
}

export default TableLossProfitWrapper
