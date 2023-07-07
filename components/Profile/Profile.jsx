import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"
import SocialSites from "../SocialSites/SocialSites"
import { useState } from "react"
import Head from "next/head"

export default function ProfileLayout({
  avatar,
  name,
  location,
  releases,
  profileSlug,
  sites,
  pagePassword,
  isPasswordProtected,
  aboutBlurb,
}) {
  const [artwork, setArtwork] = useState(avatar)
  const [password, setPassword] = useState()
  const [authorized, setAuthorized] = useState(
    isPasswordProtected ? false : true
  )
  const [showError, setShowError] = useState(false)
  const [sortedReleases, setSortedReleases] = useState(releases)

  const handleSort = (value) => {
    let arr

    if (value === "created oldest first") {
      arr = [...releases].sort((a, b) => (a.created_at > b.created_at ? 1 : -1))
    }
    if (value === "created newest first") {
      arr = [...releases].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    }
    if (value === "alphabetical a to z") {
      arr = [...releases].sort((a, b) => (a.title > b.title ? 1 : -1))
    }
    if (value === "alphabetical z to a") {
      arr = [...releases].sort((a, b) => (a.title < b.title ? 1 : -1))
    }

    setSortedReleases(arr)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (pagePassword == password) {
      setAuthorized(true)
    } else {
      setPassword("")
      setShowError(true)
    }
  }

  return (
    <>
      <Head>
        <title>{name}&apos;s public profile</title>
        <meta
          property="og:title"
          content={`${name}'s public profile`}
          key="title"
        />
        <meta
          property="og:description"
          content={`See all of ${name}'s available releases`}
          key="description"
        />
      </Head>

      <>
        <div className={styles.wrapper}>
          <div className={cn(styles.profile, "container")}>
            {avatar ? (
              <img
                src={artwork}
                alt={name}
                width={200}
                height={200}
                onError={() => setArtwork("/DLCM_Default_Image.png")}
              />
            ) : (
              <img
                src="/DLCM_Default_Image.png"
                alt={name}
                width={200}
                height={200}
              />
            )}
            <div className={cn(styles.info, "stack")}>
              <div>
                <h1>{name}</h1>
                <h2>{location}</h2>
                <h3>{aboutBlurb}</h3>
              </div>
              <SocialSites sites={sites} />
            </div>
          </div>
        </div>
        {!authorized ? (
          <div className={styles.wrapper}>
            <form
              className="container inline-max center-stage stack"
              style={{
                "--max-inline-size": "400px",
              }}
              onSubmit={handleSubmit}
            >
              <label htmlFor="password">Enter page password</label>

              <input
                className="input"
                id="password"
                type="password"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Submit</button>
              {showError ? (
                <p style={{ color: "red" }}>Incorrect password. Try Again.</p>
              ) : null}
            </form>
          </div>
        ) : (
          <>
            <div className={styles.filter}>
              <label className="label" htmlFor="order">
                Order
              </label>

              <select
                className="input select"
                id="order"
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="created oldest first" selected>
                  Oldest First
                </option>
                <option value="created newest first">Newest First</option>
                <option value="alphabetical a to z">A to Z</option>
                <option value="alphabetical z to a">Z to A</option>
              </select>
            </div>
            <ul className="grid" role="list">
              {sortedReleases.map((release) =>
                release.is_active ? (
                  <ReleaseCard
                    key={release.id}
                    release={release}
                    profileSlug={profileSlug}
                  />
                ) : null
              )}
            </ul>
          </>
        )}
      </>
    </>
  )
}
