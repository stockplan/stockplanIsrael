// "use client";

// import { CellContext, ColumnDef } from "@tanstack/react-table";
// // import { DataTableColumnHeader } from "./data-table-column-header";
// // import { DataTableRowActions } from "./data-table-row-actions";
// // import { Position } from "@/schemas";
// // import ActualPriceCell from "../cells/ActualPrice";
// import { useEffect, useState } from "react";
// import { Input } from "../ui/input";
// import { mutate } from "swr";
// import CurrencyInput from "react-currency-input-field";
// import {
//   calculateCost,
//   calculateExitPriceFromProfitPercent,
//   calculateExpectedLoss,
//   calculateExpectedLossPercent,
//   calculateExpectedProfit,
//   calculateExpectedProfitPercent,
//   calculateStopLossFromLossPercent,
// } from "@/utils/calc-helpers";
// import { formatFractionDigits } from "@/utils/helpers";
// import { ColumnNames, Position } from "@/types";
// import ActualPriceCell from "@/app/home/calculator/_components/ActualPrice";
// import { DataTableColumnHeader } from "@/app/home/calculator/_components/data-table-column-header";
// import { DataTableRowActions } from "@/app/home/calculator/_components/data-table-row-actions";

// export type CellType = CellContext<Position, unknown>;

// export const columns: ColumnDef<Position>[] = [
//   {
//     accessorKey: "ticker",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg="Enter the stock's ticker symbol (e.g., AAPL, MSFT). The ticker will be displayed in uppercase."
//         title="Ticker"
//       />
//     ),
//     cell: ({ getValue, row, column, table }) => {
//       const initialValue = getValue() as string;
//       const [localTicker, setLocalTicker] = useState<string>(initialValue);
//       const updateData = table.options.meta!.updateData!;

//       const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value.toUpperCase();
//         if (/^[A-Z]*$/.test(value)) {
//           setLocalTicker(value);
//         }
//       };

//       const handleBlur = () => {
//         if (initialValue !== localTicker) {
//           if (!localTicker) {
//             updateData(row.index, {
//               [column.id]: "",
//               actualPrice: 0,
//             });
//           } else {
//             updateData(row.index, {
//               [column.id]: localTicker,
//             });
//             mutate(["/api/tickerPrice", localTicker]);
//           }
//         }
//       };

//       useEffect(() => {
//         setLocalTicker(initialValue);
//       }, [initialValue]);

//       return (
//         <Input
//           className="w-24"
//           type="text"
//           value={localTicker}
//           onChange={handleChange}
//           onBlur={handleBlur}
//         />
//       );
//     },
//   },
//   {
//     accessorKey: "actualPrice",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg="The current market price of the stock. This value is automatically fetched and cannot be edited."
//         title="Actual Price"
//       />
//     ),
//     cell: ActualPriceCell,
//   },
//   {
//     accessorKey: "positionType",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg="Choose 'Buy' if you plan to purchase the stock, or 'Sell' if you plan to sell it."
//         title="Long / Short"
//       />
//     ),
//     cell: ({ row, column, table }) => {
//       const positionType = row.getValue(column.id) as string;
//       const updateData = table.options.meta?.updateData;
//       const quantity = row.getValue(ColumnNames.Quantity) as number;
//       const askPrice = row.getValue(ColumnNames.AskPrice) as number;
//       const exitPrice = row.getValue(ColumnNames.ExitPrice) as number;
//       const cost = row.getValue(ColumnNames.Cost) as number;
//       const stopLoss = row.getValue(ColumnNames.StopLoss) as number;

//       const chooseSell = () => {
//         //prettier-ignore
//         const expProfit = calculateExpectedProfit( "sell", askPrice, exitPrice, quantity)
//         //prettier-ignore
//         const expectedProfitPercent = calculateExpectedProfitPercent(expProfit,cost)
//         //prettier-ignore
//         const expLoss = calculateExpectedLoss("sell", askPrice, stopLoss, quantity)
//         const expLossPercent = calculateExpectedLossPercent(expLoss, cost);

