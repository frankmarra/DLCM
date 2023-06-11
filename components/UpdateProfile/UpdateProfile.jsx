import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Avatar from "../Avatar/Avatar"
import AddImage from "../AddImage/AddImage"
import slugify from "slugify"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog/Dialog"

export default function UpdateProfile({
  getProfile,
  profileData,
  setShowUpdateView,
}) {
  const supabase = useSupabaseClient()
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(profileData.username)
  const [avatarUrl, setAvatarUrl] = useState(profileData.avatar_url)
  const [location, setLocation] = useState(profileData.location)
  const [isPasswordProtected, setIsPasswordProtected] = useState(
    profileData.is_password_protected
  )
  const [pagePassword, setPagePassword] = useState(profileData.page_password)
  const [sluggedName, setSluggedName] = useState(profileData.slug)
  const [imagePath, setImagePath] = useState(profileData.avatar_path)
  const [newImagePath, setNewImagePath] = useState()
  const [yumUrl, setYumUrl] = useState(profileData.yum_url)

  useEffect(() => {
    setSluggedName(slugify(username, { lower: true }))
  }, [username])

  async function updateUserProfile() {
    try {
      const updates = {
        username: username,
        id: profileData.id,
        avatar_url: avatarUrl,
        avatar_path: newImagePath ? newImagePath : imagePath,
        yum_url: yumUrl,
        updated_at: new Date().toISOString(),
      }

      if (newImagePath) {
        try {
          let { error } = await supabase.storage
            .from("images")
            .remove([imagePath])
          if (error) alert(error)
        } catch (error) {
          throw error
        }
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
      setShowUpdateView(false)
    }
  }

  async function cancelUpdate() {
    if (newImagePath) {
      try {
        let { error } = await supabase.storage
          .from("images")
          .remove([newImagePath])
        if (error) alert(error)
        setOpen(false)
      } catch (error) {
        throw error
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="button" data-variant="primary">
        Update Profile
      </DialogTrigger>

      <DialogContent>
        <header>
          <h2>Update profile</h2>
        </header>

        <div className="stack block-overflow">
          <Avatar url={avatarUrl} size={250} />
          <AddImage
            uid={profileData.id}
            setPublicUrl={(url) => setAvatarUrl(url)}
            setNewImagePath={setNewImagePath}
          />
          <br />

          <label className="label" htmlFor="username">
            Username
          </label>
          <br />
          <small>
            This will change your profile URL.{" "}
            {process.env.NEXT_PUBLIC_DLCM_URL}
            {profileData.type}/{`${sluggedName}`}
          </small>
          <input
            className="input"
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

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

          <label className="label" htmlFor="yumUrl">
            Redemption{`(yum)`} Link
          </label>
          <input
            className="input"
            id="yumUrl"
            type="text"
            value={yumUrl || ""}
            onChange={(e) => setYumUrl(e.target.value)}
          />
          {profileData.is_subscribed ? (
            <>
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
            </>
          ) : null}
        </div>
        <footer className="button-actions inline-wrap">
          <button
            className="button"
            data-variant="primary"
            onClick={() => updateUserProfile()}
            disabled={!username}
          >
            Update
          </button>
          <button className="button" onClick={() => cancelUpdate()}>
            Cancel
          </button>
        </footer>
      </DialogContent>
    </Dialog>
  )
}

// <DialogClose className="button">Cancel</DialogClose>
