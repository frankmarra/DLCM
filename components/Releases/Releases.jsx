import { useState, useEffect, useRef, useCallback } from "react"
import { useUser } from "@supabase/auth-helpers-react"
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
  const [addedNewRelease, setAddedNewRelease] = useState(false)
  const [releases, setReleases] = useState(profileData.releases)
  const [refinedReleases, setRefinedReleases] = useState(profileData.releases)
  const [pageChange, setPageChange] = useState(0)
  const pageCount = Math.ceil(releases?.length / releasesPerPage)
  const [releasesOffset, setReleasesOffset] = useState(0)
  const endOffset = releasesOffset + releasesPerPage
  const currentReleases = refinedReleases.slice(releasesOffset, endOffset)

  const handlePageClick = () => {
    filtersRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handlePageChange = useCallback(
    (e) => {
      const newOffset = (e.selected * releasesPerPage) % releases.length
      setReleasesOffset(newOffset)
      setPageChange(e.selected)
    },
    [releases.length]
  )

  const handleFilterRefinement = useCallback(
    (releases) => {
      setRefinedReleases(releases)
      handlePageChange({ selected: 0 })
    },
    [handlePageChange]
  )

  useEffect(() => {
    if (addedNewRelease == true) {
      getProfile()
      setAddedNewRelease(false)
    }
  }, [profileData.id, addedNewRelease, getProfile])

  return (
    refinedReleases && (
      <article className="stack">
        <header className="article-heading cluster">
          <h2 className="visually-hidden">Releases</h2>

          <ReleaseRefinement
            isVisible={profileData.is_subscribed || profileData.dlcm_friend}
            releases={releases}
            onRefinement={handleFilterRefinement}
            ref={filtersRef}
            isDashboard={true}
          />
        </header>

        <ul className="grid" role="list">
          <li
            className={cn(styles.actionCard, "container")}
            data-variant="empty"
          >
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
            forcePage={pageChange}
            onClick={handlePageClick}
            onPageChange={handlePageChange}
            pageCount={pageCount}
          />
        </div>
      </article>
    )
  )
}
