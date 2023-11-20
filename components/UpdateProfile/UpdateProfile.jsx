import { useState, useEffect, useReducer } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
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
import { prependProtocol } from "@/utils/utils"
import InputPasswordProtect from "../InputPasswordProtect/InputPasswordProtect"
import InputSocialSites from "../InputSocialSites/InputSocialSites"
import InputReducer from "../InputReducer/InputReducer"
import Loader from "@/components/Loader/Loader"

export default function UpdateProfile({
  getProfile,
  profileData,
  setShowUpdateView,
}) {
  const initialFormValue = {
    username: profileData.username,
    sluggedName: profileData.slug,
    aboutBlurb: profileData.about_blurb,
    location: profileData.location,
    yumUrl: profileData.yum_url,
    sites: profileData.sites ?? null,
    submitting: false,
    success: false,
    error: null,
  }
  const supabase = createClientComponentClient()
  const [open, setOpen] = useState(false)
  const [formValue, dispatch] = useReducer(InputReducer, initialFormValue)

  const [avatarUrl, setAvatarUrl] = useState(profileData.avatar_url)
  const [isPasswordProtected, setIsPasswordProtected] = useState(
    profileData.is_password_protected
  )
  const [pagePassword, setPagePassword] = useState(profileData.page_password)
  const [noGo, setNoGo] = useState(false)
  const [imagePath, setImagePath] = useState(profileData.avatar_path)
  const [newImagePath, setNewImagePath] = useState()
  const [namesTaken, setNamesTaken] = useState({
    color: "transparent",
    message: "",
  })

  const { username, aboutBlurb, location, yumUrl, sluggedName, sites } =
    formValue

  const checkName = async (e) => {
    e.preventDefault()
    if (sluggedName.length == 0) {
      setNamesTaken({ color: "red", message: "Profile must have a slug" })
      setNoGo(true)
    }
    if (sluggedName.length > 0) {
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
    dispatch({ type: "submit" })
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
        yum_url: prependProtocol(yumUrl),
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
      if (error) {
        dispatch({ type: "error", error: error.message })
        alert(error.message)
      } else {
        alert("Profile updated!")
        dispatch({ type: "success" })
      }
    } catch (error) {
      alert("Error updating the data!")
      dispatch({ type: "error", error: error.message })
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
    dispatch({ type: "reset", state: initialFormValue })
    setOpen(false)
  }

  if (formValue.submitting) {
    return <Loader style={{ margin: "auto" }} />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="button"
        data-variant="secondary"
        data-size="small"
      >
        Update profile
      </DialogTrigger>

      <DialogContent>
        <header>
          <h2 className="text-3">Update profile</h2>
        </header>

        <div className="stack block-overflow">
          <Avatar url={avatarUrl} size={250} />
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
            onChange={(e) =>
              dispatch({
                type: "input",
                name: "username",
                value: e.target.value,
              })
            }
            required
          />
          {profileData.is_subscribed || profileData.dlcm_friend ? (
            <>
              <label className="label" htmlFor="slug">
                {profileData.type.charAt(0).toUpperCase() +
                  profileData.type.slice(1)}{" "}
                slug
                <PopoverTip message="If you change this, your previous slug will no longer work. Make sure you want to do this." />
              </label>

              <input
                className="input"
                id="slug"
                type="text"
                value={sluggedName}
                onChange={(e) =>
                  dispatch({
                    type: "input",
                    name: "sluggedName",
                    value: slugify(e.target.value, {
                      lower: true,
                      trim: false,
                    }),
                  })
                }
                onBlur={checkName}
                required
              />
            </>
          ) : null}
          <small className="hint">
            Public address:{" "}
            <code>
              {process.env.NEXT_PUBLIC_DLCM_URL}
              {`${sluggedName}`}
            </code>
          </small>{" "}
          <br />
          <small className="hint" style={{ color: `${namesTaken.color}` }}>
            {namesTaken.message}
          </small>
          <br />
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
            onChange={(e) =>
              dispatch({
                type: "input",
                name: "location",
                value: e.target.value,
              })
            }
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
            onChange={(e) =>
              dispatch({
                type: "input",
                name: "aboutBlurb",
                value: e.target.value,
              })
            }
            placeholder="Enter a brief about section for your fans (optional)"
          ></textarea>
          <label className="label" htmlFor="yumUrl">
            Redemption{`(yum)`} Link
          </label>
          <input
            className="input"
            id="yumUrl"
            type="text"
            value={yumUrl || ""}
            onChange={(e) =>
              dispatch({
                type: "input",
                name: "yumUrl",
                value: e.target.value,
              })
            }
          />
          <small className="hint">
            This is the link your customers will visit to redeem their code. It
            is usually <code>your-name.bandcamp.com/yum</code>
          </small>
          <InputSocialSites
            sites={sites}
            dispatch={dispatch}
            hasProAccount={profileData.is_subscribed || profileData.dlcm_friend}
            labelArtist={
              profileData.type.charAt(0).toUpperCase() +
              profileData.type.slice(1)
            }
            showPersonal={true}
          />
          {profileData.is_subscribed || profileData.dlcm_friend ? (
            <InputPasswordProtect
              id="isPasswordProtected"
              isProtected={isPasswordProtected}
              pagePassword={pagePassword}
              setIsProtected={() =>
                setIsPasswordProtected(!isPasswordProtected)
              }
              setPagePassword={(e) => setPagePassword(e.target.value)}
            >
              Password protect your profile page
            </InputPasswordProtect>
          ) : null}
        </div>
        <footer className="button-actions cluster">
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
