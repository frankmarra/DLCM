import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"

export default function Releases({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [releases, setReleases] = useState([])

  useEffect(() => {
    async function getReleases() {
      try {
        setLoading(true)

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
      } finally {
        setLoading(false)
      }
    }

    getReleases()
  }, [session, supabase, user.id])

  return (
    <div
      className="stack max-inline"
      style={{ "--max-inline-size": "var(--input-screen-max-inline-size)" }}
    >
      <h2>Releases</h2>

      <ul>
        {releases.map((release) => (
          <li key={release.id}>
            <ReleaseCard
              title={release.title}
              artist={release.artist}
              label={release.label}
              type={release.type}
              artwork_url={release.artwork_url}
              size={250}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
