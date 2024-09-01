import HeaderActions from "./HeaderActions"
import getServerUser from "@/utils/auth-helpers/getServerUser"
import Image from "next/image"
import NavMobile from "./nav-mobile"
import Link from "next/link"

const Header = async () => {
  const {
    data: { user },
  } = await getServerUser()

  return (
    <header className="bg-header shadow-lg max-h-14">
      <div className="block md:hidden">
        <NavMobile user={user} />
      </div>
      <div className="hidden md:flex items-center justify-between h-16 mx-5">
        <Link href="/home" className="flex relative">
          <Image
            src="/img/Logo.png"
            alt="logo"
            width={166}
            height={37}
            className="saturate-200"
          />
        </Link>
        <HeaderActions user={user} />
      </div>
    </header>
  )
}

export default Header
