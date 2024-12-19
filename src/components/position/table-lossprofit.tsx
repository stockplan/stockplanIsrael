"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Separator } from "../ui/separator"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { useToast } from "../ui/use-toast"
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import Image from "next/image"
import { BsTrashFill } from "react-icons/bs"
import { Position } from "@/types"
import { useUnsavedChangesContext } from "@/hooks/useUnsavedChangesContext"
import { useWarnIfUnsavedChanges } from "@/hooks/useWarnIfUnsavedChanges"
import { hasDataChanged } from "@/utils"
import { cn, getEmptyRow } from "@/lib/utils"
import { ToastAction } from "../ui/toast"
import ConfirmationModal from "../modals/ConfirmationModal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import EmptyRow from "@/app/home/calculator/_components/empty-row"
import { DataTablePagination } from "@/app/home/calculator/_components/data-table-pagination"
import Totals from "@/app/home/calculator/_components/totals"

interface DataTableProps {
  columns: ColumnDef<Position>[]
  creator: string
  serverUserStocks: Position[] | []
}

interface ColumnUpdate {
  [columnId: string]: number | string
}

const AUTO_SAVE_DELAY = 10000 * 5

export function TableLossProfit({ columns, creator, serverUserStocks }: DataTableProps) {
  const [tableData, setTableData] = useState<Position[]>(serverUserStocks)
  const originalDataRef = useRef<Position[]>(serverUserStocks)
  const [isLoading, setIsLoading] = useState(false)

  const { unsavedChanges, setUnsavedChanges } = useUnsavedChangesContext()
  const { toast } = useToast()

  const searchParams = useSearchParams()
  const ticker = searchParams.get("ticker")

  const memoColumns = useMemo<ColumnDef<Position>[]>(() => columns, [])

  useWarnIfUnsavedChanges(unsavedChanges, !!creator)

  useEffect(() => {
    const dataHasChanged = !hasDataChanged(tableData, originalDataRef.current)

    setUnsavedChanges(dataHasChanged)
  }, [tableData])

  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (unsavedChanges) {
        saveChanges(tableData)
      }
    }, AUTO_SAVE_DELAY)

    return () => clearTimeout(autoSaveTimer)
  }, [tableData, unsavedChanges])

  useEffect(() => {
    if (!creator) {
      const emptyRow = getEmptyRow()
      if (ticker) {
        emptyRow.ticker = ticker
      }
      setTableData([emptyRow])
    }
  }, [creator, ticker])

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
        localStorage.removeItem("unsavedChanges")
      } catch (error) {
        console.error("Failed to save data", error)

        // Save changes locally in case of API failure
        try {
          localStorage.setItem("unsavedChanges", JSON.stringify(changes))
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } catch (localError) {
          console.error("Failed to save changes locally", localError)
        }
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
      const currentPageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const rowCountOnCurrentPage = tableData.length % pageSize

      if (rowCountOnCurrentPage === 1 && currentPageIndex > 0) {
        table.setPageIndex(currentPageIndex - 1)
      }

      const updatedRows = tableData.filter((_, index) => index !== rowIndex)
      // const rowToDelete = tableData[rowIndex]

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

    const { pageSize, pageIndex } = table.getState().pagination

    if (tableData.length + 1 > pageSize * (pageIndex + 1)) {
      table.nextPage()
    }

    const updatedRows = [...tableData, getEmptyRow(creator)]
    setTableData(updatedRows)
    // setUnsavedChanges(true)
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
    <div className="pt-8 absolute z-10 w-full">
      <div className="space-y-2 text-white bg-[#2D3131] p-3">
        <div className="flex items-center justify-between ">
          <h3 className="flex-1 text-left text-sm" onClick={() => console.log(tableData)}>
            Quick Profit / Loss Calculator
          </h3>

          <div className={cn("flex-1 flex justify-center", !creator && " justify-start lg:mr-[173px] ml-auto")}>
            <Image alt="logo" src="\img\Logo.svg" width={200} height={42} className="h-auto w-auto" priority />
          </div>

          <div className={cn("flex-1 flex justify-end", !creator && "hidden")}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="text-white text-sm bg-background-main">
                  <BsTrashFill className="mr-2 h-4 w-4" />
                  Delete All
                </Button>
              </AlertDialogTrigger>
              <ConfirmationModal handleDeleteAll={handleDeleteAll} />
            </AlertDialog>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="rounded-md border min-w-full">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-inherit">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="text-white text-sm h-12 text-center font-bold "
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody id="TABLE_BODY">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow className="hover:bg-inherit" id={"row_" + row.id} key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell id={cell.id} className="h-14 text-sm text-center px-2" key={cell.id}>
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
          </div>
        </div>

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
