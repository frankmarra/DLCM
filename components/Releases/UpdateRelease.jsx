import { useState, useEffect, useRef, useReducer } from "react"
import { useUser } from "@supabase/auth-helpers-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AddImage from "../AddImage/AddImage"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog/Dialog"
import IconEdit from "@/icons/edit.svg"
import Avatar from "../Avatar/Avatar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import PopoverTip from "../PopoverTip/PopoverTip"
import slugify from "slugify"
import { prependProtocol } from "@/utils/utils"
import InputPasswordProtect from "../InputPasswordProtect/InputPasswordProtect"
import InputReleaseType from "../InputReleaseType/InputReleaseType"
import InputSocialSites from "../InputSocialSites/InputSocialSites"
import InputIsActive from "../InputIsActive/InputIsActive"
import InputReleaseAbout from "../InputReleaseAbout/InputReleaseAbout"
import formReducer from "../../utils/formReducer"
import inputValidator from "../../utils/inputValidator"
import Loader from "@/components/Loader/Loader"

export default function UpdateRelease({
  release,
  setShowReleaseUpdateView,
  getProfile,
  profileData,
}) {
  const supabase = createClientComponentClient()
  const user = useUser()
  const initialFormValue = {
    title: release.title,
    sluggedName:
      release.release_slug ??
      slugify(release.title, { lower: true, remove: /[*+~.()'"!:@]/g }),
    yumUrl: release.yum_url,
    releaseDate: release.release_date,
    type: release.type,
    sites: release.sites,
    firstSlugCheck: false,
    pagePassword: release.page_password,
    isPasswordProtected: release.is_password_protected,
    isActive: release.is_active,
    submitting: false,
    success: false,
    error: null,
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

  const [formValue, dispatch] = useReducer(formReducer, initialFormValue)
  const [validation, validate] = useReducer(inputValidator, initialValidation)
  const [open, setOpen] = useState(false)
  const [artworkUrl, setArtworkUrl] = useState(release.artwork_url)
  // const [isPasswordProtected, setIsPasswordProtected] = useState(
  //   release.is_password_protected
  // )
  // const [pagePassword, setPagePassword] = useState(release.page_password)
  const [artworkId, setArtworkId] = useState()
  const [imagePath, setImagePath] = useState(release.artwork_path)
  const [newImagePath, setNewImagePath] = useState()
  // const [isActive, setIsActive] = useState(release.is_active)
  const [about, setAbout] = useState(release.about)

  const {
    title,
    sluggedName,
    yumUrl,
    releaseDate,
    type,
    sites,
    firstSlugCheck,
    pagePassword,
    isPasswordProtected,
    isActive,
  } = formValue

  const { isNameValid, isFormValid } = validation

  const resetForm = () => {
    setArtworkUrl(release.artwork_url)
    setNewImagePath()
    // setIsActive(release.is_active)
    setAbout(release.about)
  }

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
        message: "Release must have a slug",
      })
    }
    if (sluggedName.length > 0) {
      if (firstSlugCheck == false) {
        dispatch({ type: "change", name: "firstSlugCheck", value: true })
      }
      if (sluggedName == release.release_slug) {
        validate({
          type: "success",
          name: "isNameValid",
          message: "This is your current URL",
        })
      } else {
        let { data, error } = await supabase
          .from("releases")
          .select("*")
          .eq("user_id", user.id)
          .eq("release_slug", sluggedName)

        if (data.length > 0) {
          validate({
            type: "error",
            name: "isNameValid",
            message: "This URL is taken, try again",
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

  async function updateRelease() {
    try {
      const update = {
        title: title,
        release_slug: sluggedName,
        artwork_url: artworkUrl,
        artwork_path: newImagePath ? newImagePath : imagePath,
        yum_url: prependProtocol(yumUrl),
        type: type,
        sites: sites,
        release_date: releaseDate,
        about: about,
        is_active: isActive,
        is_password_protected: isPasswordProtected,
        page_password: pagePassword,
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
        .from("releases")
        .update(update)
        .eq("id", release.id)

      if (error) {
        dispatch({ type: "error", error: error.message })
        alert(error.message)
      } else {
        dispatch({ type: "success" })
      }
    } catch (error) {
      alert("Error updating the data!")
      dispatch({ type: "error", error: error.message })
      console.log(error)
    } finally {
      getProfile()
      setShowReleaseUpdateView(false)
      alert("Release updated!")
      resetForm()
      dispatch({ type: "reset", state: initialFormValue })
      validate({ type: "reset", state: initialValidation })
      setOpen(false)
    }
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
    resetForm()
    dispatch({ type: "reset", state: initialFormValue })
    validate({ type: "reset", state: initialValidation })
    setOpen(false)
  }

  async function deleteRelease() {
    const deleteCheck = window.prompt(
      `Please enter 'delete' to delete this release.`
    )

    if (deleteCheck === "delete") {
      try {
        let { data, error } = await supabase.storage
          .from("images")
          .remove([release.artwork_path])

        let { error: codeError } = await supabase
          .from("codes")
          .delete()
          .eq("release_id", release.id)

        let { error: releaseError } = await supabase
          .from("releases")
          .delete()
          .eq("id", release.id)

        if (codeError) throw error
        if (releaseError) throw error
        alert("Release deleted.")
      } catch (error) {
        alert("Error deleting data!")
        console.log(error)
      } finally {
        getProfile()
        resetForm()
        dispatch({ type: "reset", state: initialFormValue })
        validate({ type: "reset", state: initialValidation })
        setOpen(false)
      }
    } else {
      alert("Incorrect input")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="button"
        data-variant="primary"
        data-size="small"
      >
        <IconEdit aria-hidden="true" /> Edit
      </DialogTrigger>

      <DialogContent>
        <header>
          <h2 className="text-3">Update release</h2>
        </header>

        <div className="stack block-overflow">
          <Avatar url={artworkUrl} size={250} />
          <small>{"Must be 1MB or less"}</small>
          <br />
          <AddImage
            uid={user.id}
            setPublicUrl={(url) => {
              setArtworkUrl(url)
            }}
            setNewImagePath={setNewImagePath}
            imagePath={imagePath}
          />
          <br />
          <p>* Denotes Required</p>
          {/*<label className="label" htmlFor="artworkUrl">
            Artwork Url
          </label>
          <input
            className="input"
            id="artworkUrl"
            type="text"
            value={artworkUrl}
            onChange={(e) => setArtworkUrl(e.target.value)}
          />*/}
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
              message={`This is where you will send your fans. Release slugs are unique to you, so no two can be named the same. If you do have multiple releases with the same name, add an identifier such as the release year to the slug. WARNING: If changed, the previous url for this release will no longer be available to visit. `}
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
            Redemption Link
          </label>
          <input
            className="input"
            id="yumUrl"
            type="text"
            value={yumUrl}
            onChange={handleChange}
          />

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
                setPagePassword={(e) =>
                  dispatch({
                    type: "change",
                    name: "pagePassword",
                    value: e.target.value,
                  })
                }
                onChange={dispatch}
              >
                Password protect this release
              </InputPasswordProtect>
            </>
          ) : null}
        </div>

        <footer className="button-actions cluster">
          <div className="update-buttons">
            <button
              className="button"
              data-variant="primary"
              onClick={updateRelease}
              style={{ marginInlineEnd: "1em" }}
              disabled={!isFormValid}
            >
              Update
            </button>

            <button className="button" onClick={() => cancelUpdate()}>
              Cancel
            </button>
          </div>

          <button
            className="button"
            data-variant="secondary"
            aria-label="Delete this release"
            onClick={deleteRelease}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
