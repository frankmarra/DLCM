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
import InputPagePassword from "../InputPagePassword/InputPagePassword"
import SEO from "../SEO/SEO"
import { sanitize } from "isomorphic-dompurify"
import AudioPlayerEmbed from "../AudioPlayerEmbed/AudioPlayerEmbed"

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
  embed,
}) {
  // State
  const releasesPerPage = 10
  const filtersRef = useRef(null)
  const [pageChange, setPageChange] = useState(0)
  const [authorized, setAuthorized] = useState(!isPasswordProtected)
  const [refinedReleases, setRefinedReleases] = useState(releases)
  const pageCount = Math.ceil(refinedReleases.length / releasesPerPage)
  const [releasesOffset, setReleasesOffset] = useState(0)
  const endOffset = releasesOffset + releasesPerPage
  const currentReleases = refinedReleases.slice(releasesOffset, endOffset)

  const sanitizedAbout = sanitize(aboutBlurb)

  const profilePic = (
    <Image
      className={styles.avatar}
      src={avatar || "/default-image.png"}
      alt={name}
      width={200}
      height={200}
      quality={100}
      priority={true}
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
      <SEO
        title={name}
        description={`Discover download codes for music releases by ${name}`}
      ></SEO>
      <div className={cn(styles.wrapper, "stack inline-max")}>
        {sites.personal ? (
          <Link href={sites.personal}>{profilePic}</Link>
        ) : (
          profilePic
        )}

        {
          // authorized &&
          // embeds?.length > 0 &&
          // embeds[0] !== "Not a valid embed" &&
          // embeds[0] !== "" &&
          // embed !== null && (
          //   <section>
          //     <iframe
          //       style={{ border: 0, width: "100%", height: "120px" }}
          //       src={`https://bandcamp.com/EmbeddedPlayer/${
          //         embeds[0]
          //       }/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small${
          //         embeds.length > 1 ? `/${embeds[1].trim()}` : "/"
          //       }/transparent=true/`}
          //       seamless
          //     ></iframe>
          //     <a href=""></a>
          //   </section>
          // )
        }

        <div className={cn(styles.info, "stack")}>
          <h1 className={cn(styles.name, "text-3")}>{name}</h1>
          <p className={cn(styles.location, "text-2")}>{location}</p>

          {sanitizedAbout && authorized ? (
            <section
              className={styles.about}
              dangerouslySetInnerHTML={{ __html: sanitizedAbout }}
            />
          ) : null}
          <SocialSites
            sites={sites}
            isSubscribed={isSubscribed}
            isDlcmFriend={isDlcmFriend}
          />
          <AudioPlayerEmbed playerEmbed={embed} size={"large"} />
        </div>
      </div>

      {!authorized ? (
        <InputPagePassword
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

          <ul className={cn(styles.cards, "grid")} role="list">
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
