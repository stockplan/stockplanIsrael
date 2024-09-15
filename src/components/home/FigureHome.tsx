// "use client"

import Image from "next/image"
import React from "react"

interface FigureHomeProps {}

const FigureHome: React.FC<FigureHomeProps> = ({}) => {
  return (
    <div className="relative w-52 h-48 md:w-80 md:h-80">
      <Image
        src="/images/homeFigure.png"
        fill
        alt="Home figure"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

export default FigureHome
