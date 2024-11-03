import { Position } from "@/types";
import React from "react";

interface MobileAllTickers {
  tableData: Position[];
}

const MobileAllTickers: React.FC<MobileAllTickers> = ({ tableData }) => {
  return <div>MobileAllTickers PAGE</div>;
};

export default MobileAllTickers;
