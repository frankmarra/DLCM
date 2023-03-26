import { forwardRef } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import cn from "classnames"
import styles from "./Dialog.module.css"

export const DialogContent = forwardRef(({ children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={styles.overlay} />
    <DialogPrimitive.Content
      className={cn(styles.content, "inline-max")}
      {...props}
      ref={ref}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))

DialogContent.displayName = "DialogContent"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
