import React from "react";
import { Position } from "@/types";

interface MobileSubTickersProps {
  tickersData: Position[];
  onTickerSelect: (ticker: Position) => void;
}

const MobileSubTickers: React.FC<MobileSubTickersProps> = ({
  tickersData,
  onTickerSelect,
}) => {
  // Sort the tickersData array by updatedAt in descending order. (all dates are the same so it deosnt work)
  const sortedTickers = [...tickersData].sort(
    (a, b) =>
      new Date(b.updatedAt ?? 0).getTime() -
      new Date(a.updatedAt ?? 0).getTime()
  );

  return (
    <div className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap gap-4">
      {sortedTickers?.map((item, index) => (
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
  );
};

export default MobileSubTickers;
