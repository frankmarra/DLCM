import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import styles from "./Account.module.css"
import cn from "classnames"
import Avatar from "@/components/Avatar/Avatar"

export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState(null)
  const [avatar, setAvatarUrl] = useState(null)

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
          setName(data.name)
          setAvatarUrl(data.avatar)
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

  async function updateProfile({ name, avatar }) {
    try {
      setLoading(true)

      const updates = {
        id: user.id,
        name,
        avatar,
        // updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from("profiles").upsert(updates)
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
    <div className="stack">
      <Avatar
        uid={user.id}
        url={avatar}
        size={250}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ name, avatar: url })
        }}
      />

      <h1>{name}</h1>

      <label className="label" htmlFor="name">
        Name
      </label>
      <input
        className="input"
        id="name"
        type="text"
        value={name || ""}
        onChange={(e) => setName(e.target.value)}
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

      <div className={cn(styles.actions, "block-wrap")}>
        <button
          className="button"
          data-variant="primary"
          onClick={() => updateProfile({ name, avatar })}
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>

        <button className="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
