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
import PopoverTip from "../PopoverTip/PopoverTip"
import Link from "next/link"

export default function UpdateProfile({
  getProfile,
  profileData,
  setShowUpdateView,
}) {
  const supabase = useSupabaseClient()
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(profileData.username)
  const [avatarUrl, setAvatarUrl] = useState(profileData.avatar_url)
  const [aboutBlurb, setAboutBlurb] = useState(profileData.about_blurb)
  const [location, setLocation] = useState(profileData.location)
  const [isPasswordProtected, setIsPasswordProtected] = useState(
    profileData.is_password_protected
  )
  const [pagePassword, setPagePassword] = useState(profileData.page_password)
  const [sluggedName, setSluggedName] = useState(profileData.slug)
  const [noGo, setNoGo] = useState(false)
  const [imagePath, setImagePath] = useState(profileData.avatar_path)
  const [newImagePath, setNewImagePath] = useState()
  const [yumUrl, setYumUrl] = useState(profileData.yum_url)
  const [namesTaken, setNamesTaken] = useState({
    color: "transparent",
    message: "",
  })
  const [sites, setSites] = useState({
    apple: profileData.sites.apple ? profileData.sites.apple : null,
    bandcamp: profileData.sites.bandcamp ? profileData.sites.bandcamp : null,
    spotify: profileData.sites.spotify ? profileData.sites.spotify : null,
    soundcloud: profileData.sites.soundcloud
      ? profileData.sites.soundcloud
      : null,
    youtube: profileData.sites.youtube ? profileData.sites.youtube : null,
  })

  const checkName = async (e) => {
    e.preventDefault()

    if (sluggedName.length > 0) {
      setSluggedName(slugify(sluggedName))
      if (sluggedName == profileData.slug) {
        setNamesTaken({ color: "green", message: "This is your current URL" })
        setNoGo(false)
      } else {
        let { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("slug", sluggedName)

        if (data.length > 0) {
          setNamesTaken({ color: "red", message: "Urls taken, try again" })
          setNoGo(true)
        } else if (data.length == 0) {
          setNamesTaken({
            color: "green",
            message: "This url is available, snag it!",
          })
          setNoGo(false)
        }

        if (error) throw error
      }
    }
  }

  async function updateUserProfile() {
    try {
      const updates = {
        username: username,
        id: profileData.id,
        location: location,
        avatar_url: avatarUrl,
        avatar_path: newImagePath ? newImagePath : imagePath,
        slug: sluggedName,
        sites: sites,
        page_password: pagePassword,
        is_password_protected: isPasswordProtected,
        yum_url: yumUrl,
        about_blurb: aboutBlurb,
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
    }
    getProfile()
    setShowUpdateView(false)
  }

  async function cancelUpdate() {
    if (newImagePath) {
      try {
        let { error } = await supabase.storage
          .from("images")
          .remove([newImagePath])
        if (error) alert(error)
      } catch (error) {
        throw error
      }
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="button"
        data-variant="primary"
        data-size="small"
      >
        Update profile
      </DialogTrigger>

      <DialogContent>
        <header>
          <h2>Update profile</h2>
        </header>

        <div className="stack block-overflow">
          <Avatar url={avatarUrl} size={250} />
          <small>{"Must be 1MB or less"}</small>
          <br />
          <AddImage
            uid={profileData.id}
            setPublicUrl={(url) => setAvatarUrl(url)}
            setNewImagePath={setNewImagePath}
            imagePath={imagePath}
          />
          <br />
          <label className="label" htmlFor="username">
            {profileData.type.charAt(0).toUpperCase() +
              profileData.type.slice(1)}{" "}
            name
          </label>
          <input
            className="input"
            id="username"
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {profileData.is_subscribed || profileData.dlcm_friend ? (
            <>
              <label className="label" htmlFor="slug">
                {profileData.type.charAt(0).toUpperCase() +
                  profileData.type.slice(1)}{" "}
                slug
                <PopoverTip
                  message={`If you change this, your previous slug will not redirect your fans to this page. Make sure you want to do this.`}
                />
              </label>

              <input
                className="input"
                id="slug"
                type="text"
                value={
                  sluggedName
                    ? slugify(sluggedName, { lower: true, trim: false })
                    : sluggedName
                }
                onChange={(e) => setSluggedName(e.target.value)}
                onBlur={checkName}
                required
              />
            </>
          ) : null}
          <small>
            Public address: {process.env.NEXT_PUBLIC_DLCM_URL}
            {`${sluggedName}`}
          </small>{" "}
          <br />
          <small style={{ color: `${namesTaken.color}` }}>
            {namesTaken.message}
          </small>
          <Link
            className="button"
            data-variant="primary"
            style={{ textDecoration: "none" }}
            href="/reset-password"
          >
            Change your password
          </Link>
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
          <label className="label" htmlFor="aboutBlurb">
            About blurb
          </label>
          <textarea
            className="input"
            id="aboutBlurb"
            name="aboutBlurb"
            rows="5"
            cols="30"
            value={aboutBlurb}
            onChange={(e) => setAboutBlurb(e.target.value)}
            placeholder="Enter a brief about section for your fans (optional)"
          ></textarea>
          <h3>You must include https:// in your links</h3>
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
          <small>
            This is the link your customers will visit to redeem their code. It
            is usually &quot;your-name.bandcamp/yum&quot;
          </small>
          {profileData.is_subscribed || profileData.dlcm_friend ? (
            <>
              <label className="label" htmlFor="apple">
                Apple Music Link
              </label>
              <input
                className="input"
                id="apple"
                type="text"
                value={sites.apple}
                onChange={(e) =>
                  setSites({ ...sites, [e.target.id]: e.target.value })
                }
              />

              <label className="label" htmlFor="bandcamp">
                Bandcamp Link
              </label>
              <input
                className="input"
                id="bandcamp"
                type="text"
                value={sites.bandcamp}
                onChange={(e) =>
                  setSites({ ...sites, [e.target.id]: e.target.value })
                }
              />

              <label className="label" htmlFor="spotify">
                Spotify Link
              </label>
              <input
                className="input"
                id="spotify"
                type="text"
                value={sites.spotify}
                onChange={(e) =>
                  setSites({ ...sites, [e.target.id]: e.target.value })
                }
              />

              <label className="label" htmlFor="soundcloud">
                Soundcloud Link
              </label>
              <input
                className="input"
                id="soundcloud"
                type="text"
                value={sites.soundcloud}
                onChange={(e) =>
                  setSites({ ...sites, [e.target.id]: e.target.value })
                }
              />

              <label className="label" htmlFor="youtube">
                YouTube Link
              </label>
              <input
                className="input"
                id="youtube"
                type="text"
                value={sites.youtube}
                onChange={(e) =>
                  setSites({ ...sites, [e.target.id]: e.target.value })
                }
              />
              <div style={{ display: "flex" }}>
                <label className="label" htmlFor="isPasswordProtected">
                  Password protect profile page?
                </label>

                <input
                  className="input"
                  style={{ inlineSize: "50%", width: "20%" }}
                  id="isPasswordProtected"
                  type="checkbox"
                  checked={isPasswordProtected}
                  onChange={() => setIsPasswordProtected(!isPasswordProtected)}
                />
              </div>

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
            disabled={noGo}
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