//         updateData?.(row.index, {
//           [column.id]: "sell",
//           expectedProfit: +expProfit,
//           expectedProfitPercent: +expectedProfitPercent,
//           expectedLoss: +expLoss,
//           expectedLossPercent: +expLossPercent,
//         });
//       };

//       const chooseBuy = () => {
//         //prettier-ignore
//         const expProfit = calculateExpectedProfit("buy", askPrice, exitPrice, quantity)
//         //prettier-ignore
//         const expectedProfitPercent = calculateExpectedProfitPercent(expProfit, cost)
//         //prettier-ignore
//         const expLoss = calculateExpectedLoss("buy", askPrice, stopLoss, quantity)
//         const expLossPercent = calculateExpectedLossPercent(expLoss, cost);

//         updateData?.(row.index, {
//           [column.id]: "buy",
//           expectedProfit: +expProfit,
//           expectedProfitPercent: +expectedProfitPercent,
//           expectedLoss: expLoss,
//           expectedLossPercent: expLossPercent,
//         });
//       };

//       return (
//         <div className="flex gap-2 w-28 items-center justify-center">
//           <button
//             className={`px-2 py-1 rounded text-white ${
//               positionType === "buy" ? "bg-green-500" : "bg-gray-400"
//             }`}
//             onClick={chooseBuy}
//           >
//             Buy
//           </button>
//           <button
//             className={`px-2 py-1 rounded text-white ${
//               positionType === "sell" ? "bg-red-500" : "bg-gray-400"
//             }`}
//             onClick={chooseSell}
//           >
//             Sell
//           </button>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "quantity",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg="Enter the number of stock units you want to buy or sell."
//         title="Quantity"
//       />
//     ),
//     cell: ({ row, column, table }) => {
//       const defaultValue = row.getValue(column.id) as number;
//       const [quantity, setQuantity] = useState<number>(defaultValue);
//       const updateData = table.options.meta?.updateData;

//       useEffect(() => {
//         setQuantity(defaultValue);
//       }, [defaultValue]);

//       const handleBlurQuantity = () => {
//         if (quantity === +defaultValue) return;
//         const positionType = row.getValue(ColumnNames.PositionType) as string;
//         const exitPrice = row.getValue(ColumnNames.ExitPrice) as number;
//         const askPrice = row.getValue(ColumnNames.AskPrice) as number;
//         const stopLoss = row.getValue(ColumnNames.StopLoss) as number;

//         const updatedCost = calculateCost(askPrice, quantity);
//         //prettier-ignore
//         const expectedProfit = calculateExpectedProfit( positionType, askPrice, exitPrice, quantity)
//         //prettier-ignore
//         const expectedProfitPercent = calculateExpectedProfitPercent(expectedProfit, updatedCost)
//         //prettier-ignore
//         const expectedLoss = calculateExpectedLoss(positionType, askPrice, stopLoss, quantity)
//         //prettier-ignore
//         const expectedLossPercent = calculateExpectedLossPercent(expectedLoss, updatedCost)

//         updateData?.(row.index, {
//           [column.id]: +quantity,
//           cost: +updatedCost,
//           expectedProfit,
//           expectedProfitPercent,
//           expectedLoss,
//           expectedLossPercent,
//         });
//       };

//       return (
//         <CurrencyInput
//           className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
//           name="quantity"
//           id={`quantity-${row.index}`}
//           value={quantity}
//           onValueChange={(value, name, values) => {
//             const val = (values && values.float ? values.float : 0) as number;
//             setQuantity(val);
//           }}
//           onBlur={handleBlurQuantity}
//           allowNegativeValue={false}
//           allowDecimals={false}
//         />
//       );
//     },
//   },
//   {
//     accessorKey: "askPrice",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg="Enter the price you are willing to pay to purchase the stock."
//         title="Ask price"
//       />
//     ),
//     cell: ({ row, column, table }) => {
//       const defaultValue = (row.getValue(column.id) as string) || "0";
//       const [askPrice, setAskPrice] = useState<string>(defaultValue);
//       const updateData = table.options.meta?.updateData!;

