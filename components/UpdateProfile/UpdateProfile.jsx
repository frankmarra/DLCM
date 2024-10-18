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
import InputReleaseAbout from "../InputReleaseAbout/InputReleaseAbout"
import formReducer from "../../utils/formReducer"
import inputValidator from "../../utils/inputValidator"
import Loader from "@/components/Loader/Loader"
import InputGenres from "../InputGenres/InputGenres"
import InputAudioPlayerEmbed from "../InputAudioPlayerEmbed/InputAudioPlayerEmbed"

export default function UpdateProfile({
  getProfile,
  profileData,
  setShowUpdateView,
}) {
  const initialFormValue = {
    username: profileData.username,
    sluggedName: profileData.slug,
    // aboutBlurb: profileData.about_blurb,
    location: profileData.location,
    yumUrl: profileData.yum_url,
    sites: profileData.sites ?? null,
    pagePassword: profileData.page_password,
    isPasswordProtected: profileData.is_password_protected,
    inPublicIndex: profileData.in_public_index,
    genres: profileData.genres,
    submitting: false,
    success: false,
    error: null,
    playerEmbed: profileData.player_embed,
  }

  const initialValidation = {
    isNameValid: {
      color: "transparent",
      message: "",
      isValid: true,
    },
    isFormValid: true,
    checking: false,
  }

  const supabase = createClientComponentClient()
  const [open, setOpen] = useState(false)
  const [formValue, dispatch] = useReducer(formReducer, initialFormValue)
  const [validation, validate] = useReducer(inputValidator, initialValidation)
  const [avatarUrl, setAvatarUrl] = useState(profileData.avatar_url)
  const [imagePath, setImagePath] = useState(profileData.avatar_path)
  const [newImagePath, setNewImagePath] = useState()
  const [aboutBlurb, setAboutBlurb] = useState(profileData.about_blurb)

  const {
    username,
    location,
    yumUrl,
    sluggedName,
    sites,
    pagePassword,
    isPasswordProtected,
    inPublicIndex,
    genres,
    playerEmbed,
  } = formValue

  const { isNameValid, isFormValid } = validation

  useEffect(() => {
    const checkFormIsValid = () => {
      if (isNameValid.isValid) {
        validate({
          type: "formSuccess",
        })
      }
    }

    checkFormIsValid()
  }, [isNameValid.isValid])

  const handleChange = (e) => {
    dispatch({
      type: "change",
      name: e.target.id,
      value: e.target.value,
    })
  }

  const checkName = async (e) => {
    e.preventDefault()
    if (sluggedName.length == 0) {
      validate({
        type: "error",
        name: "isNameValid",
        message: "Profile must have a slug",
      })
    }
    if (sluggedName.length > 0) {
      if (sluggedName == profileData.slug) {
        validate({
          type: "success",
          name: "isNameValid",
          message: "This is your current URL",
        })
      } else {
        let { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("slug", sluggedName)

        if (data.length > 0) {
          validate({
            type: "error",
            name: "isNameValid",
            message: "URLs taken, try again",
          })
        } else if (data.length == 0) {
          validate({
            type: "success",
            name: "isNameValid",
            message: "This URL is available, snag it!",
          })
        }

        if (error) throw error
      }
    }
  }

  async function updateUserProfile() {
    dispatch({ type: "submit" })

    for (let site in sites) {
      sites[site] = prependProtocol(sites[site])
    }
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
        in_public_index: inPublicIndex,
        genres: genres,
        yum_url: prependProtocol(yumUrl),
        about_blurb: aboutBlurb,
        updated_at: new Date().toISOString(),
        player_embed: playerEmbed,
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
    validate({ type: "reset", state: initialValidation })
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
            onChange={handleChange}
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
                    type: "change",
                    name: "sluggedName",
                    value: slugify(e.target.value, {
                      lower: true,
                      trim: false,
                      remove: /[*+~.()'"!:@]/g,
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
          <small className="hint" style={{ color: isNameValid.color }}>
            {isNameValid.message}
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
            onChange={handleChange}
          />
          <InputReleaseAbout about={aboutBlurb} setAbout={setAboutBlurb} />
          <label className="label" htmlFor="yumUrl">
            Redemption{`(yum)`} Link
          </label>
          <input
            className="input"
            id="yumUrl"
            type="text"
            value={yumUrl || ""}
            onChange={handleChange}
          />
          <small className="hint">
            This is the link your customers will visit to redeem their code. It
            is usually <code>your-name.bandcamp.com/yum</code>
          </small>
          {profileData.is_subscribed || profileData.dlcm_friend ? (
            <>
              <InputAudioPlayerEmbed
                onChange={dispatch}
                playerEmbed={playerEmbed}
              />
            </>
          ) : null}
          <InputSocialSites
            sites={sites}
            onChange={dispatch}
            hasProAccount={profileData.is_subscribed || profileData.dlcm_friend}
            labelArtist={
              profileData.type.charAt(0).toUpperCase() +
              profileData.type.slice(1)
            }
            showPersonal={true}
          />
          <div className="container">
            <label className="label checkbox" htmlFor="inPublicIndex">
              <input
                type="checkbox"
                id="inPublicIndex"
                checked={inPublicIndex}
                onChange={() =>
                  dispatch({
                    type: "change",
                    name: "inPublicIndex",
                    value: !inPublicIndex,
                  })
                }
              />
              <strong>Show profile in public index?</strong>
              <PopoverTip message="Selecting this allows your profile to be discoverable by anyone who visits our public index page" />
            </label>
          </div>
          <InputGenres genres={genres} onChange={dispatch} />
          {profileData.is_subscribed || profileData.dlcm_friend ? (
            <InputPasswordProtect
              id="isPasswordProtected"
              isProtected={isPasswordProtected}
              pagePassword={pagePassword}
              setIsProtected={() =>
                dispatch({
                  type: "change",
                  name: "isPasswordProtected",
                  value: !isPasswordProtected,
                })
              }
              setPagePassword={(e) =>
                dispatch({
                  type: "change",
                  name: "pagePassword",
                  value: e.target.value,
                })
              }
              onChange={dispatch}
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
            disabled={!isFormValid}
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
