import Link from "next/link";
import React from "react";

interface FooterProps {}

const Footer = ({}) => {
  return (
    <footer className="bg-gray-800 text-white h-11 z-20 fixed bottom-0 w-full px-2">
      <div className=" h-11 px-1  flex  flex-row justify-between items-center w-full text-xs md:text-sm lg:text-base">
        <p className="text-left mb-0 inline ">
          {`© ${new Date().getFullYear()} StocksPlan.com, All Rights Reserved.`}
        </p>
        <div className="flex  sm:px-1 sm:right-1 ">
          <Link href="/privacy" className="hover:text-gray-400 block w-auto ">
            Privacy Statement
          </Link>
          <span className="px-2">|</span>
          <Link
            href="/terms"
            className="hover:text-gray-400 z-auto block w-auto"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
