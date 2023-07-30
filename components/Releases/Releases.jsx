import { useState, useEffect, useRef } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"
import CreateRelease from "./CreateRelease"
import styles from "./Releases.module.css"
import cn from "classnames"
import IconMusicNotesPlus from "@/icons/music-notes-plus.svg"
import Link from "next/link"
import Pagination from "../Pagination/Pagination"
import ReleaseRefinement from "../ReleaseRefinement/ReleaseRefinement"

export default function Releases({ profileData, getProfile }) {
  const releasesPerPage = 9
  const filtersRef = useRef(null)
  const user = useUser()
  const [releases, setReleases] = useState(profileData.releases)
  const [addedNewRelease, setAddedNewRelease] = useState(false)
  const [refinedReleases, setRefinedReleases] = useState(releases)
  const pageCount = Math.ceil(refinedReleases?.length / releasesPerPage)
  const [releasesOffset, setReleasesOffset] = useState(0)
  const endOffset = releasesOffset + releasesPerPage
  const currentReleases = refinedReleases.slice(releasesOffset, endOffset)

  const handlePaginationClick = (e) => {
    const newOffset = (e.selected * releasesPerPage) % releases.length
    setReleasesOffset(newOffset)
    filtersRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (addedNewRelease == true) {
      getProfile()
      setAddedNewRelease(false)
    }
  }, [profileData.id, addedNewRelease])

  return (
    <article className="stack">
      <header className="article-heading cluster">
        <h2 className="visually-hidden">Releases</h2>

        <ReleaseRefinement
          isVisible={profileData.is_subscribed || profileData.dlcm_friend}
          releases={releases}
          onRefinement={setRefinedReleases}
        />
      </header>

      <ul className="grid" role="list">
        <li className={cn(styles.actionCard, "container")} data-variant="empty">
          {profileData.is_subscribed ||
          profileData.dlcm_friend ||
          releases.length <= 1 ? (
            <CreateRelease
              setAddedNewRelease={setAddedNewRelease}
              profileData={profileData}
              trigger={
                <button
                  className={cn(styles.actionCardButton, "button")}
                  data-variant="text"
                >
                  <IconMusicNotesPlus aria-hidden="true" />
                  Create a new release
                </button>
              }
            />
          ) : (
            <Link href="/api/subscribe-to-dlcm">
              Subscribe to add more releases
            </Link>
          )}
        </li>
        {releases.length ? (
          <>
            {currentReleases.map((release, index) => (
              <li key={index}>
                <ReleaseCard
                  key={release.id}
                  release={release}
                  user={user}
                  getProfile={getProfile}
                  profileData={profileData}
                  profileSlug={user.user_metadata.slug}
                />
              </li>
            ))}
          </>
        ) : (
          <div className={cn(styles.empty, "container")} data-variant="empty">
            <p>Your releases list is currently empty.</p>
          </div>
        )}
      </ul>
      <div className={styles.pagination}>
        <Pagination
          pageCount={pageCount}
          onPageChange={handlePaginationClick}
        />
      </div>
    </article>
  )
}
