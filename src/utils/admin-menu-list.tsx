import { ViewGridIcon } from "@radix-ui/react-icons"

import { RiSettingsFill, RiUserFill } from "react-icons/ri"

type Submenu = {
  href: string
  label: string
  active: boolean
}

type Menu = {
  href: string
  label: string
  active: boolean
  icon: any
  submenus: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/admin/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: RiUserFill,
          submenus: [],
        },
        {
          href: "/admin/stocks",
          label: "Stocks",
          active: pathname.includes("/stocks"),
          icon: RiSettingsFill,
          submenus: [],
        },
      ],
    },
  ]
}
