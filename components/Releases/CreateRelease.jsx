import { useState, useEffect } from "react"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"

const releaseTypes = [
  { id: 1, text: "LP" },
  { id: 2, text: "EP" },
  { id: 3, text: "Single" },
  { id: 4, text: "Compilation" },
  { id: 5, text: "Soundtrack" },
  { id: 6, text: "Choose release type", isDisabled: true },
]

export default function CreateRelease({ user, setCreateNewRelease }) {
  const supabase = useSupabaseClient()
  const [title, setTitle] = useState()
  const [artist, setArtist] = useState(
    user.user_metadata.type === "Artist" ? user.user_metadata.name : null
  )
  const [label, setLabel] = useState(
    user.user_metadata.type === "Label" ? user.user_metadata.name : null
  )
  const [artwork_url, setArtwork_url] = useState()
  const [download_url, setDownload_url] = useState()
  const [page_password, setPage_password] = useState()
  const [is_password_protected, setIs_password_protected] = useState(false)
  const [type, setType] = useState(releaseTypes[5].text)

  const [user_id, setUser_id] = useState(user.id)

  async function createNewRelease({
    title,
    artist,
    label,
    artwork_url,
    download_url,
    type,
    user_id,
  }) {
    try {
      let slugger = title.toLowerCase()
      let newRelease = {
        title: title,
        artist: artist,
        label: label,
        artwork_url: artwork_url,
        download_url: download_url,
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
      setCreateNewRelease(false)
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

      <label className="label" htmlFor="artwork_url">
        Artwork
      </label>
      <input
        className="input"
        id="artwork_url"
        type="text"
        value={artwork_url || ""}
        onChange={(e) => setArtwork_url(e.target.value)}
      />

      <label className="label" htmlFor="download_url">
        Download Url
      </label>
      <input
        className="input"
        id="download_url"
        type="text"
        value={download_url || ""}
        onChange={(e) => setDownload_url(e.target.value)}
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
            artwork_url,
            download_url,
            user_id,
          })
        }
        disabled={!title || !artist || !type}
      >
        Create
      </button>

      <button
        className="button"
        data-varian="primary"
        onClick={() => setCreateNewRelease(false)}
      >
        Cancel
      </button>
    </div>
  )
}
