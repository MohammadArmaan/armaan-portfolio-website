import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    (<textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full bg-background px-4 py-5 rounded-md border border-foreground/10 focus:border-primary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} />)
  );
}

export { Textarea }
