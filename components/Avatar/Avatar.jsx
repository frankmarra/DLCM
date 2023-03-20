import styles from "./Avatar.module.css"
import cn from "classnames"

export default function Avatar({ url, size }) {
  return (
    <div className={cn(styles.component, "stack")} style={{ maxWidth: size }}>
      {url ? (
        <img
          className={styles.image}
          src={url}
          alt=""
          height={size}
          width={size}
        />
      ) : (
        <div style={{ height: size, width: size }} />
      )}
    </div>
  )
}
