import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Position } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface MobileLayoutProps {
  columns: ColumnDef<Position>[]; // need to change it from table
  creator: string;
  serverUserStocks: Position[];
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  columns,
  creator,
  serverUserStocks,
}) => {
  return (
    <div className="p-4 bg-gray-800 text-white">
      <div className="text-center mb-4"></div>

      <div className="bg-gray-900 p-4 rounded-md">
        {/* <img src="/logo.png" alt="StocksPlan.com" className="mx-auto" /> */}
        <h2 className="text-xl font-semibold mt-2">
          Quick Profit & Loss Calculator
        </h2>

        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex justify-between items-center">
            <Input
              value="AAPL"
              readOnly
              className="w-1/2 border-none bg-transparent focus:outline-none text-white"
            />
            <Input
              value="100$"
              readOnly
              className="w-1/2 text-right border-none bg-transparent focus:outline-none text-white"
            />
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <Button className="bg-green-500 w-1/2 mr-2">Buy</Button>
          <Button className="bg-gray-600 w-1/2">Sell</Button>
        </div>

        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Quantity</label>
            <Input
              type="number"
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Ask Price</label>
            <Input
              type="number"
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
            />
          </div>
        </div>

        {/* Cost Field (No border, flex alignment) */}
        <div className="mb-2">
          <div className="p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Cost</label>
            <Input
              readOnly
              value="100$"
              className="w-1/2 border-none bg-transparent focus:outline-none text-white text-right"
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Exit Price</label>
            <Input
              type="number"
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Expected Profit %</label>
            <Input
              readOnly
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Stop Loss</label>
            <Input
              type="number"
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="border border-gray-600 p-2 rounded-md flex items-center justify-between">
            <label className="text-sm mr-2">Expected Loss %</label>
            <Input
              readOnly
              className="w-1/2 border-none bg-transparent focus:outline-none text-right"
            />
          </div>
        </div>

        <div className="flex justify-between mt-4 text-lg">
          <div className="text-green-500">Exp. profit: {"**"}$</div>
          <div className="text-red-500">Exp. Loss: {"**"}$</div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button className="bg-gray-700 w-full">+ Add Ticker</Button>
      </div>

      <div className="mt-6 text-center">
        <div className="text-green-400">Total Profit: 20$</div>
        <div>Total Investment: 214$</div>
        <div className="text-red-400">Total Loss: 5$</div>
        <div>Total Stocks: 5</div>
      </div>
    </div>
  );
};

export default MobileLayout;
