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
      className={`${titilliumWeb.className} flex flex-col shrink space-y-6 text-white max-w-xl w-full items-center lg:items-start`}
    >
      <h1 className="text-[#E4EDF2] text-2xl md:text-3xl lg:text-4xl font-semibold text-center lg:text-left">
        Plan Your Trade
      </h1>
      <h2 className="text-[#EDD9A1] text-xl mt-3 md:text-2xl lg:text-3xl text-center lg:text-left">
        {`Trade Smart: Predict Profit & Loss.`}
      </h2>
      <div className="flex flex-col space-y-4 text-sm md:text-base text-center lg:text-left">
        <p className="text-pretty">
          {`Empowering traders with precise profit and loss calculations. Navigate
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
        className="bg-[#3974A9] hover:bg-[#2d5a87] transition-colors duration-200  px-6 md:px-8 py-2 lg:self-start inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg md:text-xl  font-medium"
      >
        Try it for free!
      </Link>
    </div>
  )
}

export default ContentHome
