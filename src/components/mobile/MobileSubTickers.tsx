import React from "react";
import { Position } from "@/types";

interface MobileSubTickersProps {
  tableData: Position[];
  onTickerSelect: (ticker: Position) => void;
}

const MobileSubTickers: React.FC<MobileSubTickersProps> = ({
  tableData,
  onTickerSelect,
}) => {
  const sortedTableData = [...tableData].sort(
    //doesnt work becuse when data is updated on any ticker it updates all tickes and dates as if all where updated.
    (a, b) =>
      new Date(b.entryDate || Date.now()).getTime() -
      new Date(a.entryDate || Date.now()).getTime()
  );

  return (
    <div className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap gap-4">
      {sortedTableData.map((item) => (
        <div
          key={item._id}
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
