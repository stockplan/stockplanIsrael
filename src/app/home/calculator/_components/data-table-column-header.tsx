import { Column } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import TooltipContainer from "@/components/TooltipContainer"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column?: Column<TData, TValue>
  title: string
  tooltipMsg?: string
}

export function DataTableColumnHeader<TData, TValue>({
  title,
  className,
  tooltipMsg,
}: DataTableColumnHeaderProps<TData, TValue>) {
  return (
    <TooltipContainer msg={tooltipMsg!}>
      <div className={cn(className)}>{title}</div>
    </TooltipContainer>
  )
}
