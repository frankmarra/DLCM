import styles from "./ReleaseCard.module.css"
import { useState, useEffect } from "react"
import AddCodes from "../AddCodes/AddCodes"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function ReleaseCard({
  title,
  artist,
  label,
  type,
  artworkUrl,
  size,
  releaseId,
  userId,
}) {
  const supabase = useSupabaseClient()
  const [showAddCodes, setShowAddCodes] = useState(false)
  const [codeCount, setCodeCount] = useState(0)

  useEffect(() => {
    if (!showAddCodes) {
      getCodeCount()
    }
  }, [showAddCodes])

  async function getCodeCount() {
    try {
      const { count, error } = await supabase
        .from("codes")
        .select("*", { count: "exact", head: true })
        .eq("release_id", releaseId)
        .eq("redeemed", false)
      if (error) throw error
      setCodeCount(count)
    } catch (error) {
      throw error
    }
  }
  return showAddCodes ? (
    <AddCodes
      userId={userId}
      releaseId={releaseId}
      setShowAddCodes={setShowAddCodes}
    />
  ) : (
    <div className="container">
      {artworkUrl ? (
        <img
          className={styles.image}
          src={artworkUrl}
          alt=""
          height={size}
          width={size}
        />
      ) : (
        <div className={styles.image} />
      )}
      <h3>{title}</h3>
      <h4>{artist}</h4>
      <h5>{label}</h5>
      <h6>{type}</h6>
      <p>Codes remaining: {`${codeCount}`}</p>
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
