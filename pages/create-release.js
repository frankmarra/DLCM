import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase"
import { useUser } from "@/utils/context/user"
import Link from "next/link"
import Login from "@/components/Login/Login"

const trueFalse = [
  { id: 1, text: "True", value: true },
  { id: 2, text: "False", value: false },
]

const releaseTypes = [
  { id: 1, text: "LP" },
  { id: 2, text: "EP" },
  { id: 3, text: "Single" },
  { id: 4, text: "Compilation" },
  { id: 5, text: "Soundtrack" },
  { id: 6, text: "Choose release type", isDisabled: true },
]

export default function CreateRelease() {
  const { user } = useUser()
  const [newRelease, setNewRelease] = useState({
    title: "",
    artist: "",
    label: "",
    artwork: "",
    downloadUrl: "",
    pagePassword: "",
    isPasswordProtected: trueFalse[1].value,
    type: releaseTypes[5].text,
    userId: "",
  })

  useEffect(() => {
    if (user) {
      setNewRelease({
        ...newRelease,
        label: user.type === "Label" ? user.name : null,
        artist: user.type === "Artist" ? user.name : null,
      })
    }
  }, [user])

  const handleChange = (e) => {
    setNewRelease({ ...newRelease, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.from("releases").insert([newRelease])
  }

  return user ? (
    <div className="create-release-wrapper">
      <h1>Add new release</h1>
      <form className="create-release-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="title">Title</label>
          <input
            onChange={handleChange}
            id="title"
            type="text"
            value={newRelease.title}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="artist">Artist</label>
          {user.type === "Artist" ? (
            <p>{user.name}</p>
          ) : (
            <input
              onChange={handleChange}
              id="artist"
              type="text"
              value={newRelease.artist}
            />
          )}
        </div>
        <div className="input-wrapper">
          <label htmlFor="label">Label</label>
          {user.type === "Label" ? (
            <p>{user.name}</p>
          ) : (
            <input
              onChange={handleChange}
              id="label"
              type="text"
              value={newRelease.label}
            />
          )}
        </div>
        <div className="input-wrapper">
          <label htmlFor="artwork">Artwork</label>
          <input
            onChange={handleChange}
            id="artwork"
            type="text"
            value={newRelease.artwork}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="type">Type</label>
          <select
            onChange={handleChange}
            id="type"
            value={newRelease.type}
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
        <div className="input-wrapper">
          <label htmlFor="isPasswordProtected">Password protect release?</label>
          <select
            onChange={handleChange}
            id="isPasswordProtected"
            value={newRelease.isPasswordProtected}
          >
            {trueFalse.map((bool) => (
              <option key={bool.id} value={bool.value}>
                {bool.text}
              </option>
            ))}
          </select>
          {newRelease.isPasswordProtected ? (
            <div className="input-wrapper">
              <label htmlFor="pagePassword">Page password</label>
              <input
                onChange={handleChange}
                id="pagePassword"
                type="password"
                value={newRelease.pagePassword}
              />
            </div>
          ) : null}
        </div>
        <button
          type="submit"
          className="btn primary"
          disabled={!newRelease.title || !newRelease.type}
        >
          Create
        </button>
      </form>
    </div>
  ) : (
    <div>
      <p>You must login to use this function</p>
      <Login />
      <p>
        don't have an account?{" "}
        <span>
          <Link href="/signup">Sign up</Link>
        </span>
      </p>
    </div>
  )
}
