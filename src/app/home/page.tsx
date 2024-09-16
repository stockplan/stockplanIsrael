import ContentHome from "@/components/home/ContentHome"
import FigureHome from "@/components/home/FigureHome"

const HomePage = async ({}) => {
  return (
    <div className="flex flex-col-reverse py-5 items-center justify-center w-full lg:flex-row lg:justify-between lg:px-12">
      <ContentHome />
      <FigureHome />
    </div>
  )
}

export default HomePage
