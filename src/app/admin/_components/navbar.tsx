"use client"

import HeaderLinks from "./NavbarLinksAdmin"
import NavLink from "./navlink"

export default function AdminNavbar(props: {
  brandText: string
  [x: string]: any
}) {
  const { brandText } = props

  return (
    <nav
      className={`fixed right-3 top-3 z-[0] flex w-[calc(100vw_-_6%)] flex-row items-center justify-between rounded-lg bg-white/30 py-2 backdrop-blur-xl transition-all md:right-[30px] md:top-4 md:w-[calc(100vw_-_8%)] md:p-2 lg:w-[calc(100vw_-_6%)] xl:top-[20px] xl:w-[calc(100vw_-_365px)] 2xl:w-[calc(100vw_-_380px)]`}
    >
      <div className="ml-[6px]">
        <div className="h-6 md:mb-2 md:w-[224px] md:pt-1">
          <a
            className="hidden text-xs font-normal text-zinc-950 hover:underline"
            href="/admin"
          >
            Admin
            <span className="mx-1 text-xs text-zinc-950 hover:text-zinc-950">
              {" "}
              /{" "}
            </span>
          </a>
          <NavLink
            className="text-xs font-normal capitalize text-zinc-950 hover:underline"
            href="#"
          >
            {brandText}
          </NavLink>
        </div>
        <p className="text-md shrink capitalize text-zinc-950">
          <NavLink
            href="#"
            className="font-bold capitalize hover:text-zinc-950"
          >
            {brandText}
          </NavLink>
        </p>
      </div>
      <div className="w-[154px] min-w-max md:ml-auto md:w-[unset]">
        <div></div>
        <HeaderLinks />
      </div>
    </nav>
  )
}
