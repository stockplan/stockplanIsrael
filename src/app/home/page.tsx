import ContentHome from "@/components/home/ContentHome"
import FigureHome from "@/components/home/FigureHome"

const HomePage = async ({}) => {
  return (
    <div className="lg:px-12 py-2 bg-background-main">
      <div className="flex flex-col-reverse items-center justify-center lg:flex-row lg:justify-between ">
        <ContentHome />
        <FigureHome />
      </div>
    </div>
  )
}

export default HomePage
