"use client"

import { useEffect, useMemo, useState } from "react"
//prettier-ignore
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
//prettier-ignore
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination"
import { Position } from "@/schemas"
import axios from "axios"
import { Separator } from "../ui/separator"
import EmptyRow from "./empty-row"
import Totals from "./totals"
import { getEmptyRow } from "@/lib/utils"
import SaveButton from "../SaveButton"

interface DataTableProps {
  columns: ColumnDef<Position>[]
  initialData: Position[]
  creator: string
  maxTickers: number
}

interface ColumnUpdate {
  [columnId: string]: number | string
}

export function DataTable({
  columns,
  initialData: initialDataProp,
  creator,
  maxTickers = 50,
}: DataTableProps) {
  const [initialData, setInitialData] = useState<Position[]>(initialDataProp)
  const [tableData, setTableData] = useState<Position[]>(initialDataProp)
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setHasChanges(JSON.stringify(tableData) !== JSON.stringify(initialData))
  }, [tableData, initialData])

  const memoColumns = useMemo<ColumnDef<Position>[]>(() => columns, [])

  const handleLastRow = async () => {
    try {
      const emptyRow = getEmptyRow(creator)
      await saveChanges([emptyRow])
    } catch (error) {
      console.log(error)
    }
  }

  const saveChanges = async (userPositions: Position[] = tableData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/position/${creator}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ positions: userPositions }),
      })

      const data = await response.json()
      setTableData(data)
      setInitialData(data)
      setHasChanges(false)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeRow = async (rowIndex: number) => {
    try {
      const currentPageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const rowCountOnCurrentPage = tableData.length % pageSize

      if (rowCountOnCurrentPage === 1 && currentPageIndex > 0) {
        table.setPageIndex(currentPageIndex - 1) // Move to the previous page
      }
      const updatedRows = tableData.filter((_, index) => index !== rowIndex)

      if (updatedRows.length === 0) {
        await handleLastRow()
      } else {
        setTableData(updatedRows)
        setInitialData(updatedRows)
      }

      const rowId = tableData[rowIndex]?._id
      if (rowId) {
        await axios.delete(`/api/position/${creator}`, { data: [rowId] })
      }
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
    setHasChanges(true)
    return
  }

  const updateData = (rowIndex: number, updates: ColumnUpdate) => {
    if (updates.actualPrice) {
      updatePrices(rowIndex, updates)
      return
    }

    const updatedRows = [...tableData]
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updates }
    setTableData(updatedRows)
    setHasChanges(true)
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

      const newPosition: Position = getEmptyRow(creator)
      const updatedRows = [...tableData, newPosition]

      setTableData(updatedRows)
      saveChanges(updatedRows)
    } catch (error) {
      console.error("Failed to add new row:", error)
    }
  }

  const handleDeleteAll = async () => {
    Promise.all([
      handleLastRow(),
      axios.delete(`/api/position/${creator}`, {
        data: tableData.map((row) => row._id),
      }),
    ])
    table.setPageIndex(0)
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
    <div className="space-y-4 text-white bg-[#2D3131] p-3 ">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <h3 onClick={() => console.log(tableData)}>
            Quick Profit / Loss Calculator
          </h3>
          <SaveButton
            onClick={() => saveChanges(tableData)}
            isLoading={isLoading}
            disabled={!hasChanges}
          >
            Save Changes
          </SaveButton>
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
        handleDeleteAll={handleDeleteAll}
        handleAddNewTicker={addNewRow}
        table={table}
      />
      <Separator />
      <Totals tableData={tableData} />
    </div>
  )
}
