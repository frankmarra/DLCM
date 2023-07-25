import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"
import CreateRelease from "./CreateRelease"
import styles from "./Releases.module.css"
import cn from "classnames"
import IconMusicNotesPlus from "@/icons/music-notes-plus.svg"
import Link from "next/link"
import ReleaseSort from "../ReleaseSort/ReleaseSort"
import ReleaseFilter from "../ReleaseFilter/ReleaseFilter"
import Pagination from "../Pagination/Pagination"

export default function Releases({ profileData, getProfile }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [releases, setReleases] = useState(profileData.releases)
  const [allowNew, setAllowNew] = useState(true)
  const [addedNewRelease, setAddedNewRelease] = useState(false)
  const [filteredReleases, setFilteredReleases] = useState(releases)
  const [sortedReleases, setSortedReleases] = useState(filteredReleases)
  const [artistList, setArtistList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [releasesPerPage, setReleasesPerPage] = useState(10)
  const pages = Math.ceil(releases?.length / releasesPerPage)
  const lastRelease = currentPage * releasesPerPage
  const firstRelease = lastRelease - releasesPerPage
  const currentReleases = sortedReleases.slice(firstRelease, lastRelease)

  useEffect(() => {
    if (addedNewRelease == true) {
      getProfile()
      setAddedNewRelease(false)
    }
  }, [supabase, profileData.id, addedNewRelease])

  useEffect(() => {
    let artists = []
    releases.forEach((release) => {
      if (!artists.some(({ value }) => value === release.artist)) {
        artists.push({ value: release.artist, label: release.artist })
      }
    })

    setArtistList(
      artists.sort((a, b) =>
        a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1
      )
    )
  }, [releases])

  return (
    <article className="stack">
      <header className="article-heading cluster">
        <h2 className="text-2">Releases</h2>

        {profileData.is_subscribed || profileData.dlcm_friend ? (
          <>
            {artistList.length > 1 ? (
              <ReleaseFilter
                releases={releases}
                setFilteredReleases={setFilteredReleases}
                artistList={artistList}
              />
            ) : null}
            <ReleaseSort
              filteredReleases={filteredReleases}
              setSortedReleases={setSortedReleases}
            />
          </>
        ) : null}

        {profileData.is_subscribed || profileData.dlcm_friend ? (
          <CreateRelease
            setAddedNewRelease={setAddedNewRelease}
            profileData={profileData}
            trigger={
              <button className="button" data-variant="primary">
                <IconMusicNotesPlus aria-hidden="true" /> Create new release
              </button>
            }
          />
        ) : releases.length < 2 ? (
          <CreateRelease
            setAddedNewRelease={setAddedNewRelease}
            profileData={profileData}
            trigger={
              <button className="button" data-variant="primary">
                <IconMusicNotesPlus aria-hidden="true" />
                Create new release
              </button>
            }
          />
        ) : null}
      </header>

      <ul className="grid" role="list">
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
          </>
        ) : (
          <div className={cn(styles.empty, "container")} data-variant="empty">
            <p>Your releases list is currently empty.</p>
          </div>
        )}
      </ul>
      <div className={styles.pagination}>
        <Pagination
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </article>
  )
}
