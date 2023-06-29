import { useState, useEffect } from "react"
import CodeGenerator from "../CodeGenerator/CodeGenerator"
import SocialSites from "../SocialSites/SocialSites"
import styles from "./ReleaseLayout.module.css"
import cn from "classnames"

export default function ReleaseLayout({ release }) {
  const [password, setPassword] = useState()
  const [authorized, setAuthorized] = useState(
    release.is_password_protected ? false : true
  )
  const [showError, setShowError] = useState(false)
  const [artwork, setArtwork] = useState(release.artwork_url)

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
        <div className={cn(styles.release, "container")}>
          {release.artwork_url ? (
            <img
              src={artwork}
              alt={release.title}
              height={250}
              width={250}
              onError={() => setArtwork("/DLCM_Default_Image.png")}
            />
          ) : (
            <img
              src="/DLCM_Default_Image.png"
              alt={release.title}
              height={250}
              width={250}
            />
          )}
          <div className={cn(styles.info, "stack")}>
            <div>
              <h1 style={{ fontSize: "3rem" }}>{release.title}</h1>
              <h2>{release.artist}</h2>
              <h3>{release.label}</h3>
              <p>{release.type}</p>
            </div>
            <SocialSites sites={release.sites} />
          </div>
        </div>

        <div className={styles.codes}>
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
    </div>
  )
}
