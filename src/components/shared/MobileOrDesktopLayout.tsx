"use client";
import useIsMobile from "@/hooks/useIsMobile";
import MobileLayout from "@/components/mobile/MobileLayout";
import TableLossProfitWrapper from "@/app/calculator/_components/table-wrapper";
import { Position } from "@/schemas";
import { ColumnDef } from "@tanstack/react-table";

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
    <MobileLayout
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
