"use client"

import { CellContext, ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Position } from "@/schemas"
import ActualPriceCell from "../cells/ActualPrice"
import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { mutate } from "swr"
import CurrencyInput from "react-currency-input-field"

export type CellType = CellContext<Position, unknown>

export const columns: ColumnDef<Position>[] = [
  {
    accessorKey: "ticker",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Enter the stock's ticker symbol (e.g., AAPL, MSFT). The ticker will be displayed in uppercase."
        title="Ticker"
      />
    ),
    cell: ({ getValue, row, column, table }) => {
      const initialValue = getValue() as string
      const [localTicker, setLocalTicker] = useState<string>(initialValue)
      const updateData = table.options.meta!.updateData!

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase()
        if (/^[A-Z]*$/.test(value)) {
          setLocalTicker(value)
        }
      }

      const handleBlur = () => {
        if (initialValue !== localTicker) {
          if (!localTicker) {
            updateData(row.index, {
              [column.id]: "",
              actualPrice: 0,
            })
          } else {
            updateData(row.index, {
              [column.id]: localTicker,
            })
            mutate(["/api/tickerPrice", localTicker])
          }
        }
      }

      useEffect(() => {
        setLocalTicker(initialValue)
      }, [initialValue])

      return (
        <Input
          className="w-24"
          type="text"
          value={localTicker}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      )
    },
  },
  {
    accessorKey: "actualPrice",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="The current market price of the stock. This value is automatically fetched and cannot be edited."
        title="Actual Price"
      />
    ),
    cell: ActualPriceCell,
  },
  {
    accessorKey: "positionType",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Choose 'Buy' if you plan to purchase the stock, or 'Sell' if you plan to sell it."
        title="Long / Short"
      />
    ),
    cell: ({ row, column, table }) => {
      const positionType = row.getValue(column.id) as string
      const updateData = table.options.meta?.updateData

      const quantity = row.getValue("quantity") as number
      const askPrice = row.getValue("askPrice") as number
      const exitPrice = row.getValue("exitPrice") as number
      const cost = row.getValue("cost") as number

      const chooseSell = () => {
        //prettier-ignore
        const expProfit = Math.max((+exitPrice * quantity - askPrice * quantity) * -1, 0)
        const expectedProfitPercent = (expProfit / cost) * 100
        updateData?.(row.index, {
          [column.id]: "sell",
          expectedProfit: +expProfit,
          expectedProfitPercent: +expectedProfitPercent,
        })
      }

      const chooseBuy = () => {
        const expProfit = Math.max(
          +exitPrice * quantity - askPrice * quantity,
          0
        )
        const expectedProfitPercent = (expProfit / cost) * 100

        updateData?.(row.index, {
          [column.id]: "buy",
          expectedProfit: +expProfit,
          expectedProfitPercent: +expectedProfitPercent,
        })
      }

      return (
        <div className="flex gap-2 w-28 items-center justify-center">
          <button
            className={`px-2 py-1 rounded text-white ${
              positionType === "buy" ? "bg-green-500" : "bg-gray-400"
            }`}
            onClick={chooseBuy}
          >
            Buy
          </button>
          <button
            className={`px-2 py-1 rounded text-white ${
              positionType === "sell" ? "bg-red-500" : "bg-gray-400"
            }`}
            onClick={chooseSell}
          >
            Sell
          </button>
        </div>
      )
    },
  },
  {
    accessorKey: "quantity",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Enter the number of stock units you want to buy or sell."
        title="Quantity"
      />
    ),
    cell: ({ row, column, table }) => {
      const defaultValue = (row.getValue(column.id) as string) || "0"
      const [quantity, setQuantity] = useState<string>(defaultValue)
      const updateData = table.options.meta?.updateData

      useEffect(() => {
        setQuantity(defaultValue)
      }, [defaultValue])

      const handleBlurQuantity = () => {
        if (+quantity === +defaultValue) return

        const askPrice = row.getValue("askPrice") as number

        const updatedCost = askPrice * +quantity
        updateData?.(row.index, { [column.id]: +quantity, cost: +updatedCost })
      }

      return (
        <CurrencyInput
          className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
          name="quantity"
          id={`quantity-${row.index}`}
          value={quantity}
          onValueChange={(value: any) => setQuantity(value || "0")}
          onBlur={handleBlurQuantity}
          allowNegativeValue={false}
          allowDecimals={false}
        />
      )
    },
  },
  {
    accessorKey: "askPrice",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Enter the price you are willing to pay to purchase the stock."
        title="Ask price"
      />
    ),
    cell: ({ row, column, table }) => {
      const defaultValue = (row.getValue(column.id) as string) || "0"
      const [askPrice, setAskPrice] = useState<string>(defaultValue)

      const quantity = row.getValue("quantity") as number

      const updateData = table.options.meta?.updateData!

      useEffect(() => {
        setAskPrice(defaultValue)
      }, [defaultValue])

      const handleBlur = () => {
        if (+askPrice === +defaultValue) return

        const updatedCost = +askPrice * quantity

        updateData(row.index, { [column.id]: +askPrice, cost: +updatedCost })
      }

      return (
        <CurrencyInput
          className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
          id={`askPrice-${row.index}`}
          name="askPrice"
          value={askPrice}
          decimalsLimit={2}
          onValueChange={(value: any) => setAskPrice(value || "0")}
          onBlur={handleBlur}
          allowNegativeValue={false}
          prefix="$"
        />
      )
    },
  },
  {
    accessorKey: "cost",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="This is the total cost of the purchase based on the 'Ask Price' and 'Quantity'. Formula: Ask Price * Quantity."
        title="Cost"
      />
    ),
    cell: ({ row, column, table }) => {
      const defaultValue = (row.getValue(column.id) as number) || 0
      const formattedCost = defaultValue.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })
      return <div className="text-center w-24">${formattedCost}</div>
    },
  },
  {
    accessorKey: "exitPrice",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Enter the price at which you plan to sell the stock."
        title="Exit price"
      />
    ),
    cell: ({ row, column, table }) => {
      const defaultValue = (row.getValue(column.id) as string) || "0"
      const [exitPrice, setExitPrice] = useState<string>(defaultValue)

      const positionType = row.getValue("positionType") as string
      const quantity = row.getValue("quantity") as number
      const askPrice = row.getValue("askPrice") as number
      const totalCost = row.getValue("cost") as number

      useEffect(() => {
        setExitPrice(defaultValue)
      }, [defaultValue])

      const updateData = table.options.meta?.updateData

      const handleBlurExitPrice = () => {
        if (+defaultValue === +exitPrice || isNaN(+exitPrice)) return

        // Calculate Expected Profit
        const calc = +exitPrice * quantity - askPrice * quantity
        const expectedProfit = positionType === "buy" ? calc : calc * -1

        //prettier-ignore
        const expectedProfitPercent = (expectedProfit / totalCost) * 100;

        updateData?.(row.index, {
          [column.id]: +exitPrice,
          expectedProfit: expectedProfit,
          expectedProfitPercent: expectedProfitPercent,
        })

        setExitPrice(parseFloat(exitPrice).toFixed(2))
      }

      return (
        <CurrencyInput
          className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
          id={`exitPrice-${row.index}`}
          value={exitPrice}
          onValueChange={(value?: string) => setExitPrice(value || "0")}
          onBlur={handleBlurExitPrice}
          decimalsLimit={2}
          allowNegativeValue={false}
          prefix="$"
        />
      )
    },
  },
  {
    accessorKey: "expectedProfit",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="The expected profit from the transaction. Formula: (Exit Price - Ask Price) * Quantity. Positive for 'Buy', negative for 'Sell'."
        title="Exp. Profit"
      />
    ),
    cell: ({ row, column, table }) => {
      const defaultValue = row.getValue(column.id) as number

      const positionType = row.getValue("positionType") as string
      const exitPrice = row.getValue("exitPrice") as number
      const quantity = row.getValue("quantity") as number
      const askPrice = row.getValue("askPrice") as number
      const cost = row.getValue("cost") as number

      const calculateExpectedProfit = () => {
        if (!exitPrice) return 0

        const calc = exitPrice * quantity - askPrice * quantity
        return positionType === "buy" ? calc : calc * -1
      }

      const updateData = table.options.meta?.updateData!

      let updatedProfit = Math.max(calculateExpectedProfit(), 0)

      useEffect(() => {
        let updatedProfitPer = (updatedProfit / cost) * 100

        if (defaultValue !== updatedProfit) {
          updateData(row.index, {
            [column.id]: +updatedProfit,
            expectedProfitPercent: +updatedProfitPer,
          })
        }
      }, [defaultValue, quantity, askPrice, cost, positionType])

      const formattedProfit = (updatedProfit || 0).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })

      return (
        <div className="text-center w-24 text-green-500">
          ${formattedProfit}
        </div>
      )
    },
  },
  {
    accessorKey: "expectedProfitPercent",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="The expected profit as a percentage of the total cost. Formula: (Expected Profit / Total Cost) * 100. Only positive values are allowed."
        title="Exp. Profit %"
      />
    ),
    cell: ({ row, column, table }) => {
      const initialData = row.getValue(column.id) as string
      const quantity = row.getValue("quantity") as number
      const askPrice = row.getValue("askPrice") as number
      const totalCost = row.getValue("cost") as number
      const expectedProfit = row.getValue("expectedProfit") as number
      const exitPrice = row.getValue("exitPrice") as number
      const positionType = row.getValue("positionType") as string

      const updateData = table.options.meta?.updateData

      const calculateProfitPercent = () => {
        if (!totalCost || !exitPrice || !quantity || !askPrice) return "0"

        const res = (expectedProfit / totalCost) * 100
        return Math.round(res).toString()
      }

      const [profitPercent, setProfitPercent] = useState(initialData)

      useEffect(() => {
        const newProfitPercent = calculateProfitPercent()

        if (newProfitPercent !== profitPercent) {
          setProfitPercent(newProfitPercent)
          // updateData?.(row.index, { [column.id]: +newProfitPercent })
        }
      }, [expectedProfit, initialData])

      const handleBlur = () => {
        const newProfitPercent = Math.round(+profitPercent)
        //prettier-ignore
        if (Math.round(+initialData) === newProfitPercent || isNaN(newProfitPercent)) return
        const newExpectedProfit = (+profitPercent * totalCost) / 100
        const newExitPrice =
          positionType === "buy"
            ? newExpectedProfit / quantity + askPrice
            : (askPrice - newExpectedProfit / quantity).toFixed(2)

        if (!isNaN(+newExitPrice) && +newExitPrice > 0) {
          updateData?.(row.index, {
            [column.id]: +profitPercent,
            expectedProfit: +newExpectedProfit,
            exitPrice: newExitPrice,
          })
        }
      }

      return (
        <CurrencyInput
          allowDecimals={false}
          allowNegativeValue={false}
          suffix="%"
          className="flex h-9 w-24 text-center border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm  text-green-500"
          value={profitPercent}
          onValueChange={(value) => setProfitPercent(value || "0")}
          onBlur={handleBlur}
        />
      )
    },
  },
  {
    accessorKey: "stopLoss",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Enter the stop-loss price. This is the price at which you will sell the stock to limit your loss."
        title="Stop Loss"
      />
    ),
    cell: ({ row, column, table }) => {
      const initialValue = (row.getValue(column.id) as string) || "0"
      const [stopLoss, setStopLoss] = useState<string>(initialValue)

      const positionType = row.getValue("positionType") as string
      const askPrice = row.getValue("askPrice") as number
      const quantity = row.getValue("quantity") as number
      const totalCost = row.getValue("cost") as number

      useEffect(() => {
        setStopLoss(initialValue)
      }, [initialValue])

      const updateData = table.options.meta?.updateData!

      const handleBlur = () => {
        if (+initialValue === +stopLoss) return

        if (+stopLoss === 0) {
          updateData(row.index, {
            [column.id]: 0,
            expectedLoss: 0,
            expectedLossPercent: 0,
          })
          return
        }

        let expectedLoss = quantity * +stopLoss - quantity * askPrice
        expectedLoss = positionType === "buy" ? expectedLoss * -1 : expectedLoss

        const expectedLossPercent = (expectedLoss / totalCost) * 100

        updateData?.(row.index, {
          [column.id]: +stopLoss,
          expectedLoss: +expectedLoss,
          expectedLossPercent: Math.round(expectedLossPercent),
        })
      }

      return (
        <CurrencyInput
          className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
          id={`stopLoss-${row.index}`}
          name="stopLoss"
          value={stopLoss}
          onValueChange={(value, name, values) => {
            setStopLoss(value || "0")
          }}
          onBlur={handleBlur}
          allowNegativeValue={false}
          decimalsLimit={2}
          prefix="$"
        />
      )
    },
  },
  {
    accessorKey: "expectedLoss",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="The expected loss based on the stop-loss price. Formula: (Stop Loss Price - Ask Price) * Quantity. Positive for 'Sell', negative for 'Buy'."
        title="Exp. Loss"
      />
    ),
    cell: ({ row, column, table }) => {
      const initialValue = row.getValue(column.id) as number
      const positionType = row.getValue("positionType") as string
      const quantity = row.getValue("quantity") as number
      const askPrice = row.getValue("askPrice") as number
      const stopLoss = row.getValue("stopLoss") as number
      const cost = row.getValue("cost") as number
      const expectedLossPercent = row.getValue("expectedLossPercent") as number

      const calculateLoss = () => {
        if (!stopLoss || (stopLoss === 0 && !expectedLossPercent)) return null
        if (stopLoss >= askPrice && positionType === "buy") return 0

        const lossCalculation = quantity * stopLoss - quantity * askPrice

        if (positionType === "buy") {
          return Math.round(lossCalculation) * -1
        }
        return Math.round(lossCalculation)
      }

      const updateData = table.options.meta?.updateData

      useEffect(() => {
        let updatedLoss = calculateLoss()
        if (updatedLoss === null) return
        let updatedLossPer = Math.round((+updatedLoss / cost) * 100)
        if (updatedLoss !== null && +updatedLoss !== +initialValue) {
          updateData?.(row.index, {
            [column.id]: +updatedLoss,
            expectedLossPercent: +updatedLossPer,
          })
        }
      }, [initialValue, stopLoss, quantity, askPrice, cost, positionType])

      const displayLoss = calculateLoss()

      const formattedLoss =
        displayLoss !== null
          ? displayLoss.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })
          : ""

      const prefix = displayLoss && displayLoss > 0 ? "-" : ""

      return (
        <div className="text-center w-24 text-red-500">
          {formattedLoss !== "" ? `$${prefix}${formattedLoss}` : ""}
        </div>
      )
    },
  },
  {
    accessorKey: "expectedLossPercent",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="The expected loss as a percentage of the total cost. Formula: (Expected Loss / Total Cost) * 100."
        title="Exp. Loss %"
      />
    ),
    cell: ({ row, column, table }) => {
      const initialData = row.getValue(column.id) as string
      const quantity = row.getValue("quantity") as number
      const askPrice = row.getValue("askPrice") as number
      const stopLoss = row.getValue("stopLoss") as number
      const expectedLoss = row.getValue("expectedLoss") as number
      const totalCost = row.getValue("cost") as number
      const positionType = row.getValue("positionType") as string
      const updateData = table.options.meta?.updateData

      const calcLossPercent = (): string => {
        if (!totalCost || !quantity || !askPrice || !+expectedLoss) return "0"
        const res = (expectedLoss / totalCost) * 100
        return Math.round(res).toString()
      }

      const [lossPercent, setLossPercent] = useState(initialData)

      useEffect(() => {
        const updatedLossPercent = calcLossPercent()

        if (+updatedLossPercent !== +lossPercent) {
          setLossPercent(updatedLossPercent)
        }
      }, [expectedLoss, totalCost, quantity, askPrice, stopLoss])

      const handleBlur = () => {
        if (Math.round(+initialData) === Math.round(+lossPercent)) return
        const absoluteLoss = Math.abs(+lossPercent)
        const newExpectedLoss = ((+absoluteLoss * +totalCost) / 100) * -1
        let newStopLoss =
          positionType === "sell"
            ? Math.abs(newExpectedLoss) / quantity + askPrice
            : newExpectedLoss / quantity + askPrice
        updateData?.(row.index, {
          expectedLossPercent: +lossPercent,
          expectedLoss: Math.round(newExpectedLoss),
          stopLoss: Math.max(newStopLoss, 0),
        })
      }

      const prefix = +lossPercent > 0 ? "-" : ""

      return (
        <CurrencyInput
          allowDecimals={false}
          allowNegativeValue={false}
          suffix="%"
          prefix={prefix}
          className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm text-red-500"
          value={lossPercent}
          onValueChange={(value?: string) => setLossPercent(value || "0")}
          onBlur={handleBlur}
        />
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
]
