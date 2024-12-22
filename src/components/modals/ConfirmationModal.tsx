import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import { BsTrashFill } from "react-icons/bs"

interface ConfirmationModalProps {
  handleDeleteAll: () => Promise<void>
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ handleDeleteAll }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="text-white text-sm bg-background-main">
          <BsTrashFill className="mr-2 h-4 w-4" />
          Delete All
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className=" text-black">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => await handleDeleteAll()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmationModal
