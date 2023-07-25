import { useState, useEffect } from "react"
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

const releaseTypes = [
  { id: 1, text: "LP" },
  { id: 2, text: "EP" },
  { id: 3, text: "Single" },
  { id: 4, text: "Compilation" },
  { id: 5, text: "Soundtrack" },
  { id: 6, text: "Choose release type", isDisabled: true },
]

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
  const [sites, setSites] = useState({
    apple: release.sites.apple ? release.sites.apple : null,
    bandcamp: release.sites.bandcamp ? release.sites.bandcamp : null,
    spotify: release.sites.spotify ? release.sites.spotify : null,
    soundcloud: release.sites.soundcloud ? release.sites.soundcloud : null,
    youtube: release.sites.youtube ? release.sites.youtube : null,
  })

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
    setSites({
      apple: release.sites.apple ? release.sites.apple : null,
      spotify: release.sites.spotify ? release.sites.spotify : null,
      bandcamp: release.sites.bandcamp ? release.sites.bandcamp : null,
      soundcloud: release.sites.soundcloud ? release.sites.soundcloud : null,
      youtube: release.sites.youtube ? release.sites.youtube : null,
    })
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
        yum_url: yumUrl,
        type: type,
        sites: sites,
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
          <small>
            Public address: {process.env.NEXT_PUBLIC_DLCM_URL}
            {profileData.slug}
            {`/${sluggedName}`}
          </small>
          <br />
          <small style={{ color: `${namesTaken.color}` }}>
            {namesTaken.message}
          </small>
          <label className="label" htmlFor="type">
            Type
          </label>
          <select
            className="input select"
            onChange={(e) => setType(e.target.value)}
            id="type"
            value={type}
            required
          >
            {releaseTypes.map((releaseType) => (
              <option
                key={releaseType.id}
                value={releaseType.value}
                disabled={releaseType.isDisabled}
              >
                {releaseType.text}
              </option>
            ))}
          </select>
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
                <label className="label" htmlFor="isActive">
                  Show Release?
                </label>
                <input
                  className="input"
                  style={{ inlineSize: "50%", width: "20%" }}
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
              </div>
              <div style={{ display: "flex" }}>
                <label className="label" htmlFor="passwordProtect">
                  Password protect release?
                </label>
                <input
                  className="input"
                  style={{ inlineSize: "50%", width: "20%" }}
                  id="passwordProtect"
                  type="checkbox"
                  checked={isPasswordProtected}
                  onChange={() => setIsPasswordProtected(!isPasswordProtected)}
                />{" "}
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
