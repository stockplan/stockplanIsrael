"use client"

import { User } from "@supabase/supabase-js"
import { UserContext, UserDetailsContext } from "@/contexts/layout"
import Sidebar from "./sidebar"
import Navbar from "./navbar"
import { usePathname } from "next/navigation"
import AdminFooter from "./admin-footer"
import { routes } from "./admin-routes"
import { getActiveRoute } from "@/utils/navigation-helpers"

interface Props {
  children: React.ReactNode
  user: User | null | undefined
  userDetails: User | null | undefined | any
}

export default function AdminPanelLayout(props: Props) {
  const pathname = usePathname()

  return (
    <UserContext.Provider value={props.user}>
      <UserDetailsContext.Provider value={props.userDetails}>
        <div className="flex h-full w-full bg-white">
          <Sidebar routes={routes} />
          <div className="h-full w-full bg-white dark:bg-zinc-950">
            <main
              className={`mx-2.5 flex-none transition-all dark:bg-zinc-950 md:pr-2 xl:ml-[328px]`}
            >
              <div className="mx-auto min-h-screen p-2 !pt-[90px] md:p-2 md:!pt-[118px]">
                {props.children}
              </div>

              <Navbar brandText={getActiveRoute(routes, pathname)} />

              <div className="p-3">
                <AdminFooter />
              </div>
            </main>
          </div>
        </div>
      </UserDetailsContext.Provider>
    </UserContext.Provider>
  )
}
