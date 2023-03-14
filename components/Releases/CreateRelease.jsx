import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

const releaseTypes = [
  { id: 1, text: "LP" },
  { id: 2, text: "EP" },
  { id: 3, text: "Single" },
  { id: 4, text: "Compilation" },
  { id: 5, text: "Soundtrack" },
  { id: 6, text: "Choose release type", isDisabled: true },
]

export default function CreateRelease({ user, setShowCreateNewRelease }) {
  const supabase = useSupabaseClient()
  const [title, setTitle] = useState()
  const [artist, setArtist] = useState(
    user.user_metadata.type === "Artist" ? user.user_metadata.name : null
  )
  const [label, setLabel] = useState(
    user.user_metadata.type === "Label" ? user.user_metadata.name : null
  )
  const [artworkUrl, setArtworkUrl] = useState()
  const [downloadUrl, setDownloadUrl] = useState()
  const [pagePassword, setPagePassword] = useState()
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [type, setType] = useState(releaseTypes[5].text)

  const [userId, setUserId] = useState(user.id)

  async function createNewRelease({
    title,
    artist,
    label,
    artworkUrl,
    downloadUrl,
    type,
    userId,
  }) {
    try {
      let slugger = title.toLowerCase()
      let newRelease = {
        title: title,
        artist: artist,
        label: label,
        artwork_url: artworkUrl,
        download_url: downloadUrl,
        type: type,
        release_slug: slugger
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
        user_id: user_id,
      }
      const { data, error } = await supabase
        .from("releases")
        .insert([newRelease])
      if (error) throw error
      alert("New release created!")
    } catch (error) {
      alert("Error creating new release!")
    } finally {
      setShowCreateNewRelease(false)
    }
  }

  return (
    <div
      className="stack max-inline"
      style={{ "--max-inline-size": "var(--input-screen-max-inline-size" }}
    >
      <h1>Create new release</h1>

      <label className="label" htmlFor="title">
        Title
      </label>
      <input
        className="input"
        id="title"
        type="text"
        value={title || ""}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="label" htmlFor="artist">
        Artist
      </label>
      <input
        className="input"
        id="artist"
        type="text"
        value={artist || ""}
        onChange={(e) => setArtist(e.target.value)}
      />

      <label className="label" htmlFor="label">
        Label
      </label>
      <input
        className="input"
        id="label"
        type="text"
        value={label || ""}
        onChange={(e) => setLabel(e.target.value)}
      />

      <label className="label" htmlFor="artworkUrl">
        Artwork
      </label>
      <input
        className="input"
        id="artworkUrl"
        type="text"
        value={artworkUrl || ""}
        onChange={(e) => setArtworkUrl(e.target.value)}
      />

      <label className="label" htmlFor="downloadUrl">
        Download Url
      </label>
      <input
        className="input"
        id="downloadUrl"
        type="text"
        value={downloadUrl || ""}
        onChange={(e) => setDownloadUrl(e.target.value)}
      />

      <label className="label" htmlFor="type">
        Type
      </label>
      <select
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
            downloadUrl,
            userId,
          })
        }
        disabled={!title || !artist || !type}
      >
        Create
      </button>

      <button
        className="button"
        data-varian="primary"
        onClick={() => setShowCreateNewRelease(false)}
      >
        Cancel
      </button>
    </div>
  )
}