//       useEffect(() => {
//         setAskPrice(defaultValue);
//       }, [defaultValue]);

//       const handleBlur = () => {
//         if (+askPrice === +defaultValue) return;
//         const quantity = row.getValue(ColumnNames.Quantity) as number;
//         const positionType = row.getValue(ColumnNames.PositionType) as string;
//         const exitPrice = row.getValue(ColumnNames.ExitPrice) as number;
//         const stopLoss = row.getValue(ColumnNames.StopLoss) as number;

//         const updatedCost = calculateCost(askPrice, quantity);
//         //prettier-ignore
//         const expectedProfit = calculateExpectedProfit( positionType, askPrice, exitPrice, quantity)
//         //prettier-ignore
//         const expectedProfitPercent = calculateExpectedProfitPercent(expectedProfit, updatedCost)
//         //prettier-ignore
//         const expectedLoss = calculateExpectedLoss(positionType, askPrice, stopLoss, quantity)
//         //prettier-ignore
//         const expectedLossPercent = calculateExpectedLossPercent(expectedLoss, updatedCost)

//         updateData(row.index, {
//           [column.id]: +askPrice,
//           cost: +updatedCost,
//           expectedProfit,
//           expectedProfitPercent,
//           expectedLoss,
//           expectedLossPercent,
//         });
//       };

//       return (
//         <CurrencyInput
//           className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
//           id={`askPrice-${row.index}`}
//           name="askPrice"
//           value={askPrice}
//           decimalsLimit={2}
//           onValueChange={(value: any) => setAskPrice(value || "0")}
//           onBlur={handleBlur}
//           allowNegativeValue={false}
//           prefix="$"
//         />
//       );
//     },
//   },
//   {
//     accessorKey: "cost",
//     header: () => (
//       <DataTableColumnHeader tooltipMsg="Ask Price * Quantity." title="Cost" />
//     ),
//     cell: ({ row, column, table }) => {
//       const defaultValue = (row.getValue(column.id) as number) || 0;
//       const formattedCost = formatFractionDigits(defaultValue);
//       return <div className="text-center w-24">${formattedCost}</div>;
//     },
//   },
//   {
//     accessorKey: "exitPrice",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg="(Expected Profit / Quantity) + Ask Price"
//         title="Exit price"
//       />
//     ),
//     cell: ({ row, column, table }) => {
//       const defaultValue = (row.getValue(column.id) as string) || "0";
//       const [exitPrice, setExitPrice] = useState<string>(defaultValue);

//       const positionType = row.getValue(ColumnNames.PositionType) as string;
//       const quantity = row.getValue(ColumnNames.Quantity) as number;
//       const askPrice = row.getValue(ColumnNames.AskPrice) as number;

//       useEffect(() => {
//         setExitPrice(formatFractionDigits(+defaultValue));
//       }, [defaultValue]);

//       const updateData = table.options.meta?.updateData;

//       const handleBlurExitPrice = () => {
//         if (+defaultValue === +exitPrice || isNaN(+exitPrice)) return;

//         const expectedProfit = calculateExpectedProfit(
//           positionType,
//           askPrice,
//           exitPrice,
//           quantity
//         );

//         const cost = calculateCost(askPrice, quantity);

//         //prettier-ignore
//         const expectedProfitPercent = calculateExpectedProfitPercent(expectedProfit, cost)

//         updateData?.(row.index, {
//           [column.id]: +exitPrice,
//           expectedProfit: expectedProfit,
//           expectedProfitPercent: expectedProfitPercent,
//         });
//       };

