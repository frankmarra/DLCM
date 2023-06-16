import { useState, useEffect } from "react"
import CodeGenerator from "../CodeGenerator/CodeGenerator"
import SocialSites from "../SocialSites/SocialSites"
import styles from "./ReleaseLayout.module.css"

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
    <div className={styles.wrapper}>
      <div
        className="stack "
        style={{
          "--max-inline-size": "var(--input-screen-inline-max-size)",
        }}
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
        <p>{release.type}</p>
        <SocialSites sites={release.sites} />

        {authorized ? (
          <CodeGenerator release={release} />
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
    </div>
  )
}
