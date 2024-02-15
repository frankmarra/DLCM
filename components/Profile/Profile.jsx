import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"
import SocialSites from "../SocialSites/SocialSites"
import { useState, useRef, useCallback, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import Pagination from "../Pagination/Pagination"
import Image from "next/image"
import ReleaseRefinement from "../ReleaseRefinement/ReleaseRefinement"
import InputPagePassword from "../InputPagePassword/InputPagePassword"
import SEO from "../SEO/SEO"
import { sanitize } from "isomorphic-dompurify"
import Loader from "@/components/Loader/Loader"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ProfileLayout({
  userId,
  avatar,
  name,
  location,
  releases,
  artists,
  profileSlug,
  sites,
  pagePassword,
  isPasswordProtected,
  aboutBlurb,
  isSubscribed,
  isDlcmFriend,
}) {
  const supabase = createClientComponentClient()
  const releasesPerPage = 10
  const filtersRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [pageChange, setPageChange] = useState(0)
  const [authorized, setAuthorized] = useState(!isPasswordProtected)
  // const [refinedReleases, setRefinedReleases] = useState(releases)
  // const pageCount = Math.ceil(refinedReleases.length / releasesPerPage)

  const [releasesOffset, setReleasesOffset] = useState(0)
  // const endOffset = releasesOffset + releasesPerPage
  // const currentReleases = refinedReleases.slice(releasesOffset, endOffset)
  const [currentReleases, setCurrentReleases] = useState([])
  const [currentSort, setCurrentSort] = useState({
    sortBy: "created_at",
    ascending: true,
  })
  const [currentFilter, setCurrentFilter] = useState("all")
  let pageCount = Math.ceil(releases / releasesPerPage)
  const sanitizedAbout = sanitize(aboutBlurb)

  const profilePic = (
    <Image
      className={styles.avatar}
      src={avatar || "/default-image.png"}
      alt={name}
      width={200}
      height={200}
    />
  )
  console.log(artists)
  useEffect(() => {
    getReleases()
  }, [releasesOffset, currentSort, currentFilter])

  const getReleases = async () => {
    try {
      setLoading(true)
      const endOffset = releasesOffset + releasesPerPage

      let filteredReleases = supabase
        .from("releases")
        .select("*, codes(count)", { count: "exact" })
        .eq("user_id", userId)
        .eq("is_active", true)
        .eq("codes.redeemed", false)
        .order(currentSort ? currentSort.sortBy : "created_at", {
          ascending: currentSort ? currentSort.ascending : false,
        })
        .range(releasesOffset, endOffset - 1)

      if (currentFilter != "all") {
        filteredReleases = filteredReleases.eq("artist", currentFilter)
      }

      let { data, error, status } = await filteredReleases

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setCurrentReleases(data)
      }
    } catch (error) {
      alert("Error loading user data!")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageClick = () => {
    filtersRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handlePageChange = useCallback(
    (e) => {
      const newOffset = (e.selected * releasesPerPage) % releases
      setReleasesOffset(newOffset)
      setPageChange(e.selected)
    },
    [releases]
  )

  const handleFilterRefinement = useCallback(
    (sort, filter) => {
      // console.log(releases[0].title)
      setCurrentSort(sort)
      setCurrentFilter(filter)
      handlePageChange({ selected: 0 })
    },
    [handlePageChange]
  )

  // if (loading) {
  //   return <Loader style={{ margin: "auto" }} />
  // }

  return (
    currentReleases && (
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
          <div className={cn(styles.info, "stack")}>
            <h1 className={cn(styles.name, "text-3")}>{name}</h1>
            <p className={cn(styles.location, "text-2")}>{location}</p>
            {
              // <p className={cn(styles.blurb)}>{aboutBlurb}</p>
            }
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
              releases={currentReleases}
              isVisible={isSubscribed || isDlcmFriend}
              artists={artists}
              onRefinement={handleFilterRefinement}
            />
            {loading ? (
              <Loader style={{ margin: "auto" }} />
            ) : (
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
            )}
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
  )
}