//       return (
//         <CurrencyInput
//           className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
//           id={`exitPrice-${row.index}`}
//           value={exitPrice}
//           onValueChange={(value?: string) => setExitPrice(value || "0")}
//           onBlur={handleBlurExitPrice}
//           decimalsLimit={2}
//           allowNegativeValue={false}
//           prefix="$"
//         />
//       );
//     },
//   },
//   {
//     accessorKey: "expectedProfit",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg="Buy: Quantity * (Exit Price - Ask Price). Sell: Quantity * (Ask Price - Exit Price)."
//         title="Exp. Profit"
//       />
//     ),
//     cell: ({ row, column, table }) => {
//       const initialValue = row.getValue(column.id) as number;
//       const [expectedProfit, setExpectedProfit] = useState(initialValue);

//       useEffect(() => {
//         if (initialValue < 0) {
//           setExpectedProfit(0);
//         } else {
//           setExpectedProfit(+initialValue.toFixed(2));
//         }
//       }, [initialValue]);
//       const formatted = formatFractionDigits(initialValue);

//       return (
//         <div className="text-center w-24 text-green-500">${expectedProfit}</div>
//       );
//     },
//   },
//   {
//     accessorKey: "expectedProfitPercent",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg="(Expected Profit / Cost) * 100."
//         title="Exp. Profit %"
//       />
//     ),
//     cell: ({ row, column, table }) => {
//       const initialValue = row.getValue(column.id) as string;
//       const quantity = row.getValue(ColumnNames.Quantity) as number;
//       const askPrice = row.getValue(ColumnNames.AskPrice) as number;
//       const cost = row.getValue(ColumnNames.Cost) as number;
//       const updateData = table.options.meta?.updateData;
//       const [profitPercent, setProfitPercent] = useState<string>(initialValue);

//       useEffect(() => {
//         if (+initialValue < 0) {
//           setProfitPercent("0");
//         } else {
//           setProfitPercent(formatFractionDigits(+initialValue));
//         }
//       }, [initialValue]);

//       const handleBlur = () => {
//         if (+initialValue < 0 && +profitPercent === 0) {
//           setProfitPercent("0");
//           return;
//         }
//         //prettier-ignore
//         if (initialValue=== profitPercent || formatFractionDigits(+initialValue) === profitPercent) return
//         const newExpectedProfit = (+profitPercent * cost) / 100;
//         //prettier-ignore
//         const newExitPrice = calculateExitPriceFromProfitPercent( askPrice, newExpectedProfit, quantity)

//         updateData?.(row.index, {
//           [column.id]: +profitPercent,
//           expectedProfit: +newExpectedProfit,
//           exitPrice: +newExitPrice,
//         });
//       };

//       return (
//         <CurrencyInput
//           allowNegativeValue={false}
//           decimalsLimit={2}
//           suffix="%"
//           className="flex h-9 w-24 text-center border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm  text-green-500"
//           value={profitPercent}
//           onValueChange={(value, name, values) => {
//             setProfitPercent(value || "0");
//           }}
//           onBlur={handleBlur}
//         />
//       );
//     },
//   },
//   {
//     accessorKey: "stopLoss",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg="(Expected Loss / Quantity) + Ask Price"
//         title="Stop Loss"
//       />
//     ),
//     cell: ({ row, column, table }) => {
//       const initialValue = (row.getValue(column.id) as string) || "0";
//       const [stopLoss, setStopLoss] = useState<string>(initialValue);
//       const updateData = table.options.meta?.updateData!;

//       useEffect(() => {
//         if (+initialValue > 0) {
//           setStopLoss(formatFractionDigits(+initialValue));
//         } else {
//           setStopLoss(initialValue);
//         }
//       }, [initialValue]);

//       const handleBlur = () => {
//         if (+formatFractionDigits(+initialValue) === +stopLoss) return;

//         const positionType = row.getValue(ColumnNames.PositionType) as string;
//         const askPrice = row.getValue(ColumnNames.AskPrice) as number;
//         const quantity = row.getValue(ColumnNames.Quantity) as number;
//         const cost = row.getValue(ColumnNames.Cost) as number;

//         let expectedLoss = calculateExpectedLoss(
//           positionType,
//           askPrice,
//           stopLoss,
//           quantity
//         );

