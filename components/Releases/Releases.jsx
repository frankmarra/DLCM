import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"

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
      <h1>Releases</h1>

      <ul>
        {releases.map((release) => (
          <li key={release.id}>{release.title}</li>
        ))}
      </ul>
    </div>
  )
}
