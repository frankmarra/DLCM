import * as Popover from "@radix-ui/react-popover"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import styles from "./PopoverTip.module.css"

export default function PopoverTip({ message }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={styles.button}>
          <FontAwesomeIcon icon={faCircleQuestion} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className={styles.content} side="right">
          <p className="Text" style={{ marginBottom: 10 }}>
            {message}
          </p>

          <Popover.Arrow className={styles.arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
