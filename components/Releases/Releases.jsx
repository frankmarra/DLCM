import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"
import CreateRelease from "./CreateRelease"
import styles from "./Releases.module.css"
import cn from "classnames"
import IconMusicNotesPlus from "@/icons/music-notes-plus.svg"

export default function Releases() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [releases, setReleases] = useState([])
  const [openCreateRelease, setOpenCreateRelease] = useState(false)

  useEffect(() => {
    console.log(openCreateRelease)
  }, [openCreateRelease])

  useEffect(() => {
    getReleases()
  }, [supabase, user.id])
  async function getReleases() {
    try {
      let { data, error } = await supabase
        .from("releases")
        .select("*, codes (*)")
        .eq("user_id", user.id)
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

  const newReleases = supabase
    .channel("new-release-added")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "releases",
      },
      (payload) => {
        if (payload.new.user_id === user.id) {
          const newRelease = payload.new

          setReleases([...releases, newRelease])
        }
      }
    )
    .subscribe()

  return (
    <article className="stack">
      <header className="article-heading inline-wrap">
        <h2>Releases</h2>

        <CreateRelease
          open={openCreateRelease}
          onOpenChange={setOpenCreateRelease}
        />
      </header>
      <ul className="grid" role="list">
        {releases.length ? (
          <>
            {releases.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                user={user}
                getReleases={getReleases}
              />
            ))}
            <li
              className={cn(styles.actionCard, "container")}
              data-variant="empty"
            >
              <button
                className={cn(styles.actionCardButton, "button")}
                data-variant="text"
                onClick={() => setOpenCreateRelease(true)}
              >
                <IconMusicNotesPlus aria-hidden="true" />
                Create a new release
              </button>
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
