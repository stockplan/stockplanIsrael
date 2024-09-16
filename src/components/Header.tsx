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
    <header className="bg-header shadow-lg py-4">
      <div className="block md:hidden">
        <NavMobile user={user} />
      </div>
      <div className="hidden md:flex items-center justify-between mx-5">
        <Link href="/home" className="flex relative h-auto">
          <Image
            src="/images/Logo.png"
            alt="logo"
            width={160}
            height={30}
            className="saturate-200 w-auto"
          />
        </Link>
        <HeaderActions user={user} />
      </div>
    </header>
  )
}

export default Header
