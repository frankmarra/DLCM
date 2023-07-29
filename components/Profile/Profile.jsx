import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"
import SocialSites from "../SocialSites/SocialSites"
import { useState, useEffect, useRef } from "react"
import Head from "next/head"
import Link from "next/link"
import ReleaseSort from "../ReleaseSort/ReleaseSort"
import Pagination from "../Pagination/Pagination"
import ReleaseFilter from "../ReleaseFilter/ReleaseFilter"
import Image from "next/image"

export default function ProfileLayout({
  avatar,
  name,
  location,
  releases,
  profileSlug,
  sites,
  pagePassword,
  isPasswordProtected,
  aboutBlurb,
  isSubscribed,
  isDlcmFriend,
}) {
  const releasesPerPage = 10
  const filtersRef = useRef(null)
  const [artwork, setArtwork] = useState(avatar)
  const [password, setPassword] = useState()
  const [authorized, setAuthorized] = useState(
    isPasswordProtected ? false : true
  )
  const [showError, setShowError] = useState(false)
  const [filteredReleases, setFilteredReleases] = useState(releases)
  const [sortedReleases, setSortedReleases] = useState(filteredReleases)
  const pageCount = Math.ceil(sortedReleases.length / releasesPerPage)
  const [artistList, setArtistList] = useState([])
  const [releasesOffset, setReleasesOffset] = useState(0)
  const endOffset = releasesOffset + releasesPerPage
  const currentReleases = sortedReleases.slice(releasesOffset, endOffset)

  const handlePaginationClick = (e) => {
    const newOffset = (e.selected * releasesPerPage) % releases.length
    setReleasesOffset(newOffset)
    filtersRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (pagePassword == password) {
      setAuthorized(true)
    } else {
      setPassword("")
      setShowError(true)
    }
  }

  useEffect(() => {
    setReleasesOffset(0)
  }, [sortedReleases])

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
    <>
      <Head>
        <title>{`${name}'s public profile`}</title>
        <meta
          property="og:title"
          content={`${name}'s public profile`}
          key="title"
        />
        <meta
          property="og:description"
          content={`See all of ${name}'s available releases`}
          key="description"
        />
      </Head>

      <div className={cn(styles.wrapper, "stack inline-max")}>
        <Image
          className={styles.avatar}
          src={artwork || "/default-image.png"}
          alt={name}
          width={200}
          height={200}
        />
        <div className={cn(styles.info, "stack")}>
          <h1 className={cn(styles.name, "text-3")}>{name}</h1>
          <p className={cn(styles.location, "text-2")}>{location}</p>
          <p className={cn(styles.blurb)}>{aboutBlurb}</p>
          <SocialSites
            sites={sites}
            isSubscribed={isSubscribed}
            isDlcmFriend={isDlcmFriend}
          />
        </div>
      </div>

      {!authorized ? (
        <div className={styles.wrapper}>
          <form
            className="container inline-max stack"
            style={{
              "--max-inline-size": "45ch",
            }}
            onSubmit={handlePasswordSubmit}
          >
            <label htmlFor="password">Enter page password</label>

            <input
              className="input"
              id="password"
              type="password"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="button" data-variant="primary" type="submit">
              Submit
            </button>
            {showError ? (
              <p style={{ color: "red" }}>Incorrect password. Try Again.</p>
            ) : null}
          </form>
        </div>
      ) : (
        <>
          {isSubscribed || isDlcmFriend ? (
            <div ref={filtersRef} className={styles.sort}>
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
            </div>
          ) : null}

          <ul className="grid" role="list">
            {currentReleases.map((release, index) =>
              release.is_active ? (
                <li key={index}>
                  <Link
                    className={styles.release}
                    href={`/${profileSlug}/${release.release_slug}`}
                  >
                    <ReleaseCard
                      key={release.id}
                      release={release}
                      profileSlug={profileSlug}
                    />
                  </Link>
                </li>
              ) : null
            )}
          </ul>
          <div className={styles.pagination}>
            <Pagination
              pageCount={pageCount}
              onPageChange={handlePaginationClick}
            />
          </div>
        </>
      )}
    </>
  )
}
