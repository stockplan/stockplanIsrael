import HeaderActions from "./HeaderActions"
import getServerUser from "@/utils/auth-helpers/getServerUser"

const Header = async () => {
  const {
    data: { user },
  } = await getServerUser()

  return (
    <header className="bg-header py-2 px-3 sm:px-8 flex justify-between items-center">
      <HeaderActions user={user} />
    </header>
  )
}

export default Header
