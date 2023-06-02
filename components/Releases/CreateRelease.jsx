import slugify from "slugify"
import { useState } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import AddImage from "@/components/AddImage/AddImage"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog/Dialog"
import IconMusicNotesPlus from "@/icons/music-notes-plus.svg"

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
  const [artist, setArtist] = useState(
    user.user_metadata.type == "artist" ? user.user_metadata.username : ""
  )
  const [label, setLabel] = useState(
    user.user_metadata.type == "label" ? user.user_metadata.username : ""
  )
  const [artworkUrl, setArtworkUrl] = useState()
  const [yumUrl, setYumUrl] = useState(profileData.yum_url)
  const [pagePassword, setPagePassword] = useState()
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [type, setType] = useState(releaseTypes[5].text)
  const [imagePath, setImagePath] = useState()

  async function createNewRelease({
    title,
    artist,
    label,
    artworkUrl,
    yumUrl,
    type,
  }) {
    try {
      let newRelease = {
        title: title,
        artist: artist,
        label: label,
        artwork_url: artworkUrl,
        artwork_path: imagePath,
        yum_url: yumUrl,
        type: type,
        release_slug: slugify(title, { lower: true }),
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
      console.log("All done!")
      setAddedNewRelease(true)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <header>
          <h2>Create new release</h2>
        </header>

        <div className="stack block-overflow">
          <label className="label" htmlFor="title">
            Title
          </label>
          <input
            className="input"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

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

          <AddImage
            uid={user.id}
            setPublicUrl={(url) => {
              setArtworkUrl(url)
            }}
            setImagePath={setImagePath}
            imagePath={imagePath}
          />

          <label className="label" htmlFor="artworkUrl">
            Artwork
          </label>
          <input
            className="input"
            id="artworkUrl"
            type="text"
            value={artworkUrl}
            onChange={(e) => setArtworkUrl(e.target.value)}
          />

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
        </div>

        <footer className="button-actions inline-wrap">
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
              })
            }
            disabled={!title || !artist || !type}
          >
            Create
          </button>
          <DialogClose className="button">Cancel</DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
