import LogoutBtn from "./LogoutBtn"
import HeaderActions from "./HeaderActions"
import getServerUser from "@/utils/auth-helpers/getServerUser"
import LoginButton from "./ui/login-button"

const Header = async () => {
  const {
    data: { user },
  } = await getServerUser()

  return (
    <header className="bg-[#2D5686] py-2 px-16 ">
      <div className="flex items-center justify-between">
        <HeaderActions user={user} />
        {user ? <LogoutBtn /> : <LoginButton />}
      </div>
    </header>
  )
}

export default Header
