import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Position } from "@/schemas"

interface Props {
  isOpen: boolean
  onClose: () => void
  positions: Position[] | undefined
}

const UserStocksModal = ({ isOpen, onClose, positions }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] text-gray-700 max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl text-gray-700">
            User stocks
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base mt-2 text-gray-700">
            User stocks description
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          {positions &&
            positions.length > 0 &&
            positions.map((position: Position) => (
              <div
                key={position._id!.toString()}
                className="bg-gray-200 p-2 rounded-lg text-gray-800 w-96"
              >
                <p className="font-medium">Ticker: {position.ticker}</p>
                <p>Actual Price: {position.actualPrice}</p>
                <p>Quantity: {position.quantity}</p>
                <p>Ask Price: {position.askPrice}</p>
                <p>Exit Price: {position.exitPrice}</p>
                <p>Stop Loss: {position.stopLoss}</p>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UserStocksModal
