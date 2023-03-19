import { useEffect, useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import IconUpload from "@/icons/upload.svg"
import classNames from "classnames"
import Avatar from "../Avatar/Avatar"
import AddImage from "../AddImage/AddImage"

export default function UpdateProfile({
  getProfile,
  profileData,
  setUpdateView,
}) {
  const supabase = useSupabaseClient()
  const [avatarUrl, setAvatarUrl] = useState(profileData.avatar_url)
  const [location, setLocation] = useState(profileData.location)
  const [isPasswordProtected, setIsPasswordProtected] = useState(
    profileData.is_password_protected
  )
  const [pagePassword, setPagePassword] = useState(profileData.page_password)

  async function updateUserProfile(avatarUrl) {
    try {
      const updates = {
        id: profileData.id,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profileData.id)
      if (error) throw error
      alert("Profile updated!")
    } catch (error) {
      alert("Error updating the data!")
      console.log(error)
    } finally {
      getProfile()
      setUpdateView(false)
    }
  }

  return (
    <div
      classname="stack max-inline"
      style={{ "--max-inline-size": "var(--input-screen-max-inline-size" }}
    >
      <h1>Update profile</h1>

      <h2>Update avatar</h2>
      <Avatar url={avatarUrl} size={250} />
      <AddImage
        uid={profileData.id}
        setPublicUrl={(url) => setAvatarUrl(url)}
      />
      <br />

      <label className="label" htmlFor="location">
        Location
      </label>
      <input
        className="input"
        id="location"
        type="text"
        value={location || ""}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        id="passwordProtect"
        type="checkbox"
        checked={isPasswordProtected}
        onChange={() => setIsPasswordProtected(!isPasswordProtected)}
      />
      <label className="label" htmlFor="passwordProtect">
        Password protect page?
      </label>

      {isPasswordProtected ? (
        <>
          <label className="label" htmlFor="pagePassword">
            Page password
          </label>
          <input
            className="input"
            id="pagePassword"
            type="password"
            value={pagePassword || ""}
            onChange={(e) => setPagePassword(e.target.value)}
          />
        </>
      ) : null}

      <div className="button-actions block-wrap">
        <button
          className="button"
          data-variant="primary"
          onClick={() => updateUserProfile(avatarUrl)}
        >
          Update
        </button>
      </div>
    </div>
  )
}
