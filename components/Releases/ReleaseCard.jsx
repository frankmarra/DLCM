import { useState, useEffect } from "react"
import AddCodes from "../AddCodes/AddCodes"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import cn from "classnames"
import styles from "./ReleaseCard.module.css"
import Link from "next/link"

export default function ReleaseCard({
  title,
  artist,
  label,
  type,
  artworkUrl,
  size,
  releaseId,
  userId,
  slug,
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
  console.log({ slug })
  return (
    <li className={cn(styles.component, "container")}>
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
      <div class={styles.content}>
        <h2 class={styles.title}>
          <Link href={`/releases/${slug}`}>{title}</Link>
        </h2>
        <p class={styles.artist}>{artist}</p>
        <p>{label}</p>
        <p>{type}</p>
        <p>Codes remaining: {codeCount}</p>
        {userId ? (
          <AddCodes
            userId={userId}
            releaseId={releaseId}
            setOnCodeAdded={setOnCodeAdded}
          />
        ) : null}
      </div>
    </li>
  )
}
