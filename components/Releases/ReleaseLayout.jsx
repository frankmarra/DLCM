import { useState, useEffect } from "react"
import CodeGenerator from "../CodeGenerator/CodeGenerator"
import SocialSites from "../SocialSites/SocialSites"
import styles from "./ReleaseLayout.module.css"
import cn from "classnames"
import Head from "next/head"

export default function ReleaseLayout({ release, isSubscribed }) {
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
    <>
      <Head>
        <title>{release.title}</title>
        <meta
          property="og:title"
          content={`${release.title}'s code page`}
          key="title"
        />
        <meta
          property="og:description"
          content={`Grab a code for ${release.title} if there is one available.`}
          key="description"
        />
      </Head>
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
                <div className={styles.title}>
                  <h1>{release.title}</h1>
                </div>
                <div className={styles.artist}>
                  <h2>{release.artist}</h2>
                </div>
                <div className={styles.label}>
                  <h3>{release.label}</h3>
                </div>
                <p>{release.type}</p>
              </div>
              <SocialSites sites={release.sites} isSubscribed={isSubscribed} />
            </div>
          </div>
          {!authorized ? (
            <form
              className="container inline-max stack"
              style={{ "--max-inline-size": "400px" }}
              onSubmit={handleSubmit}
            >
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
          ) : (
            <div className={styles.codes}>
              <CodeGenerator release={release} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
