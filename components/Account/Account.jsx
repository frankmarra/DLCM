import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Avatar from "@/components/Avatar/Avatar"
import Releases from "@/components/Releases/Releases"
import UpdateProfile from "../UpdateProfile/UpdateProfile"
import styles from "./Account.module.css"
import cn from "classnames"

export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [showUpdateView, setShowUpdateView] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const { user } = session
  useEffect(() => {
    getProfile()
  }, [])

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
        setProfileData(data)
      }
    } catch (error) {
      alert("Error loading user data!")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      {!showUpdateView ? (
        <article className={cn(styles.profile, "inline-wrap")}>
          <Avatar url={profileData.avatar_url} size={100} />
          <div className={styles.details}>
            <div className="badge">{user.user_metadata.type}</div>
            <h1>{user.user_metadata.name}</h1>
            <div>
              <strong>Location: </strong>
              {user.user_metadata.location}
            </div>
            <div className={styles.url}>
              <strong>Profile page: </strong>
              <a href={`/${user.user_metadata.slug}`}>
                {user.user_metadata.slug}
              </a>
            </div>
          </div>
          <button
            className="button"
            data-size="small"
            onClick={() => setShowUpdateView(true)}
          >
            Update profile
          </button>
        </article>
      ) : (
        <>
          <UpdateProfile
            getProfile={getProfile}
            profileData={profileData}
            setShowUpdateView={setShowUpdateView}
          />
          <button className="button" onClick={() => setShowUpdateView(false)}>
            Cancel
          </button>
        </>
      )}

      <Releases />
    </>
  )
}
