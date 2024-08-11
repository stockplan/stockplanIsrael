"use client"

import { CellContext, ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Position } from "@/schemas"
import TickerCell from "../cells/TickerCell"
import PositionTypeCell from "../cells/PositionTypeCell"
import QuantityCell from "../cells/QuantityCell"
import AskPriceCell from "../cells/AskPriceCell"
import ExitPriceCell from "../cells/ExitPriceCell"
import StopLossCell from "../cells/StopLossCell"
import ExpectedProfitPercentCell from "../cells/ExpectedProfitPercentCell"
import ExpectedLossPercentCell from "../cells/ExpectedLossPercentCell"
import ExpectedProfitCell from "../cells/ExpectedProfitCell"
import TotalCostCell from "../cells/TotalCostCell"
import ExpectedLossCell from "../cells/ExpectedLossCell"
import ActualPriceCell from "../cells/ActualPrice"
// import DaysToTargetCell from "../cells/DaysToTargetCell"

export type CellType = CellContext<Position, unknown>

export const columns: ColumnDef<Position>[] = [
  {
    accessorKey: "ticker",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Enter stock name. Displayed in uppercase."
        title="Ticker"
      />
    ),
    cell: TickerCell,
  },
  {
    accessorKey: "actualPrice",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Current stock price (read-only)."
        title="Actual Price"
      />
    ),
    cell: ActualPriceCell,
  },
  {
    accessorKey: "positionType",
    header: () => (
      <DataTableColumnHeader tooltipMsg="Sell or Buy" title="Long / Short" />
    ),
    cell: PositionTypeCell,
  },

  {
    accessorKey: "quantity",
    header: () => (
      <DataTableColumnHeader tooltipMsg="Quantity" title="Quantity" />
    ),
    cell: QuantityCell,
  },
  {
    accessorKey: "askPrice",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Offer price for purchase."
        title="Ask price"
      />
    ),
    cell: AskPriceCell,
  },
  {
    accessorKey: "cost",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Purchase cost (view-only)."
        title="Cost"
      />
    ),
    cell: TotalCostCell,
  },
  {
    accessorKey: "exitPrice",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Exit price for selling."
        title="Exit price"
      />
    ),
    cell: ExitPriceCell,
  },
  {
    accessorKey: "expectedProfit",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Expected profit (view-only)."
        title="Exp. Profit"
      />
    ),
    cell: ExpectedProfitCell,
    accessorFn: (row) => row.expectedProfit,
  },
  {
    accessorKey: "expectedProfitPercent",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Expected profit percentage."
        title="Exp. Profit %"
      />
    ),
    cell: ExpectedProfitPercentCell,
  },
  {
    accessorKey: "stopLoss",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Exit price at a loss."
        title="Stop Loss"
      />
    ),
    cell: StopLossCell,
  },
  {
    accessorKey: "expectedLoss",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Expected loss (view-only)."
        title="Exp. Loss"
      />
    ),
    cell: ExpectedLossCell,
  },
  {
    accessorKey: "expectedLossPercent",
    header: () => (
      <DataTableColumnHeader
        tooltipMsg="Expected loss percentage."
        title="Exp. Loss %"
      />
    ),
    cell: ExpectedLossPercentCell,
  },
  // {
  //   accessorKey: "daysLeft",
  //   header: () => (
  //     <DataTableColumnHeader
  //       tooltipMsg="Days to target"
  //       title="Days To Target"
  //     />
  //   ),
  //   cell: DaysToTargetCell,
  // },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
]
