import * as Popover from "@radix-ui/react-popover"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import styles from "./PopoverTip.module.css"

export default function PopoverTip({ message }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={styles.PopoverButton}>
          <FontAwesomeIcon icon={faCircleQuestion} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className={styles.PopoverContent} side="right">
          <p className="Text" style={{ marginBottom: 10 }}>
            {message}
          </p>

          <Popover.Arrow className="PopoverArrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
