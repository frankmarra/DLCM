import slugify from "slugify"
import { useState, useEffect, useRef, useReducer } from "react"
import { useUser } from "@supabase/auth-helpers-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AddImage from "@/components/AddImage/AddImage"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog/Dialog"
import Avatar from "../Avatar/Avatar"
import PopoverTip from "../PopoverTip/PopoverTip"
import { prependProtocol } from "@/utils/utils"
import InputPasswordProtect from "../InputPasswordProtect/InputPasswordProtect"
import InputReleaseType from "../InputReleaseType/InputReleaseType"
import InputSocialSites from "../InputSocialSites/InputSocialSites"
import InputIsActive from "../InputIsActive/InputIsActive"
import InputReleaseAbout from "../InputReleaseAbout/InputReleaseAbout"
import formReducer from "../../utils/formReducer"
import inputValidator from "../../utils/inputValidator"
import Loader from "@/components/Loader/Loader"
import InputAudioPlayerEmbed from "../InputAudioPlayerEmbed/InputAudioPlayerEmbed"

export default function CreateRelease({
  trigger,
  setAddedNewRelease,
  profileData,
}) {
  //Create reducer initial values
  const initialFormValue = {
    title: "",
    sluggedName: "",
    artist: profileData.type == "artist" ? profileData.username : "",
    label: profileData.type == "label" ? profileData.username : "",
    yumUrl: profileData.yum_url ?? "",
    releaseDate: null,
    type: "Choose release type",
    about: "",
    sites: {},
    payerEmbed: "",
    isPasswordProtected: false,
    pagePassword: "",
    isActive: true,
    firstSlugCheck: false,
    submitting: false,
    success: false,
    error: null,
  }

  const initialValidation = {
    isNameValid: {
      color: "transparent",
      message: "",
      isValid: false,
    },
    isFormValid: false,
    checking: false,
  }
  const [formValue, dispatch] = useReducer(formReducer, initialFormValue)
  const [validation, validate] = useReducer(inputValidator, initialValidation)

  //Supabase
  const user = useUser()
  const supabase = createClientComponentClient()

  const [open, setOpen] = useState(false)
  const [artworkUrl, setArtworkUrl] = useState()
  const [newImagePath, setNewImagePath] = useState()
  const [about, setAbout] = useState()

  //Destructured formValue for easier use
  const {
    title,
    sluggedName,
    artist,
    label,
    releaseDate,
    yumUrl,
    type,
    sites,
    playerEmbed,
    firstSlugCheck,
    pagePassword,
    isPasswordProtected,
    isActive,
  } = formValue

  //Destructured validation
  const { isNameValid, isFormValid } = validation

  useEffect(() => {
    //Checks for form validation. Add conditions to the if statement to increase requirements. Whatever is added to the statement, must also be added to the dependency array.
    const checkFormIsValid = () => {
      if (isNameValid.isValid) {
        validate({
          type: "formSuccess",
        })
      }
    }

    checkFormIsValid()
  }, [isNameValid.isValid, type])

  //Resets values not handled by the reducer
  const resetForm = () => {
    setArtworkUrl()
    setNewImagePath()
    setAbout()
  }

  const handleChange = (e) => {
    dispatch({
      type: "change",
      name: e.target.id,
      value: e.target.value,
    })
  }

  //Validates release slug
  const checkName = async (e) => {
    e.preventDefault()
    if (sluggedName.length == 0) {
      validate({
        type: "error",
        name: "isNameValid",
        message: "Release must have a slug",
      })
    }
    if (sluggedName.length > 0) {
      if (firstSlugCheck == false) {
        dispatch({
          type: "change",
          name: "firstSlugCheck",
          value: true,
        })
      }
      let { data, error } = await supabase
        .from("releases")
        .select("*")
        .eq("user_id", user.id)
        .eq("release_slug", sluggedName)

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

  function stripEmbed(embedToStrip) {
    let strippedEmbed = ""

    if (embedToStrip.length > 0) {
      let embedArray = embedToStrip.split("/")

      embedArray.forEach((value) => {
        if (value.match(/(?:album=)\d+/)) {
          strippedEmbed = value.slice(6)
        }
      })

      return strippedEmbed
    }
  }

  async function createNewRelease() {
    dispatch({ type: "submit" })
    let embed = stripEmbed(playerEmbed)

    try {
      let newRelease = {
        title: title,
        artist: artist,
        label: label,
        artwork_url: artworkUrl,
        artwork_path: newImagePath,
        yum_url: prependProtocol(yumUrl),
        type: type ?? null,
        sites: sites,
        player_embed: embed,
        is_active: isActive,
        is_password_protected: isPasswordProtected,
        page_password: pagePassword,
        release_slug: sluggedName,
        release_date: releaseDate,
        about: about,
        user_id: user.id,
      }
      const { data, error } = await supabase
        .from("releases")
        .insert([newRelease])
      if (error) {
        dispatch({ type: "error", error: error.message })
        alert(error.message)
      } else {
        alert("New release created!")
        dispatch({ type: "success" })
      }
    } catch (error) {
      alert("Error creating new release!")
      dispatch({ type: "error", error: error.message })
    } finally {
      setAddedNewRelease(true)
      resetForm()
      dispatch({ type: "reset", state: initialFormValue })
      validate({ type: "reset", state: initialValidation })
      setOpen(false)
    }
  }

  async function cancelCreate() {
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
    resetForm()
    dispatch({ type: "reset", state: initialFormValue })
    validate({ type: "reset", state: initialValidation })
    setOpen(false)
  }

  if (formValue.submitting) {
    return <Loader style={{ margin: "auto" }} />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <header>
          <h2 className="text-3">Create new release</h2>
        </header>

        <div className="stack block-overflow">
          <label className="label">Artwork</label>
          <Avatar url={artworkUrl} size={250} />
          <AddImage
            uid={user.id}
            setPublicUrl={(url) => {
              setArtworkUrl(url)
            }}
            setNewImagePath={setNewImagePath}
          />
          <br />
          <p>* Denotes Required</p>
          <label className="label" htmlFor="title">
            Title*
          </label>
          <input
            className="input"
            id="title"
            type="text"
            value={title}
            onChange={handleChange}
            onInput={
              firstSlugCheck
                ? null
                : (e) =>
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
            onBlur={firstSlugCheck ? null : checkName}
          />

          <div className="input-wrapper">
            <label htmlFor="slug">Release slug*</label>
            <PopoverTip
              message={`This is where you will send your fans. Release slugs are unique to you, so no two can be named the same. If you do have multiple releases with the same name, add an identifier such as the release year to the slug.`}
            />
            <input
              className="input"
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
              id="slug"
              type="text"
              value={sluggedName}
              onBlur={checkName}
            />
          </div>
          <small className="hint">
            Public address:{" "}
            <code>
              {process.env.NEXT_PUBLIC_DLCM_URL}
              {profileData.slug}
              {`/${sluggedName}`}
            </code>
          </small>
          <br />
          <small style={{ color: isNameValid.color }}>
            {isNameValid.message}
          </small>

          <label className="label" htmlFor="artist">
            Artist*
          </label>
          <input
            className="input"
            id="artist"
            type="text"
            value={artist}
            onChange={handleChange}
            required
          />

          <label className="label" htmlFor="label">
            Label
          </label>
          <input
            className="input"
            id="label"
            type="text"
            value={label}
            onChange={handleChange}
          />

          {/*<label className="label" htmlFor="artworkUrl">
            Artwork URL
          </label>
          <input
            className="input"
            id="artworkUrl"
            type="text"
            value={artworkUrl}
            onChange={(e) => setArtworkUrl(e.target.value)}
          />
          <p>Upload an image or paste an external link</p>*/}

          <InputReleaseType type={type} onChange={dispatch} />

          <label htmlFor="releaseDate" className="label">
            Release Date:
            <input
              className="input"
              id="releaseDate"
              type="date"
              value={releaseDate}
              onChange={handleChange}
            />
          </label>

          <label className="label" htmlFor="yumUrl">
            Redemption (yum) Link
          </label>
          <input
            className="input"
            id="yumUrl"
            type="text"
            value={yumUrl}
            onChange={handleChange}
          />
          <small class="hint">
            This is the link your customers will visit to redeem their code. It
            is usually <code>your-name.bandcamp.com/yum</code>.
          </small>

          {profileData.is_subscribed || profileData.dlcm_friend ? (
            <InputAudioPlayerEmbed
              playerEmbed={playerEmbed}
              onChange={dispatch}
            />
          ) : null}

          <InputSocialSites
            sites={sites}
            onChange={dispatch}
            hasProAccount={profileData.is_subscribed || profileData.dlcm_friend}
          />

          {profileData.is_subscribed || profileData.dlcm_friend ? (
            <>
              <InputIsActive isActive={isActive} onChange={dispatch}>
                Show Release
              </InputIsActive>
              <InputReleaseAbout about={about} setAbout={setAbout} />
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
                // setPagePassword={(e) => setPagePassword(e.target.value)}
                onChange={dispatch}
              >
                Password protect this page
              </InputPasswordProtect>
            </>
          ) : null}
        </div>

        <footer className="button-actions cluster">
          <button
            className="button"
            data-variant="primary"
            onClick={() => createNewRelease()}
            disabled={!isFormValid}
          >
            Create
          </button>
          <button className="button" onClick={() => cancelCreate()}>
            Cancel
          </button>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
