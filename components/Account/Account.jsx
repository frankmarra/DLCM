import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import styles from "./Account.module.css"
import cn from "classnames"
import Avatar from "@/components/Avatar/Avatar"
import Releases from "@/components/Releases/Releases"

export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`*`)
          .eq("id", user.id)
          .single()

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          setUsername(data.username)
          setAvatarUrl(data.avatar_url)
        }
      } catch (error) {
        alert("Error loading user data!")
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [session, supabase, user.id])

  async function updateProfile({ username, avatarUrl }) {
    try {
      setLoading(true)

      const updates = {
        id: user.id,
        username: username,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
      if (error) throw error
      alert("Profile updated!")
    } catch (error) {
      alert("Error updating the data!")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="stack max-inline"
      style={{ "--max-inline-size": "var(--input-screen-max-inline-size)" }}
    >
      <Avatar
        uid={user.id}
        url={avatarUrl}
        size={250}
        setPublicUrl={(url) => {
          setAvatarUrl(url)
          updateProfile({ username, avatarUrl: url })
        }}
      />

      <h1>{username}</h1>

      <label className="label" htmlFor="username">
        Name
      </label>
      <input
        className="input"
        id="username"
        type="text"
        value={username || ""}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="label" htmlFor="email">
        Email
      </label>
      <input
        className="input"
        id="email"
        type="text"
        value={session.user.email}
        disabled
      />

      <div className="button-actions block-wrap">
        <button
          className="button"
          data-variant="primary"
          onClick={() => updateProfile({ username, avatarUrl })}
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <button className="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>

      <Releases />
    </div>
  )
}
