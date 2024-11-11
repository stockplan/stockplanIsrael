import { signout } from "@/actions/logout"
import { Button } from "../ui/button"

interface LogoutBtnProps {}

const LogoutBtn: React.FC<LogoutBtnProps> = ({}) => {
  return (
    <form action={signout}>
      <Button variant="ghost" className="border border-white text-white">
        Log out
      </Button>
    </form>
  )
}

export default LogoutBtn
