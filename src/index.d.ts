import { RowData } from "@tanstack/react-table"

import { Mongoose } from "mongoose"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData?: (
      rowIndex: number,
      updates: { [columnId: string]: any }
    ) => void
    removeRow?: (rowIndex: number) => void
    handleDeleteUser?: any
  }
}

/* eslint-disable no-var */
declare global {
  var mongoose: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}
