"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { Position } from "@/schemas"
import { Separator } from "../ui/separator"
import EmptyRow from "./empty-row"
import Totals from "./totals"
import { getEmptyRow } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import SaveButton from "../SaveButton"
import { useWarnIfUnsavedChanges } from "@/hooks/useWarnIfUnsavedChanges"

interface DataTableProps {
  columns: ColumnDef<Position>[]
  creator: string
  userStocks: Position[] | []
}

interface ColumnUpdate {
  [columnId: string]: number | string
}

export function TableLossProfit({
  columns,
  creator,
  userStocks,
}: DataTableProps) {
  const [tableData, setTableData] = useState<Position[]>(userStocks)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const searchParams = useSearchParams()
  const ticker = searchParams.get("ticker")
  const memoColumns = useMemo<ColumnDef<Position>[]>(() => columns, [])

  useWarnIfUnsavedChanges(unsavedChanges, !!creator)

  useEffect(() => {
    if (!creator) {
      const emptyRow = getEmptyRow("")
      if (ticker) {
        emptyRow.ticker = ticker
      }
      setTableData([emptyRow])
    }
  }, [creator, ticker])

  const saveChanges = async (changes: Position[]) => {
    if (creator) {
      setIsLoading(true)
      try {
        await axios.post("/api/save", { changes })
        setUnsavedChanges(false)
      } catch (error) {
        console.error("Failed to save data", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const removeRow = (rowIndex: number) => {
    try {
      const currentPageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const rowCountOnCurrentPage = tableData.length % pageSize

      if (rowCountOnCurrentPage === 1 && currentPageIndex > 0) {
        table.setPageIndex(currentPageIndex - 1)
      }

      const updatedRows = tableData.filter((_, index) => index !== rowIndex)
      // const rowToDelete = tableData[rowIndex]

      if (updatedRows.length === 0) setTableData([getEmptyRow()])
      else setTableData(updatedRows)

      setUnsavedChanges(true)
    } catch (error) {
      console.log("error removing rows: ", error)
    }
  }

  const updatePrices = (rowIndex: number, updates: ColumnUpdate) => {
    const updatedPrice = {
      ticker: tableData[rowIndex].ticker,
      price: updates.actualPrice,
    }

    const updatedTableWithPrices = tableData.map((row) => {
      if (row.ticker === updatedPrice.ticker) {
        row.actualPrice = +updatedPrice.price
      }
      return row
    })

    setTableData(updatedTableWithPrices)
  }

  const updateData = (rowIndex: number, updates: ColumnUpdate) => {
    if (updates.actualPrice) {
      updatePrices(rowIndex, updates)
      return
    }

    const updatedRows = [...tableData]
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updates }
    setTableData(updatedRows)
    setUnsavedChanges(true)
  }

  const validateNewRow = (lastRow: Position) => {
    // Validate ticker
    if (!lastRow.ticker) {
      alert("Please enter a ticker symbol in the last row.")
      return false
    }

    // Validate askPrice
    if (lastRow.askPrice === 0) {
      alert("Please enter an ask price greater than 0 in the last row.")
      return false
    }

    // Validate quantity
    if (lastRow.quantity === 0) {
      alert("Please enter a quantity greater than 0 in the last row.")
      return false
    }
    return true
  }

  const addNewRow = () => {
    if (!creator) return

    const maxTickers = 50

    try {
      if (tableData.length >= maxTickers) {
        alert(`Maximum of ${maxTickers} rows allowed.`)
        return
      }

      const lastRow = tableData[tableData.length - 1]
      if (!validateNewRow(lastRow)) return table.lastPage()

      const { pageSize, pageIndex } = table.getState().pagination

      if (tableData.length + 1 > pageSize * (pageIndex + 1)) {
        table.nextPage()
      }

      const updatedRows = [...tableData, getEmptyRow(creator)]
      setTableData(updatedRows)
      setUnsavedChanges(true)
    } catch (error) {
      console.error("Failed to add new row:", error)
    }
  }

  const handleDeleteAll = () => {
    const emptyTable = [getEmptyRow(creator)]
    setTableData(emptyTable)
    table.setPageIndex(0)
    setUnsavedChanges(true)
    saveChanges(emptyTable)
  }

  const table = useReactTable({
    data: tableData,
    columns: memoColumns,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      updateData,
      removeRow,
    },
  })

  return (
    <>
      <div className="space-y-4 text-white bg-[#2D3131] p-3 ">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <h3 onClick={() => console.log(tableData)}>
              Quick Profit / Loss Calculator
            </h3>
            {creator && (
              <SaveButton
                onClick={() => saveChanges(tableData)}
                isLoading={isLoading}
                disabled={!unsavedChanges}
              >
                Save Changes
              </SaveButton>
            )}
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-inherit">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className=" text-white text-sm h-12 text-center font-bold"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody id="TABLE_BODY">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="hover:bg-inherit"
                    id={"row_" + row.id}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell id={cell.id} className="h-14" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <EmptyRow />
              )}
            </TableBody>
          </Table>
        </div>

        <DataTablePagination
          creator={creator}
          handleDeleteAll={handleDeleteAll}
          handleAddNewTicker={addNewRow}
          table={table}
        />
        <Separator />
        <Totals tableData={tableData} />
      </div>
    </>
  )
}
