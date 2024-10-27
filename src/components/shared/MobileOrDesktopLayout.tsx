"use client";
import useIsMobile from "@/hooks/useIsMobile";
import MobileLossprofitLayout from "@/components/mobile/MobileLossprofitLayout";
// import TableLossProfitWrapper from "@/app/calculator/_components/table-wrapper";
// import { Position } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { Position } from "@/types";
import TableLossProfitWrapper from "@/app/home/calculator/_components/table-wrapper";

interface MobileOrDesktopLayoutProps {
  columns: ColumnDef<Position>[];
  creator: string;
  serverUserStocks: Position[];
}

const MobileOrDesktopLayout: React.FC<MobileOrDesktopLayoutProps> = ({
  columns,
  creator,
  serverUserStocks,
}) => {
  const isMobile = useIsMobile(); // Use the hook inside this client-side component

  return isMobile ? (
    <MobileLossprofitLayout
      columns={columns}
      creator={creator}
      serverUserStocks={serverUserStocks}
    />
  ) : (
    <TableLossProfitWrapper
      columns={columns}
      creator={creator}
      serverUserStocks={serverUserStocks}
    />
  );
};

export default MobileOrDesktopLayout;
