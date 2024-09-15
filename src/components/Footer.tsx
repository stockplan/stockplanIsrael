import Link from "next/link"
import React from "react"

interface FooterProps {}

const Footer = ({}) => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center text-center md:text-left text-xs md:text-sm">
          <div className=" text-gray-400 text-[10px] md:text-sm md:text-white ">
            © {new Date().getFullYear()} StocksPlan.com. All Rights Reserved.
          </div>
          <div className="flex space-x-4 mb-2 md:mb-0">
            <Link href="/privacy">
              <span className="hover:text-gray-400 cursor-pointer">
                Privacy Statement
              </span>
            </Link>
            <Link href="/terms">
              <span className="hover:text-gray-400 cursor-pointer">
                Terms of Service
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
