"use client"

import { MdDelete } from "react-icons/md"
import { Row, Table } from "@tanstack/react-table"
import { Position } from "@/types"

interface DataTableRowActionsProps<TData> {
  row: Row<any>
  table: Table<Position>
}

export function DataTableRowActions<TData>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const removeRow = table.options.meta?.removeRow
  const rowIndex = row.index

  const handleDelete = () => {
    removeRow && removeRow(rowIndex)
  }

  return (
    <MdDelete
      id={"btn-delete-" + row.id}
      onClick={handleDelete}
      className="h-6 w-6 cursor-pointer hover:text-red-600"
    />
  )
}
