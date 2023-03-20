import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import Avatar from "@/components/Avatar/Avatar"
import Releases from "@/components/Releases/Releases"
import UpdateProfile from "../UpdateProfile/UpdateProfile"

export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [loading, setLoading] = useState(true)
  // const [username, setUsername] = useState(null)
  // const [avatarUrl, setAvatarUrl] = useState(null)
  const [showUpdateView, setShowUpdateView] = useState(false)
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session, supabase, user.id])

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
        console.log(profileData)
      }
    } catch (error) {
      alert("Error loading user data!")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return !loading ? (
    <div
      className="stack max-inline"
      style={{ "--max-inline-size": "var(--input-screen-max-inline-size)" }}
    >
      {!updateView ? (
        <>
          <Avatar url={profileData.avatar_url} size={250} />

          <h1>{profileData.username}</h1>
          <button className="button" onClick={() => setShowUpdateView(true)}>
            Update profile?
          </button>
        </>
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

      <div className="button-actions block-wrap">
        <button className="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>

      <Releases />
    </div>
  ) : (
    <p>Loading...</p>
  )
}
