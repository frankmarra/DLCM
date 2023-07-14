import { useState, useEffect } from "react"
import AddCodes from "../AddCodes/AddCodes"
import cn from "classnames"
import styles from "./ReleaseCard.module.css"
import Link from "next/link"
import IconDownload from "@/icons/download.svg"
import IconRecord from "@/icons/vinyl-record.svg"
import IconMusicNotes from "@/icons/music-notes.svg"
import IconEdit from "@/icons/edit.svg"
import UpdateRelease from "./UpdateRelease"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function ReleaseCard({
  release,
  user,
  getReleases,
  profileData,
  profileSlug,
}) {
  const [onCodeAdded, setOnCodeAdded] = useState(false)
  const [showReleaseUpdateView, setShowReleaseUpdateView] = useState(false)
  const [artwork, setArtwork] = useState(release.artwork_url)

  const supabase = useSupabaseClient()

  useEffect(() => {
    if (onCodeAdded) {
      getReleases()
      setOnCodeAdded(false)
    }
  }, [onCodeAdded])

  return (
    <div className={styles.component}>
      <div className={styles.content}>
        {artwork ? (
          <img
            className={styles.image}
            src={artwork != "     " ? artwork : "/DLCM_Default_Image.png"}
            alt={release.title}
            height={250}
            width={250}
            onError={() => setArtwork("/DLCM_Default_Image.png")}
          />
        ) : (
          <div className={styles.image}>
            <IconMusicNotes aria-hidden="true" />
          </div>
        )}
        <div className={styles.details}>
          <div>
            <h3 className={styles.title}>{release.title}</h3>
            <div className={styles.artist}>{release.artist}</div>
            <div className={styles.label}>{release.label}</div>
            <div className={styles.type}>
              <IconRecord aria-hidden="true" /> {release.type}
            </div>
          </div>
          <div
            className={cn(
              styles.codes,
              release.codes.length <= 0 && styles.empty
            )}
          >
            <IconDownload aria-label="Available download codes" />
            {release.codes.length}{" "}
            <small style={{ fontWeight: "normal" }}>left</small>
          </div>
        </div>
      </div>
      {user ? (
        user.id === release.user_id ? (
          <div className={cn(styles.actions, "inline-wrap")}>
            <UpdateRelease
              setShowReleaseUpdateView={setShowReleaseUpdateView}
              release={release}
              getReleases={getReleases}
              profileData={profileData}
            />
            <AddCodes
              userId={release.user_id}
              releaseId={release.id}
              setOnCodeAdded={setOnCodeAdded}
              profileData={profileData}
            />
          </div>
        ) : null
      ) : null}
    </div>
  )
}
