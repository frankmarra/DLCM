import { useState, useEffect } from "react"
import AddCodes from "../AddCodes/AddCodes"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import cn from "classnames"
import styles from "./ReleaseCard.module.css"
import IconDownload from "@/icons/download.svg"
import IconRecord from "@/icons/vinyl-record.svg"
import IconMusicNotes from "@/icons/music-notes.svg"
import IconEdit from "@/icons/edit.svg"

export default function ReleaseCard({
  title,
  artist,
  label,
  type,
  artworkUrl,
  size,
  releaseId,
  userId,
  releaseCodes,
}) {
  const supabase = useSupabaseClient()
  const [codeCount, setCodeCount] = useState(0)
  const [onCodeAdded, setOnCodeAdded] = useState(true)

  useEffect(() => {
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
    if (onCodeAdded) {
      getCodeCount()
      setOnCodeAdded(false)
    }
  }, [setCodeCount, supabase, releaseId, onCodeAdded])

  return (
    <li className={styles.component}>
      <div className={styles.content}>
        {artworkUrl ? (
          <img
            className={styles.image}
            src={artworkUrl}
            alt=""
            height={size}
            width={size}
          />
        ) : (
          <div className={styles.image}>
            <IconMusicNotes aria-hidden="true" />
          </div>
        )}
        <div className={styles.details}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.artist}>{artist}</div>
          <div className={styles.label}>{label}</div>
          <div className={styles.type}>
            <IconRecord aria-hidden="true" /> {type}
          </div>
          <div className={cn(styles.codes, codeCount <= 0 && styles.empty)}>
            <IconDownload aria-label="Available download codes" />
            {codeCount}
          </div>
        </div>
      </div>
      <div className={cn(styles.actions, "inline-wrap")}>
        <button className="button" data-variant="primary" data-size="small">
          <IconEdit aria-hidden="true" /> Edit
        </button>
        <AddCodes
          userId={userId}
          releaseId={releaseId}
          setOnCodeAdded={setOnCodeAdded}
        />
      </div>
    </li>
  )
}
