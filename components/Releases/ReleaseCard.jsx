import { useState, useEffect } from "react"
import AddCodes from "../AddCodes/AddCodes"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import cn from "classnames"
import styles from "./ReleaseCard.module.css"

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
  // const [onCodeAdded, setOnCodeAdded] = useState(true)
  // const [availableCodes, setAvailableCodes] = useState()

  // useEffect(() => {
  //   async function getCodeCount() {
  //     try {
  //       const { count, error } = await supabase
  //         .from("codes")
  //         .select("*", { count: "exact", head: true })
  //         .eq("release_id", releaseId)
  //         .eq("redeemed", false)
  //       if (error) throw error
  //       setCodeCount(count)
  //     } catch (error) {
  //       throw error
  //     }
  //   }
  //   if (onCodeAdded) {
  //     getCodeCount()
  //     setOnCodeAdded(false)
  //   }
  // }, [setCodeCount, supabase, releaseId, onCodeAdded])

  // const newCodes = supabase
  //   .channel("new-codes-added")
  //   .on(
  //     "postgres_changes",
  //     {
  //       event: "INSERT",
  //       schema: "public",
  //       table: "codes",
  //     },
  //     (payload) => {
  //       console.log("payload: ", payload)
  //       console.log("releseId: ", releaseId)
  //       if (payload.new.release_id === releaseId) {
  //         let count = codeCount
  //         setCodeCount(count + 1)
  //       }
  //     }
  //   )
  //   .on(
  //     "postgres_changes",
  //     {
  //       event: "UPDATE",
  //       schema: "public",
  //       table: "codes",
  //     },
  //     (payload) => {
  //       if (
  //         payload.new.release_id === releaseId &&
  //         payload.new.redeemed === true
  //       ) {
  //         setCodeCount(codeCount - 1)
  //       }
  //     }
  //   )
  // .subscribe()
  useEffect(() => {
    let availableCodes = []
    if (releaseCodes) {
      releaseCodes.forEach((code) => {
        if (code.redeemed === false) {
          availableCodes.push(code)
        }
      })
    }

    if (availableCodes.length > 0) {
      setCodeCount(availableCodes.length)
    }
  }, [])
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

      <div>
        <h3>{title}</h3>
        <h4>{artist}</h4>
        <h5>{label}</h5>
        <h6>{type}</h6>
        <p>Codes remaining: {codeCount}</p>
        <AddCodes userId={userId} releaseId={releaseId} />
      </div>
    </li>
  )
}
