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

export default function ReleaseCard({ release, user, getReleases }) {
  const [onCodeAdded, setOnCodeAdded] = useState(true)
  const [showReleaseUpdateView, setShowReleaseUpdateView] = useState(false)

  return (
    <li className={styles.component}>
      <div className={styles.content}>
        {release.artwork_url ? (
          <img
            className={styles.image}
            src={release.artwork_url}
            alt=""
            height={250}
            width={250}
          />
        ) : (
          <div className={styles.image}>
            <IconMusicNotes aria-hidden="true" />
          </div>
        )}
        <div className={styles.details}>
          <div>
            <h3 className={styles.title}>
              <Link href={`/releases/${release.release_slug}`}>
                {release.title}
              </Link>
            </h3>
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
            />
            <AddCodes
              userId={release.user_id}
              releaseId={release.release_id}
              setOnCodeAdded={setOnCodeAdded}
            />
          </div>
        ) : null
      ) : null}
    </li>
  )
}
