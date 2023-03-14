import styles from "./ReleaseCard.module.css"
import { useState } from "react"
import AddCodes from "../AddCodes/AddCodes"

export default function ReleaseCard({
  title,
  artist,
  label,
  type,
  artwork_url,
  size,
  release_id,
  user_id,
}) {
  const [showAddCodes, setShowAddCodes] = useState(false)
  return showAddCodes ? (
    <AddCodes
      user_id={user_id}
      release_id={release_id}
      setShowAddCodes={setShowAddCodes}
    />
  ) : (
    <div className="container">
      {artwork_url ? (
        <img
          className={styles.image}
          src={artwork_url}
          alt=""
          height={size}
          width={size}
        />
      ) : (
        <div style={{ height: size, width: size }} />
      )}
      <h3>{title}</h3>
      <h4>{artist}</h4>
      <h5>{label}</h5>
      <h6>{type}</h6>
      <button
        type="button"
        data-variant="primary"
        onClick={() => setShowAddCodes(true)}
      >
        Add Codes
      </button>
    </div>
  )
}
