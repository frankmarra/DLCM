import { useState, useEffect } from "react"
import CodeGenerator from "../CodeGenerator/CodeGenerator"
import SocialSites from "../SocialSites/SocialSites"
import styles from "./ReleaseLayout.module.css"
import cn from "classnames"
import Head from "next/head"
import Image from "next/image"

export default function ReleaseLayout({
  release,
  isSubscribed,
  isDlcmFriend,
  profileYumLink,
}) {
  const [password, setPassword] = useState()
  const [authorized, setAuthorized] = useState(!release.is_password_protected)
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
      <div className={cn(styles.wrapper, "stack inline-max")}>
        <Image
          className={styles.artwork}
          src={release.artwork_url || "/default-image-release.png"}
          alt={release.title}
          height={250}
          width={250}
        />
        <div>
          <h1 className={styles.title}>{release.title}</h1>
          <p className={styles.artist}>{release.artist}</p>
          <p className={styles.label}>{release.label}</p>
          <p>{release.type == "Choose release type" ? null : release.type}</p>
        </div>
        <SocialSites
          sites={release.sites}
          isSubscribed={isSubscribed}
          isDlcmFriend={isDlcmFriend}
        />
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
          <CodeGenerator release={release} profileYumLink={profileYumLink} />
        </div>
      )}
    </>
  )
}
