import { useState, useEffect } from "react"
import CodeGenerator from "../CodeGenerator/CodeGenerator"

export default function ReleaseLayout({ release }) {
  const [password, setPassword] = useState()
  const [authorized, setAuthorized] = useState(
    release.is_password_protected ? false : true
  )
  const [showError, setShowError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (release.page_password == password) {
      setAuthorized(true)
    } else {
      setPassword("")
      setShowError(true)
    }
  }
  return (
    <div
      className="stack inline-max"
      style={{ "--max-inline-size": "var(--input-screen-inline-max-size" }}
    >
      {release.artwork_url ? (
        <img
          src={release.artwork_url}
          alt={release.title}
          height={250}
          width={250}
        />
      ) : null}
      <h1>{release.title}</h1>
      <h2>{release.artist}</h2>
      <h3>{release.label}</h3>
      <h4>{release.type}</h4>
      {authorized ? (
        release.is_active ? (
          <CodeGenerator releaseId={release.id} yumUrl={release.yum_url} />
        ) : (
          <p>No Codes Available</p>
        )
      ) : (
        <form className="stack" onSubmit={handleSubmit}>
          <label htmlFor="password">Enter Password</label>

          <input
            className="input"
            id="password"
            type="password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Submit</button>
          {showError ? (
            <p style={{ color: "red" }}>Incorrect Password. Try Again.</p>
          ) : null}
        </form>
      )}
    </div>
  )
}
