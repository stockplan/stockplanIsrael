import { Position } from "@/types";
import React from "react";
import { Button } from "../ui/button";

interface MobileAllTickers {
  tickersData: Position[];
  selectedTicker: Position | null;
  onTickerSelect: (ticker: Position) => void;
  setshowAllTickers: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileAllTickers: React.FC<MobileAllTickers> = ({
  tickersData,
  selectedTicker,
  onTickerSelect,
  setshowAllTickers,
}) => {
  return (
    <div
      className="flex flex-col h-full bg-gray-900 text-white p-4"
      // className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap gap-4">
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1
          className="text-lg font-semibold"
          onClick={() => console.log(tickersData, selectedTicker)}
        >
          All My Tickers
        </h1>
        {/* <button
          className="text-gray-400 hover:text-white text-lg"
          onClick={() => setshowAllTickers(false)}
        >
          ✖
        </button> */}
      </div>

      {/* Search Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search a symbol (for example: AAPL)"
          className="w-full p-2 bg-gray-800 rounded-md text-white placeholder-gray-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-2">
        {tickersData?.map((item, index) => (
          <div
            key={`${item._id}-${index}`}
            className=" w-32 h-12 bg-gray-800 text-white rounded-md p-1 border-t-2 flex flex-col justify-between"
            style={{
              borderTopColor: item.positionType === "buy" ? "green" : "red",
            }}
            onClick={() => onTickerSelect(item)}
          >
            <div className="flex justify-between items-start w-full text-sm gap-3">
              <span>{item.ticker}</span>
              <span>{item.actualPrice}$</span>
            </div>

            <div className="flex justify-between w-full text-xs">
              <span className="text-green-500">{item.expectedProfit}$</span>
              <span className="text-red-500">{item.expectedLoss}$</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button
          onClick={() => {
            setshowAllTickers(false);
          }}
        >
          Mobile Editor Page
        </Button>
      </div>
    </div>
  );
};

export default MobileAllTickers;
