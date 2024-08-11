import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import dynamic from "next/dynamic"

// import AuthModal from "./auth/auth-modal"

const AuthModal = dynamic(() => import("./auth/auth-modal"))

interface LoginBtnProps {}

const LoginBtn: React.FC<LoginBtnProps> = ({}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="border border-white text-white">
          Log in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <AuthModal />
      </DialogContent>
    </Dialog>
  )
}

export default LoginBtn
