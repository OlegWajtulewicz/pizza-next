import { cn } from "@/shared/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[3px] bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
