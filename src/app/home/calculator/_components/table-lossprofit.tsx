"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { Position } from "@/types"
import { Separator } from "@/components/ui/separator"
import EmptyRow from "@/app/home/calculator/_components/empty-row"
import Totals from "@/app/home/calculator/_components/totals"
import { cn, getEmptyRow } from "@/lib/utils"
import axios from "axios"
import { useWarnIfUnsavedChanges } from "@/hooks/useWarnIfUnsavedChanges"
import { useUnsavedChangesContext } from "@/hooks/useUnsavedChangesContext"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { hasDataChanged } from "@/utils"
import ConfirmationModal from "@/components/modals/ConfirmationModal"
import Logo from "@/components/logo"
import { columns } from "./columns"

interface Props {
  creator: string
  serverUserStocks: Position[] | []
}

interface ColumnUpdate {
  [columnId: string]: number | string
}

const AUTO_SAVE_DELAY = 1000

export function TableLossProfit({ creator, serverUserStocks }: Props) {
  const [tableData, setTableData] = useState<Position[]>(serverUserStocks)
  const originalDataRef = useRef<Position[]>(serverUserStocks)
  const [isLoading, setIsLoading] = useState(false)

  const { unsavedChanges, setUnsavedChanges } = useUnsavedChangesContext()
  const { toast } = useToast()

  useWarnIfUnsavedChanges(unsavedChanges, !!creator)

  const memoColumns = useMemo<ColumnDef<Position>[]>(() => columns, [])

  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (unsavedChanges) {
        saveChanges(tableData)
      }
    }, AUTO_SAVE_DELAY)

    return () => clearTimeout(autoSaveTimer)
  }, [tableData, unsavedChanges])

  const saveChanges = async (changes: Position[]) => {
    if (hasDataChanged(changes, originalDataRef.current)) {
      setUnsavedChanges(false)
      return
    }

    if (creator && unsavedChanges) {
      setIsLoading(true)
      try {
        await axios.post("/api/save", { changes })
        originalDataRef.current = changes
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
      if (!creator) {
        setTableData([getEmptyRow()])
        return
      }
      const updatedRows = tableData.filter((_, index) => index !== rowIndex)

      if (updatedRows.length === 0) {
        setTableData([getEmptyRow(creator)])
      } else {
        setTableData(updatedRows)
      }

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
    const validationToast = {
      title: "",
      description: "",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    }

    // Validate ticker
    if (!lastRow.ticker) {
      validationToast.title = "Missing Ticker Symbol"
      validationToast.description = "Please enter a ticker symbol in the last row."
    }

    // Validate askPrice
    else if (lastRow.askPrice === 0) {
      validationToast.title = "Ask Price Required"
      validationToast.description = "Please enter an ask price greater than 0 in the last row."
    }

    // Validate quantity
    else if (lastRow.quantity === 0) {
      validationToast.title = "Quantity Needed"
      validationToast.description = "Please enter a quantity greater than 0 in the last row."
    }

    if (validationToast.description) {
      toast(validationToast)
      return false
    }
    return true
  }

  const addNewRow = () => {
    const maxTickers = 10
    if (!creator || tableData.length >= maxTickers) {
      if (tableData.length >= maxTickers) {
        toast({
          description: `Maximum of ${maxTickers} rows allowed.`,
          variant: "destructive",
        })
      }
      return
    }

    const lastRow = tableData[tableData.length - 1]
    if (!validateNewRow(lastRow)) return table.lastPage()

    const updatedRows = [...tableData, getEmptyRow(creator)]
    setTableData(updatedRows)
    setUnsavedChanges(true)
  }

  const handleDeleteAll = async () => {
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
    <div className="py-8 px-2 relative z-10 w-full bg-background-main rounded-sm">
      <div className="space-y-2 text-white bg-[#2D3131] p-3">
        <div className="flex items-center justify-between">
          <h3 className="flex-1 text-sm" onClick={() => console.log(tableData)}>
            Quick Profit / Loss Calculator
          </h3>

          <div className={cn("flex-1 flex justify-center", !creator && "justify-start lg:mr-[173px] ml-auto")}>
            <Logo isNavigate={false} />
          </div>

          <div className={cn("flex-1 flex justify-end", !creator && "hidden")}>
            <ConfirmationModal handleDeleteAll={handleDeleteAll} />
          </div>
        </div>

        <Table className="border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-white text-sm text-center font-bold"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody id="TABLE_BODY">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow id={"row_" + row.id} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell id={cell.id} key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <EmptyRow />
            )}
          </TableBody>
        </Table>

        <DataTablePagination
          creator={creator}
          saveChanges={saveChanges}
          tableData={tableData}
          isLoading={isLoading}
          unsavedChanges={unsavedChanges}
          handleAddNewTicker={addNewRow}
        />

        <Separator />

        <Totals tableData={tableData} />
      </div>
    </div>
  )
}
