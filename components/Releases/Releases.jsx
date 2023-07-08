import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"
import CreateRelease from "./CreateRelease"
import styles from "./Releases.module.css"
import cn from "classnames"
import IconMusicNotesPlus from "@/icons/music-notes-plus.svg"
import Link from "next/link"

const sortByCreatedAt = (a, b) => (a.created_at > b.created_at ? 1 : -1)
const sortByTitle = (a, b) => (a.title > b.title ? 1 : -1)

const filterOptions = [
  {
    label: "Oldest First",
    value: "oldest",
    method: sortByCreatedAt,
    direction: "asc",
  },
  {
    label: "Newest First",
    value: "newest",
    method: sortByCreatedAt,
    direction: "desc",
  },
  { label: "A to Z", value: "a-z", method: sortByTitle, direction: "asc" },
  { label: "Z to A", value: "z-a", method: sortByTitle, direction: "desc" },
]

export default function Releases({ profileData }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [releases, setReleases] = useState([])
  const [allowNew, setAllowNew] = useState(true)
  const [addedNewRelease, setAddedNewRelease] = useState(false)

  useEffect(() => {
    getReleases()
    setAddedNewRelease(false)
  }, [supabase, profileData.id, addedNewRelease])

  const handleSort = (value) => {
    const selected = filterOptions.find((option) => option.value === value)
    let sortedItems

    sortedItems = [...releases].sort(selected.method)

    if (selected.direction === "desc") {
      sortedItems.reverse()
    }

    setReleases(sortedItems)
  }

  async function getReleases() {
    try {
      let { data, error } = await supabase
        .from("releases")
        .select("*, codes (*)")
        .eq("user_id", profileData.id)
        .eq("codes.redeemed", "false")
        .order("created_at", { ascending: true })

      if (error) {
        throw error
      }

      if (data) {
        setReleases(data)
      }
    } catch (error) {
      alert("Error loading user releases!")
      console.log(error)
    }
  }

  return (
    <article className="stack">
      <header className="article-heading inline-wrap">
        <h2>Releases</h2>
        {profileData.is_subscribed || profileData.dlcm_friend ? (
          <div className={styles.filter}>
            <label className="label" htmlFor="order">
              Order
            </label>

            <select
              className="input select"
              id="order"
              onChange={(e) => handleSort(e.target.value)}
            >
              {filterOptions.map(({ label, value }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
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
        ) : releases.length >= 2 ? (
          <Link href="/api/subscribe-to-dlcm">Subscribe</Link>
        ) : (
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
        )}
      </header>

      <ul className="grid" role="list">
        {releases.length ? (
          <>
            {releases.map((release, index) =>
              profileData.is_subscribed ||
              profileData.dlcm_friend ||
              index <= 1 ? (
                <ReleaseCard
                  key={release.id}
                  release={release}
                  user={user}
                  getReleases={getReleases}
                  profileData={profileData}
                  profileSlug={user.user_metadata.slug}
                />
              ) : null
            )}
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
    </article>
  )
}
