"use client"

import React from "react"
import { TableCell, TableRow } from "@/components/ui/table"

interface EmptyRowProps {}

const EmptyRow: React.FC<EmptyRowProps> = ({}) => {
  return (
    <TableRow>
      <TableCell colSpan={12} className="h-24 text-center">
        No Trades.
      </TableCell>
    </TableRow>
  )
}

export default EmptyRow
