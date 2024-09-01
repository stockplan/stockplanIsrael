import Link from "next/link"
import React from "react"

interface FooterProps {}

const Footer = ({}) => {
  return (
    <footer className="bg-gray-800 text-white h-auto z-20 fixed bottom-0 w-full px-4 py-2">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full text-center text-xs md:text-sm lg:text-base">
        <p className="mb-2 sm:mb-0">
          {`© ${new Date().getFullYear()} StocksPlan.com, All Rights Reserved.`}
        </p>
        <div className="flex space-x-4">
          <Link href="/privacy" className="hover:text-gray-400">
            Privacy Statement
          </Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-gray-400">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
