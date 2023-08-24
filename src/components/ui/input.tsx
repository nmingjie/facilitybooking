import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  frontIcon?: React.ReactNode;
  outSiderClass?: string;
  customInputClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, frontIcon, outSiderClass, customInputClass, ...props },
    ref
  ) => {
    const defaultOutSiderClass = "flex flex-nowrap";
    const conbineOutSiderClass = outSiderClass
      ? `${defaultOutSiderClass} ${outSiderClass}`
      : outSiderClass;

    return (
      <div className={conbineOutSiderClass}>
        {frontIcon}
        <input
          type={type}
          className={
            customInputClass
              ? customInputClass
              : cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  // "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  className
                )
          }
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
