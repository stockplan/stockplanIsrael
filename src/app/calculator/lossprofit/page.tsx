import { columns } from "@/components/position/columns";
import { getEmptyRow } from "@/lib/utils";
import { redirect } from "next/navigation";
import getServerUser from "@/utils/auth-helpers/getServerUser";
import { getInitialData } from "@/utils";
import { Suspense } from "react";
import MobileOrDesktopLayout from "@/components/shared/MobileOrDesktopLayout";

const Page = async () => {
  const {
    data: { user },
    error,
  } = await getServerUser();

  if (error && user) return redirect("/home");

  const creator = user?.id || "";

  const serverUserStocks = creator
    ? await getInitialData(creator)
    : [getEmptyRow("")];

  return (
    <MobileOrDesktopLayout
      columns={columns}
      creator={creator}
      serverUserStocks={serverUserStocks}
    />
  );
};

export default Page;
