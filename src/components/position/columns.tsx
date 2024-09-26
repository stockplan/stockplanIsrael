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
import {
  calculateCost,
  calculateExitPriceFromProfitPercent,
  calculateExpectedLoss,
  calculateExpectedLossPercent,
  calculateExpectedProfit,
  calculateExpectedProfitPercent,
  calculateStopLossFromLossPercent,
} from "@/utils/calc-helpers"

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
        const expProfit = calculateExpectedProfit("sell", askPrice, exitPrice, quantity)
        const expectedProfitPercent = calculateExpectedProfitPercent(
          exitPrice,
          cost
        )
        updateData?.(row.index, {
          [column.id]: "sell",
          expectedProfit: +expProfit,
          expectedProfitPercent: +expectedProfitPercent,
        })
      }

      const chooseBuy = () => {
        //prettier-ignore
        const expProfit = calculateExpectedProfit("buy", askPrice, exitPrice, quantity)
        const expectedProfitPercent = calculateExpectedProfitPercent(
          exitPrice,
          cost
        )

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
        const updatedCost = calculateCost(askPrice, quantity)

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
      const updateData = table.options.meta?.updateData!

      useEffect(() => {
        setAskPrice(defaultValue)
      }, [defaultValue])

      const handleBlur = () => {
        if (+askPrice === +defaultValue) return

        const quantity = row.getValue("quantity") as number
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

      useEffect(() => {
        setExitPrice(defaultValue)
      }, [defaultValue])

      const updateData = table.options.meta?.updateData

      const handleBlurExitPrice = () => {
        if (+defaultValue === +exitPrice || isNaN(+exitPrice)) return

        const expectedProfit = calculateExpectedProfit(
          positionType,
          askPrice,
          exitPrice,
          quantity
        )

        const cost = calculateCost(askPrice, quantity)

        //prettier-ignore
        const expectedProfitPercent = calculateExpectedProfitPercent(expectedProfit, cost)

        updateData?.(row.index, {
          [column.id]: +exitPrice,
          expectedProfit: expectedProfit,
          expectedProfitPercent: expectedProfitPercent,
        })
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
        tooltipMsg="Buy: Quantity * (Exit Price−Ask Price), Sell: Quantity * (Ask Price − Exit Price) "
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
      const stopLoss = row.getValue("stopLoss") as number
      const expectedProfitPercent = row.getValue(
        "expectedProfitPercent"
      ) as number
      const updateData = table.options.meta?.updateData!

      let updatedProfit = calculateExpectedProfit(
        positionType,
        askPrice,
        exitPrice,
        quantity
      )

      useEffect(() => {
        const updatedProfitPercent = calculateExpectedProfitPercent(
          updatedProfit,
          cost
        )

        if (
          +defaultValue !== +updatedProfit ||
          expectedProfitPercent !== updatedProfitPercent
        ) {
          updateData(row.index, {
            [column.id]: +updatedProfit,
            expectedProfitPercent: +updatedProfitPercent,
          })
        }
      }, [defaultValue, quantity, askPrice, cost, positionType, stopLoss])

      const formattedProfit = (updatedProfit || 0).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })

      return (
        <div className="text-center w-24 text-green-500">
          {formattedProfit !== "" ? `$${formattedProfit}` : "0"}
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
      const cost = row.getValue("cost") as number
      const expectedProfit = row.getValue("expectedProfit") as number
      const positionType = row.getValue("positionType") as string
      const [isEditing, setIsEditing] = useState(false)
      const exitPrice = row.getValue("exitPrice") as number
      const updateData = table.options.meta?.updateData

      const [profitPercent, setProfitPercent] = useState(initialData)

      useEffect(() => {
        if (!isEditing) {
          const newExpectedLoss = calculateExpectedProfit(
            positionType,
            askPrice,
            exitPrice,
            quantity
          )
          const newProfitPercent = calculateExpectedProfitPercent(
            newExpectedLoss,
            cost
          )

          if (+newProfitPercent !== +profitPercent) {
            setProfitPercent(newProfitPercent.toString())
          }
        }
      }, [
        expectedProfit,
        cost,
        quantity,
        askPrice,
        positionType,
        expectedProfit,
        isEditing,
      ])

      //       Expected Profit = Expected Profit % * cost / 100
      //       Exit Price = (Expected Profit / Quantity) + Ask Price

      const handleBlur = () => {
        setIsEditing(false)
        //prettier-ignore
        if (+initialData === +profitPercent || isNaN(+profitPercent)) return

        const newExpectedProfit = (+profitPercent * cost) / 100

        const newExitPrice = calculateExitPriceFromProfitPercent(
          positionType,
          askPrice,
          profitPercent,
          cost,
          quantity
        )

        updateData?.(row.index, {
          [column.id]: +profitPercent,
          expectedProfit: +newExpectedProfit,
          exitPrice: +newExitPrice,
        })
      }

      return (
        <CurrencyInput
          allowNegativeValue={false}
          decimalsLimit={2}
          suffix="%"
          className="flex h-9 w-24 text-center border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm  text-green-500"
          value={profitPercent}
          onValueChange={(value) => {
            setProfitPercent(value || "0")
            setIsEditing(true)
          }}
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
      const updateData = table.options.meta?.updateData!

      useEffect(() => {
        setStopLoss(initialValue)
      }, [initialValue])

      const handleBlur = () => {
        if (+initialValue === +stopLoss) return

        const positionType = row.getValue("positionType") as string
        const askPrice = row.getValue("askPrice") as number
        const quantity = row.getValue("quantity") as number
        const totalCost = row.getValue("cost") as number

        let expectedLoss = calculateExpectedLoss(
          positionType,
          askPrice,
          stopLoss,
          quantity
        )

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
        tooltipMsg={`Buy: (stopLoss - askPrice) * quantity. \t\t\n    Sell: (askPrice - stopLoss) * quantity `}
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
      const expectedLossPercent = row.getValue("expectedLossPercent")
      const updateData = table.options.meta?.updateData

      let updatedLoss = calculateExpectedLoss(
        positionType,
        askPrice,
        stopLoss,
        quantity
      )

      useEffect(() => {
        let updatedLossPer = calculateExpectedLossPercent(updatedLoss, cost)

        if (
          expectedLossPercent !== updatedLossPer &&
          +updatedLoss !== +initialValue
        ) {
          updateData?.(row.index, {
            [column.id]: +updatedLoss,
            expectedLossPercent: +updatedLossPer,
          })
        }
      }, [initialValue, stopLoss, quantity, askPrice, cost, positionType])

      const formattedLoss =
        updatedLoss !== null
          ? updatedLoss.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })
          : ""

      return (
        <div className="text-center w-24 text-red-500">
          {formattedLoss !== "" ? `$${formattedLoss}` : ""}
        </div>
      )
    },
  },
  {
    accessorKey: "expectedLossPercent",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg={`Formula: (Expected Loss / Total Cost) * 100.`}
        title="Exp. Loss %"
      />
    ),
    cell: ({ row, column, table }) => {
      const initialData = row.getValue(column.id) as string
      const quantity = row.getValue("quantity") as number
      const askPrice = row.getValue("askPrice") as number
      const stopLoss = row.getValue("stopLoss") as number
      const totalCost = row.getValue("cost") as number
      const positionType = row.getValue("positionType") as string
      const updateData = table.options.meta?.updateData

      const [lossPercent, setLossPercent] = useState(initialData)
      const [isEditing, setIsEditing] = useState(false)

      useEffect(() => {
        if (!isEditing) {
          // Calculate expected loss based on the stop loss, quantity, and position type
          const updatedExpectedLoss = calculateExpectedLoss(
            positionType,
            askPrice,
            stopLoss,
            quantity
          )

          const updatedLossPercent = calculateExpectedLossPercent(
            updatedExpectedLoss,
            totalCost
          )

          // Update the lossPercent state only if the calculated value differs from the current state
          if (+updatedLossPercent !== +lossPercent) {
            setLossPercent(updatedLossPercent.toString()) // Set lossPercent with two decimal precision
          }
        }
      }, [
        stopLoss,
        totalCost,
        quantity,
        askPrice,
        positionType,
        lossPercent,
        isEditing,
      ])

      const handleBlur = () => {
        setIsEditing(false) // Stop editing

        // Do not update if the input hasn't changed
        if (+initialData === +lossPercent || isNaN(+lossPercent)) return

        // Calculate the new expected loss based on the user-defined percent
        const newExpectedLoss = (+lossPercent / 100) * totalCost * -1

        // Recalculate the stop loss value from the user-defined expected loss
        const newStopLoss = calculateStopLossFromLossPercent(
          positionType,
          lossPercent,
          totalCost,
          quantity,
          askPrice
        )

        // Update the state and table data
        updateData?.(row.index, {
          [column.id]: +lossPercent,
          expectedLoss: +newExpectedLoss,
          stopLoss: Math.max(newStopLoss, 0),
        })
      }

      return (
        <CurrencyInput
          decimalsLimit={2}
          allowNegativeValue={true}
          suffix="%"
          className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm text-red-500"
          value={lossPercent}
          onValueChange={(value?: string) => {
            setLossPercent(value || "0")
            setIsEditing(true) // Set editing mode to true when the user changes the input
          }}
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
