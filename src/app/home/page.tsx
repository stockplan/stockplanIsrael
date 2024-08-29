import ContentHome from "@/components/home/ContentHome";
import FigureHome from "@/components/home/FigureHome";

const HomePage = async ({}) => {
  return (
    <div className=" flex flex-col-reverse py-5 justify-center items-center w-full lg:flex-row lg:justify-between  lg:px-16 ">
      <ContentHome />
      <FigureHome />
    </div>
  );
};

export default HomePage;
