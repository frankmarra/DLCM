import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"
import CreateRelease from "./CreateRelease"
import styles from "./Releases.module.css"
import cn from "classnames"
import IconMusicNotesPlus from "@/icons/music-notes-plus.svg"
import Link from "next/link"

export default function Releases({ profileData }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [releases, setReleases] = useState([])
  const [allowNew, setAllowNew] = useState(true)
  const [addedNewRelease, setAddedNewRelease] = useState(false)
  const [filter, setFilter] = useState("oldest")

  useEffect(() => {
    getReleases()
    setAddedNewRelease(false)
  }, [supabase, profileData.id, addedNewRelease])

  useEffect(() => {
    if (releases) {
      let sortedReleases = releases
      if (filter === "alphabetical") {
        sortedReleases.sort((a, b) => {
          let titleOne = a.title.toLowerCase()
          let titleTwo = b.title.toLowerCase()

          if (titleOne < titleTwo) {
            return -1
          }
          if (titleOne > titleTwo) {
            return 1
          }
          return 0
        })
      }

      setReleases(sortedReleases)
    }
  }, [filter])

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
        <div className={styles.filter}>
          <button
            className="button"
            data-variant="primary"
            type="button"
            onClick={() => setFilter("alphabetical")}
          >{`a -> z`}</button>
        </div>
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
                <Link href="/subscribe">Subscribe to add more releases</Link>
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
