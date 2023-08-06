import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"
import SocialSites from "../SocialSites/SocialSites"
import { useState, useRef, useCallback } from "react"
import Head from "next/head"
import Link from "next/link"
import Pagination from "../Pagination/Pagination"
import Image from "next/image"
import ReleaseRefinement from "../ReleaseRefinement/ReleaseRefinement"
import HandlePagePassword from "../HandlePagePassword/HandlePagePassword"

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
  const [pageChange, setPageChange] = useState(0)
  const [authorized, setAuthorized] = useState(!isPasswordProtected)
  const [refinedReleases, setRefinedReleases] = useState(releases)
  const pageCount = Math.ceil(refinedReleases.length / releasesPerPage)
  const [releasesOffset, setReleasesOffset] = useState(0)
  const endOffset = releasesOffset + releasesPerPage
  const currentReleases = refinedReleases.slice(releasesOffset, endOffset)

  const profilePic = (
    <Image
      className={styles.avatar}
      src={avatar || "/default-image.png"}
      alt={name}
      width={200}
      height={200}
    />
  )

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
      // console.log(releases[0].title)
      setRefinedReleases(releases)
      handlePageChange({ selected: 0 })
    },
    [handlePageChange]
  )

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
        {sites.personal ? (
          <Link href={sites.personal}>{profilePic}</Link>
        ) : (
          profilePic
        )}
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
        <HandlePagePassword
          setAuthorized={setAuthorized}
          pagePassword={pagePassword}
        />
      ) : (
        <>
          <ReleaseRefinement
            ref={filtersRef}
            releases={releases}
            isVisible={isSubscribed || isDlcmFriend}
            onRefinement={handleFilterRefinement}
          />

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
          <Pagination
            className={styles.pagination}
            forcePage={pageChange}
            onClick={handlePageClick}
            onPageChange={handlePageChange}
            pageCount={pageCount}
          />
        </>
      )}
    </>
  )
}
