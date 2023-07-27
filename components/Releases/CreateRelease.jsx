import slugify from "slugify"
import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import AddImage from "@/components/AddImage/AddImage"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog/Dialog"
import IconMusicNotesPlus from "@/icons/music-notes-plus.svg"
import Avatar from "../Avatar/Avatar"
import PopoverTip from "../PopoverTip/PopoverTip"
import { prependProtocol } from "@/utils/utils"

const releaseTypes = [
  { id: 1, text: "LP" },
  { id: 2, text: "EP" },
  { id: 3, text: "Single" },
  { id: 4, text: "Compilation" },
  { id: 5, text: "Soundtrack" },
  { id: 6, text: "Choose release type", isDisabled: true },
]

export default function CreateRelease({
  trigger,
  setAddedNewRelease,
  profileData,
}) {
  const user = useUser()
  const supabase = useSupabaseClient()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState()
  const [sluggedName, setSluggedName] = useState("")
  const [firstSlugCheck, setFirstSlugCheck] = useState(false)
  const [namesTaken, setNamesTaken] = useState({
    color: "transparent",
    message: "",
  })
  const [noGO, setNoGO] = useState(true)
  const [artist, setArtist] = useState(
    profileData.type == "artist" ? profileData.username : ""
  )
  const [label, setLabel] = useState(
    profileData.type == "label" ? profileData.username : ""
  )
  const [artworkUrl, setArtworkUrl] = useState()
  const [yumUrl, setYumUrl] = useState(profileData.yum_url)
  const [pagePassword, setPagePassword] = useState()
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [type, setType] = useState(releaseTypes[5].text)
  const [newImagePath, setNewImagePath] = useState()
  const [isActive, setIsActive] = useState(true)
  const [sites, setSites] = useState({
    apple: null,
    spotify: null,
    bandcamp: null,
    soundcloud: null,
    youtube: null,
  })

  const resetForm = () => {
    setTitle()
    setSluggedName("")
    setFirstSlugCheck(false)
    setNoGO(true)
    setArtworkUrl()
    setPagePassword()
    setIsPasswordProtected(false)
    setType(releaseTypes[5].text)
    setNewImagePath()
    setIsActive(true)
    setNamesTaken({
      color: "transparent",
      message: "",
    })
    setSites({
      apple: null,
      spotify: null,
      bandcamp: null,
      soundcloud: null,
      youtube: null,
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

  async function createNewRelease({
    title,
    artist,
    label,
    artworkUrl,
    yumUrl,
    type,
    sites,
    isActive,
    isPasswordProtected,
  }) {
    try {
      let newRelease = {
        title: title,
        artist: artist,
        label: label,
        artwork_url: artworkUrl,
        artwork_path: newImagePath,
        yum_url: prependProtocol(yumUrl),
        type: type,
        sites: sites,
        is_active: isActive,
        is_password_protected: isPasswordProtected,
        release_slug: sluggedName,
        user_id: user.id,
      }
      const { data, error } = await supabase
        .from("releases")
        .insert([newRelease])
      if (error) throw error
      alert("New release created!")
    } catch (error) {
      alert("Error creating new release!")
    } finally {
      setAddedNewRelease(true)
      resetForm()
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
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <header>
          <h2 className="text-3">Create new release</h2>
        </header>

        <div className="stack block-overflow">
          <label className="label">Artwork </label>
          <Avatar url={artworkUrl} size={250} />
          <small>{"Must be 1MB or less"}</small>
          <br />
          <AddImage
            uid={user.id}
            setPublicUrl={(url) => {
              setArtworkUrl(url)
            }}
            setNewImagePath={setNewImagePath}
          />
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
              message={`This is where you will send your fans. Release slugs are unique to you, so no two can be named the same. If you do have multiple releases with the same name, add an identifier such as the release year to the slug.`}
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

          <label className="label" htmlFor="artist">
            Artist
          </label>
          <input
            className="input"
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />

          <label className="label" htmlFor="label">
            Label
          </label>
          <input
            className="input"
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
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
          <p>You must include https:// in your links</p>
          <label className="label" htmlFor="yumUrl">
            Redemption (yum) Link
          </label>
          <input
            className="input"
            id="yumUrl"
            type="text"
            value={yumUrl}
            onChange={(e) => setYumUrl(e.target.value)}
          />
          <small>
            This is the link your customers will visit to redeem their code. It
            is usually <code>your-name.bandcamp/yum</code>
          </small>

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
                  Password protect page?
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
          <button
            className="button"
            data-variant="primary"
            onClick={() =>
              createNewRelease({
                title,
                artist,
                label,
                type,
                artworkUrl,
                yumUrl,
                sites,
                isActive,
                isPasswordProtected,
              })
            }
            disabled={!title || type == releaseTypes[5].text || noGO}
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
