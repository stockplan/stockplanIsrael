import ContentHome from "@/components/home/ContentHome"
import FigureHome from "@/components/home/FigureHome"

const HomePage = async ({}) => {
  return (
    <div className="flex py-5 items-center justify-between w-full px-16 container ">
      <ContentHome />
      <FigureHome />
    </div>
  )
}

export default HomePage
