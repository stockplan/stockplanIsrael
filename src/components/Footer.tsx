import Link from "next/link"
import React from "react"

interface FooterProps {}

const Footer = ({}) => {
  return (
    <footer className="bg-gray-800 text-white h-11 z-20 fixed bottom-0 w-full px-16">
      <div className=" h-11 px-1  flex flex-col md:flex-row justify-between items-center  w-full">
        <p className="text-center md:text-left mb-2 md:mb-0">
          {`© ${new Date().getFullYear()} StocksPlan.com, All Rights Reserved.`}
        </p>
        <div className="flex space-x-4">
          <Link href="/privacy" className="hover:text-gray-400">
            Privacy Statement
          </Link>
          <span className="hidden md:inline">|</span>
          <Link href="/terms" className="hover:text-gray-400 z-auto">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
