"use client"

import { Card } from "@/components/ui/card"
import React, { PropsWithChildren, useContext } from "react"
import { HiX } from "react-icons/hi"
import { IRoute } from "@/types"
import Links from "./links"
import { Button } from "@/components/ui/button"
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { UserContext, UserDetailsContext } from "@/contexts/layout"
import Image from "next/image"
import logoSm from "../../../../public/logo192.png"
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle"

export interface SidebarProps extends PropsWithChildren {
  routes: IRoute[]
  [x: string]: any
}

const supabase = createClient()

function Sidebar(props: SidebarProps) {
  const { routes } = props

  const { isOpen } = useSidebarToggle()

  const router = useRouter()

  const user = useContext(UserContext)
  const userDetails = useContext(UserDetailsContext)

  const handleSignOut = async (e: any) => {
    e.preventDefault()
    supabase.auth.signOut()
    router.push("/home")
  }

  return (
    <div
      className={`lg:!z-99 fixed !z-[99] min-h-full w-[300px] transition-all md:!z-[99] xl:!z-0 xl:block ${
        isOpen ? "" : "-translate-x-[120%] xl:translate-x-[unset]"
      }`}
    >
      <Card
        className={`m-3 ml-3 h-[96.5vh] w-full overflow-hidden !rounded-lg border-zinc-200 pe-4 dark:border-zinc-800 sm:my-4 sm:mr-4 md:m-5 md:mr-[-50px]`}
      >
        <div className="flex relative h-full flex-col justify-between">
          <div>
            <div className={`mt-8 flex items-center justify-center`}>
              <div className="me-2 flex h-[40px] w-[40px] items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <Image
                  src={logoSm}
                  alt="logo"
                  className="h-[40px] w-[40px] p-1"
                  priority
                />
              </div>
              <h5 className="me-2 text-2xl font-bold leading-5 text-zinc-950 dark:text-white">
                Stocksplan.com
              </h5>
            </div>
            <div className="mb-8 mt-8 h-px bg-zinc-200 dark:bg-white/10" />
            <ul>
              <Links routes={routes} />
            </ul>
          </div>
          <div className="mb-9 mt-7">
            <div className="mt-5 flex w-full items-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <a href="#">
                <Avatar className="min-h-10 min-w-10">
                  <AvatarImage src={user?.user_metadata.avatar_url} />
                  <AvatarFallback className="font-bold dark:text-zinc-950"></AvatarFallback>
                </Avatar>
              </a>
              <a href="#">
                <p className="ml-2 mr-3 flex items-center text-sm font-semibold leading-none text-zinc-950 dark:text-white">
                  {userDetails?.full_name ||
                    user?.user_metadata?.full_name ||
                    "User"}
                </p>
              </a>
              <Button
                onClick={(e) => handleSignOut(e)}
                variant="outline"
                className="ml-auto flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full p-0 text-center text-sm font-medium hover:dark:text-white"
                type="submit"
              >
                <HiOutlineArrowRightOnRectangle
                  className="h-4 w-4 stroke-2 text-zinc-950 dark:text-white"
                  width="16px"
                  height="16px"
                  color="inherit"
                />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Sidebar
