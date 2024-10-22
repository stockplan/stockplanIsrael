"use client"

import React from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { columns } from "./columns"

interface EmptyRowProps {}

const EmptyRow: React.FC<EmptyRowProps> = ({}) => {
  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No Trades.
      </TableCell>
    </TableRow>
  )
}

export default EmptyRow
