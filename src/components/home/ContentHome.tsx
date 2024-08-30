import React from "react"
import { Titillium_Web } from "next/font/google"
import Link from "next/link"

interface ContentHomeProps {}

const titilliumWeb = Titillium_Web({
  weight: "400",
  subsets: ["latin"],
  preload: false,
})

const ContentHome: React.FC<ContentHomeProps> = ({}) => {
  return (
    <div
      className={`${titilliumWeb.className} flex flex-col space-y-4 text-white max-w-lg w-full items-center lg:items-start px-4`}
    >
      <h1 className="text-[#E4EDF2] text-2xl md:text-3xl">Plan Your Trade</h1>
      <h2 className="text-[#EDD9A1] text-2xl md:text-3xl">
        Trade Smart: Predict Profit & Loss.
      </h2>
      <div className="flex flex-col space-y-4 text-md md:text-lg">
        <p className="text-pretty">
          {`Empowering Traders with Precise Profit and Loss Calculations. Navigate
          the stock market with confidence using our easy-to-use tools designed
          to help you make informed trading decisions.`}
        </p>
        <p className="text-pretty">
          {`Whether you're a beginner or an experienced trader, our platform
          provides accurate insights and analytics to optimize your trading
          strategies. Stay ahead in the market with real-time data and
          comprehensive tools at your fingertips.`}
        </p>
      </div>
      <Link
        href="/calculator/lossprofit"
        className="bg-[#3974A9] h-12 md:h-16 px-4 md:px-6 py-2 lg:self-baseline inline-flex items-center justify-center whitespace-nowrap rounded-md text-xl md:text-2xl font-medium"
      >
        Try it for free!
      </Link>
    </div>
  )
}

export default ContentHome
