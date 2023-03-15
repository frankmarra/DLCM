import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"
import CreateRelease from "./CreateRelease"

export default function Releases() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [releases, setReleases] = useState([])
  const [updateReleases, setUpdateReleases] = useState(true)

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
    if (updateReleases) {
      getReleases()
      setUpdateReleases(false)
    }
  }, [supabase, user.id, updateReleases])

  // const newReleases = supabase
  //   .channel("any")
  //   .on(
  //     "postgres_changes",
  //     {
  //       event: "INSERT",
  //       schema: "public",
  //       table: "releases",
  //     },
  //     (payload) => console.log("data: ", payload)
  //   )
  //   .subscribe()

  // console.log("new release: ", newReleases)

  return (
    <section
      className="stack max-inline"
      style={{ "--max-inline-size": "var(--input-screen-max-inline-size)" }}
    >
      <hr></hr>
      <h2>Releases</h2>

      <CreateRelease setUpdateReleases={setUpdateReleases} />

      <ul className="stack" role="list">
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
    </section>
  )
}
