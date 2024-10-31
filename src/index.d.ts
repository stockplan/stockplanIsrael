import { User } from "@supabase/supabase-js"
import { RowData } from "@tanstack/react-table"

import { Mongoose } from "mongoose"
import { Position } from "./types"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData?: (
      rowIndex: number,
      updates: { [columnId: string]: any }
    ) => void
    removeRow?: (rowIndex: number) => void
    handleDeleteUser?: any
    handleBlur?: any
  }
}

/* eslint-disable no-var */
declare global {
  var mongoose: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}

declare module "@supabase/supabase-js" {
  interface ExtendedUser extends User {
    maxTickers: number
    stockIds?: Position[]
  }
}
