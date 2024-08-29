import HeaderActions from "./HeaderActions";
import getServerUser from "@/utils/auth-helpers/getServerUser";

const Header = async () => {
  const {
    data: { user },
  } = await getServerUser();

  return (
    <header className="bg-header py-2 px-1 sm:px-8 ">
      <div className="flex items-center justify-between">
        <HeaderActions user={user} />
      </div>
    </header>
  );
};

export default Header;
