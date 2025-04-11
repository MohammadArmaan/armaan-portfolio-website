import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    (<input
      type={type}
      data-slot="input"
      className={cn(
        "flex- h-[48px] rounded-md border border-foreground/10 focus:border-primary font-light bg-background text-dark-background dark:text-foreground px-4 py-5 text-base placeholder:text-muted-foreground outline-none",
        className
      )}
      {...props} />)
  );
}

export { Input }
