import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {};

const MobileMainTicker = (props: Props) => {
  return (
    <div>
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
        <Button className="bg-red-600 w-1/2">Sell</Button>
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

        <div className="flex justify-between mt-4 text-lg">
          <div className="text-green-500">Exp. profit: {"**"}$</div>
          <div className="text-red-500">Exp. Loss: {"**"}$</div>
        </div>
      </div>
    </div>
  );
};

export default MobileMainTicker;
