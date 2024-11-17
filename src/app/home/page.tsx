import ContentHome from "@/components/home/ContentHome"
import Image from "next/image"
import figurePic from "../../../public/images/homeFigure.png"

const HomePage = async ({}) => {
  return (
    <div className="lg:px-12 py-2 bg-background-main">
      <div className="flex flex-col-reverse items-center justify-center lg:flex-row lg:justify-between ">
        <ContentHome />
        <div className="relative w-52 h-48 md:w-80 md:h-80">
          <Image src={figurePic} alt="Home figure" quality={100} fill />
        </div>
      </div>
    </div>
  )
}

export default HomePage
