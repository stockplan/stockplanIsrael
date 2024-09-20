import getServerUser from "@/utils/auth-helpers/getServerUser"
import HeaderClient from "./header-client"

const Header = async () => {
  const {
    data: { user },
  } = await getServerUser()

  return <HeaderClient user={user} />
}

export default Header
