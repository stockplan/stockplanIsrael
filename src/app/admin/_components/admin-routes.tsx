import { IRoute } from "@/types"
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
} from "react-icons/hi2"

export const routes: IRoute[] = [
  {
    name: "Admin",
    path: "/admin",
    icon: <HiOutlineHome className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />,
    collapse: false,
  },
  {
    name: "Users Overview",
    path: "/admin/users",
    icon: (
      <HiOutlineUsers className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false,
  },
  {
    name: "Tickers Overview",
    path: "/admin/stocks",
    icon: (
      <HiOutlineCurrencyDollar className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false,
  },
  {
    name: "Inquiries",
    path: "/admin/inquiries",
    icon: (
      <HiOutlineCurrencyDollar className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false,
  },
  {
    name: "Landing Page",
    path: "/home",
    icon: (
      <HiOutlineDocumentText className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false,
  },
  {
    name: "Table Page",
    path: "/home/calculator/lossprofit",
    icon: (
      <HiOutlineCurrencyDollar className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false,
  },
]
