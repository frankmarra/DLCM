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
  getProfile,
  profileData,
  profileSlug,
}) {
  const [onCodeAdded, setOnCodeAdded] = useState(false)
  const [showReleaseUpdateView, setShowReleaseUpdateView] = useState(false)
  const [artwork, setArtwork] = useState(release.artwork_url)

  const supabase = useSupabaseClient()

  useEffect(() => {
    if (onCodeAdded) {
      getProfile()
      setOnCodeAdded(false)
    }
  }, [onCodeAdded])

  return (
    <div className={styles.component}>
      <div className={styles.content}>
        {artwork ? (
          <img
            className={styles.image}
            src={artwork != "     " ? artwork : "/default-image.png"}
            alt={release.title}
            height={250}
            width={250}
            onError={() => setArtwork("/default-image.png")}
          />
        ) : (
          <div className={styles.image}>
            <IconMusicNotes aria-hidden="true" />
          </div>
        )}
        <div className={styles.details}>
          <div>
            <h3 className={cn(styles.title, "text-2")}>
              {profileData ? (
                <Link
                  className="link"
                  href={`/${profileData.slug}/${release.release_slug}`}
                >
                  {release.title}
                </Link>
              ) : (
                release.title
              )}
            </h3>
            <div className={styles.artist}>{release.artist}</div>
            <div className={styles.label}>{release.label}</div>
            {release.type ? (
              <div className={styles.type}>
                <IconRecord aria-hidden="true" /> {release.type}
              </div>
            ) : null}
          </div>
          <div
            className={cn(
              styles.codes,
              release.codes[0].count <= 0 && styles.empty
            )}
          >
            <IconDownload aria-label="Available download codes" />
            {release.codes[0].count}{" "}
            <small style={{ fontWeight: "normal" }}>left</small>
          </div>
        </div>
      </div>
      {user ? (
        user.id === release.user_id ? (
          <div className={cn(styles.actions, "cluster")}>
            <UpdateRelease
              setShowReleaseUpdateView={setShowReleaseUpdateView}
              release={release}
              getProfile={getProfile}
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