//         const expectedLossPercent = calculateExpectedLossPercent(
//           expectedLoss,
//           cost
//         );

//         updateData?.(row.index, {
//           [column.id]: +stopLoss,
//           expectedLoss: +expectedLoss,
//           expectedLossPercent: +expectedLossPercent,
//         });
//       };

//       return (
//         <CurrencyInput
//           className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm"
//           id={`stopLoss-${row.index}`}
//           name="stopLoss"
//           value={stopLoss}
//           onValueChange={(value, name, values) => {
//             console.log(value, name, values);

//             setStopLoss(value || "0");
//           }}
//           onBlur={handleBlur}
//           allowNegativeValue={false}
//           decimalsLimit={2}
//           prefix="$"
//         />
//       );
//     },
//   },
//   {
//     accessorKey: "expectedLoss",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg="Buy: (Stop Loss - Ask Price) * Quantity. Sell: (Ask Price - Stop Loss) * Quantity."
//         title="Exp. Loss"
//       />
//     ),
//     cell: ({ row, column, table }) => {
//       const initialValue = row.getValue(column.id) as number;
//       const [expectedLoss, setExpectedLoss] = useState(initialValue);

//       useEffect(() => {
//         if (initialValue > 0) {
//           setExpectedLoss(0);
//         } else {
//           setExpectedLoss(+initialValue.toFixed(2));
//         }
//       }, [initialValue]);

//       return (
//         <div className="text-center w-24 text-red-500">${expectedLoss}</div>
//       );
//     },
//   },
//   {
//     accessorKey: "expectedLossPercent",
//     header: () => (
//       <DataTableColumnHeader
//         tooltipMsg={`(Expected Loss / Total Cost) * 100.`}
//         title="Exp. Loss %"
//       />
//     ),
//     cell: ({ row, column, table }) => {
//       const initialValue = row.getValue(column.id) as string;
//       const quantity = row.getValue(ColumnNames.Quantity) as number;
//       const askPrice = row.getValue(ColumnNames.AskPrice) as number;
//       const cost = row.getValue(ColumnNames.Cost) as number;
//       const updateData = table.options.meta?.updateData;

//       const [lossPercent, setLossPercent] = useState(initialValue);

//       useEffect(() => {
//         if (+initialValue > 0) {
//           setLossPercent("0");
//         } else {
//           setLossPercent(formatFractionDigits(+initialValue));
//         }
//       }, [initialValue]);

//       const handleBlur = () => {
//         const newLossPer = +lossPercent > 0 ? +lossPercent * -1 : +lossPercent;
//         const formattedVal = formatFractionDigits(+initialValue);

//         setLossPercent(newLossPer + "");

//         if (+formattedVal === +newLossPer) return;

//         const absValue = Math.abs(+lossPercent);
//         // Expected Loss = (-1) * (Expected Loss % * total cost / 100)
//         const newExpectedLoss = ((absValue * cost) / 100) * -1 + 0;

//         // Stop Loss = newExpectedLoss(Expected Loss / Quantity) + Ask Price
//         let newStopLoss = calculateStopLossFromLossPercent(
//           newExpectedLoss,
//           quantity,
//           askPrice
//         );

//         updateData?.(row.index, {
//           [column.id]: newLossPer,
//           expectedLoss: +newExpectedLoss,
//           stopLoss: newStopLoss,
//         });
//       };

//       return (
//         <CurrencyInput
//           decimalsLimit={2}
//           allowNegativeValue={true}
//           suffix="%"
//           className="flex w-24 h-9 border rounded-md bg-transparent px-3 py-1 text-sm shadow-sm text-red-500"
//           value={lossPercent}
//           onValueChange={(value, name, values) => {
//             setLossPercent(value || "0");
//           }}
//           onBlur={handleBlur}
//           // transformRawValue={(val) => `-${val}`}
//         />
//       );
//     },
//   },
//   {
//     id: "actions",
//     cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
//   },
// ];
