// "use client"

import Image from "next/image"
import React from "react"

interface FigureHomeProps {}

const FigureHome: React.FC<FigureHomeProps> = ({}) => {
  return (
    <div className="w-[340px] h-80 relative">
      <Image
        src="/img/homeFigure.png"
        fill
        alt="Home figure"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

export default FigureHome
