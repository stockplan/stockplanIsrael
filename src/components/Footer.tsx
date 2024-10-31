import Link from "next/link"
import React from "react"
import { BuildingSVG } from "./BuildingSVG"

const Footer = ({}) => {
  return (
    <section id="footer-main">
      <div className="hidden lg:flex max-w-full ">
        <BuildingSVG className="max-w-full absolute z-0 bottom-0" />
      </div>
      <footer className="bg-gray-900 text-white py-4 z-10 relative">
        <div className="mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center text-center md:text-left text-xs md:text-sm">
            <div className=" text-gray-400 text-[10px] md:text-sm md:text-white ">
              © {new Date().getFullYear()} StocksPlan.com. All Rights Reserved.
            </div>
            <div className="flex space-x-4 mb-2 md:mb-0">
              <Link href="/home/privacy">
                <span className="hover:text-gray-400 cursor-pointer">
                  Privacy Statement
                </span>
              </Link>
              <Link href="/home/terms">
                <span className="hover:text-gray-400 cursor-pointer">
                  Terms of Service
                </span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}

export default Footer
