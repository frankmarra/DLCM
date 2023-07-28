import styles from "./Avatar.module.css"
import cn from "classnames"
import { useState, useEffect } from "react"

export default function Avatar({ url, size }) {
  const [artwork, setArtwork] = useState(url)

  useEffect(() => {
    setArtwork(url)
  }, [url])
  return (
    <div className={cn(styles.component, "stack")} style={{ maxWidth: size }}>
      {artwork ? (
        <img
          className={styles.image}
          src={artwork}
          alt=""
          height={size}
          width={size}
          onError={() => setArtwork("/default-image.png")}
        />
      ) : (
        <img
          className={styles.image}
          src="/default-image.png"
          alt=""
          height={size}
          width={size}
        />
      )}
    </div>
  )
}
