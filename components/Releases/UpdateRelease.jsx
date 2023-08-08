import { useState, useEffect, useRef } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
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

export default function UpdateRelease({
  release,
  setShowReleaseUpdateView,
  getProfile,
  profileData,
}) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(release.title)
  const [sluggedName, setSluggedName] = useState(
    release.release_slug ?? slugify(release.title)
  )
  const [namesTaken, setNamesTaken] = useState({
    color: "transparent",
    message: "",
  })
  const [firstSlugCheck, setFirstSlugCheck] = useState(false)
  const [noGO, setNoGO] = useState(true)
  const [artworkUrl, setArtworkUrl] = useState(release.artwork_url)
  const [yumUrl, setYumUrl] = useState(release.yum_url)
  const [isPasswordProtected, setIsPasswordProtected] = useState(
    release.is_password_protected
  )
  const [pagePassword, setPagePassword] = useState(release.page_password)
  const [artworkId, setArtworkId] = useState()
  const [imagePath, setImagePath] = useState(release.artwork_path)
  const [newImagePath, setNewImagePath] = useState()
  const [isActive, setIsActive] = useState(release.is_active)
  const [type, setType] = useState(release.type)
  const [sites, setSites] = useState(release.sites)
  const [releaseDate, setReleaseDate] = useState(release.release_date)

  const resetForm = () => {
    setTitle(release.title)
    setSluggedName(release.release_slug ?? slugify(release.title))
    setFirstSlugCheck(false)
    setNoGO(true)
    setArtworkUrl(release.artwork_url)
    setPagePassword(release.page_password)
    setIsPasswordProtected(release.is_password_protected)
    setType(release.type)
    setNewImagePath()
    setIsActive(release.is_active)
    setNamesTaken({
      color: "transparent",
      message: "",
    })
    setSites(release.sites ?? null)
    setReleaseDate(release.release_date)
  }

  const checkName = async (e) => {
    e.preventDefault()
    if (sluggedName.length == 0) {
      setNamesTaken({ color: "red", message: "Release must have a slug" })
      setNoGO(true)
    }
    if (sluggedName.length > 0) {
      if (firstSlugCheck == false) {
        setFirstSlugCheck(true)
      }
      setSluggedName(slugify(sluggedName))
      let { data, error } = await supabase
        .from("releases")
        .select("*")
        .eq("user_id", user.id)
        .eq("release_slug", sluggedName)

      if (data.length > 0) {
        setNamesTaken({ color: "red", message: "Urls taken, try again" })
        setNoGO(true)
      } else if (data.length == 0) {
        setNamesTaken({
          color: "green",
          message: "This url is available, snag it!",
        })
        setNoGO(false)
      }

      if (error) throw error
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

      if (error) throw error
    } catch (error) {
      alert("Error updating the data!")
      console.log(error)
    } finally {
      getProfile()
      setShowReleaseUpdateView(false)
      alert("Release updated!")
      resetForm()
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
    setOpen(false)
  }

  async function deleteRelease() {
    const deleteCheck = window.prompt(
      `Please enter '${release.title}' to delete this release.`
    )

    if (deleteCheck === release.title) {
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
        getReleases()
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
            Title
          </label>
          <input
            className="input"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onInput={
              firstSlugCheck
                ? null
                : (e) =>
                    setSluggedName(slugify(e.target.value, { lower: true }))
            }
            onBlur={firstSlugCheck ? null : checkName}
          />

          <div className="input-wrapper">
            <label htmlFor="slug">Release slug</label>
            <PopoverTip
              message={`This is where you will send your fans. Release slugs are unique to you, so no two can be named the same. If you do have multiple releases with the same name, add an identifier such as the release year to the slug. WARNING: If changed, the previous url for this release will no longer be available to visit. `}
            />
            <input
              className="input"
              onChange={(e) => setSluggedName(e.target.value)}
              id="slug"
              type="text"
              value={
                sluggedName
                  ? slugify(sluggedName, { lower: true, trim: false })
                  : sluggedName
              }
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
          <small style={{ color: `${namesTaken.color}` }}>
            {namesTaken.message}
          </small>

          <InputReleaseType type={type} onChange={setType} />

          <label htmlFor="releaseDate" className="label">
            Release Date:
            <input
              className="input"
              id="releaseDate"
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
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
            onChange={(e) => setYumUrl(e.target.value)}
          />

          <InputSocialSites
            sites={sites}
            setSites={setSites}
            hasProAccount={profileData.is_subscribed || profileData.dlcm_friend}
          />
          {profileData.is_subscribed || profileData.dlcm_friend ? (
            <>
              <InputIsActive isActive={isActive} setIsActive={setIsActive}>
                Show Release
              </InputIsActive>
              <InputPasswordProtect
                id="isPasswordProtected"
                isProtected={isPasswordProtected}
                pagePassword={pagePassword}
                setIsProtected={() =>
                  setIsPasswordProtected(!isPasswordProtected)
                }
                setPagePassword={(e) => setPagePassword(e.target.value)}
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
              disabled={sluggedName.length == 0}
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
