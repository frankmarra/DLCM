import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"
import { useRouter } from "next/router"

export default function Releases({ user, setShowCreateNewRelease }) {
  const supabase = useSupabaseClient()
  const [releases, setReleases] = useState([])

  useEffect(() => {
    async function getReleases() {
      try {
        let { data, error } = await supabase
          .from("releases")
          .select("*")
          .eq("user_id", user.id)

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

    getReleases()
  }, [supabase, user.id])

  return (
    <div
      className="stack max-inline"
      style={{ "--max-inline-size": "var(--input-screen-max-inline-size)" }}
    >
      <h2>Releases</h2>
      <button
        className="button"
        data-variant="primary"
        onClick={() => setShowCreateNewRelease(true)}
      >
        Create
      </button>

      <ul role="list">
        {releases.map((release) => (
          <li key={release.id}>
            <ReleaseCard
              title={release.title}
              artist={release.artist}
              label={release.label}
              type={release.type}
              artworkUrl={release.artwork_url}
              size={250}
              releaseId={release.id}
              userId={user.id}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
