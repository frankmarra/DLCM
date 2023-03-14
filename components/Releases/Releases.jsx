import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"
import { useRouter } from "next/router"
import AddCodes from "../AddCodes/AddCodes"

export default function Releases({ user, setCreateNewRelease }) {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [releases, setReleases] = useState([])
  const [showAddCodes, setShowAddCodes] = useState(false)

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
        onClick={() => setCreateNewRelease(true)}
      >
        Create
      </button>

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
              release_id={release.id}
              user_id={user.id}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
