import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import ReleaseCard from "./ReleaseCard"
import CreateRelease from "./CreateRelease"

export default function Releases() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [releases, setReleases] = useState([])

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

        <CreateRelease />
      </header>
      <ul className="grid" role="list">
        {releases.map((release) => (
          <ReleaseCard
            key={release.id}
            release={release}
            user={user}
            getReleases={getReleases}
          />
        ))}
      </ul>
    </article>
  )
}
