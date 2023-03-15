import { forwardRef } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import styles from "./Dialog.module.css"

export const DialogContent = forwardRef(({ children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={styles.overlay} />
    <DialogPrimitive.Content className={styles.content} {...props} ref={ref}>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))

DialogContent.displayName = "DialogContent"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
