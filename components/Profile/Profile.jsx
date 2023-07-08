import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"
import SocialSites from "../SocialSites/SocialSites"
import { useState } from "react"
import Head from "next/head"

const sortByCreatedAt = (a, b) => (a.created_at > b.created_at ? 1 : -1)
const sortByTitle = (a, b) => (a.title > b.title ? 1 : -1)

const filterOptions = [
  {
    label: "Oldest First",
    value: "oldest",
    method: sortByCreatedAt,
    direction: "asc",
  },
  {
    label: "Newest First",
    value: "newest",
    method: sortByCreatedAt,
    direction: "desc",
  },
  { label: "A to Z", value: "a-z", method: sortByTitle, direction: "asc" },
  { label: "Z to A", value: "z-a", method: sortByTitle, direction: "desc" },
]

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
  isSubscribed,
}) {
  const [artwork, setArtwork] = useState(avatar)
  const [password, setPassword] = useState()
  const [authorized, setAuthorized] = useState(
    isPasswordProtected ? false : true
  )
  const [showError, setShowError] = useState(false)
  const [sortedReleases, setSortedReleases] = useState(releases)

  const handleSort = (value) => {
    const selected = filterOptions.find((option) => option.value === value)
    let sortedItems

    sortedItems = [...releases].sort(selected.method)

    if (selected.direction === "desc") {
      sortedItems.reverse()
    }

    setSortedReleases(sortedItems)
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
            <div className={cn(styles.info, "stack", "block-overflow")}>
              <div>
                <div className={cn(styles.name)}>
                  <h1>{name}</h1>
                </div>
                <div className={cn(styles.location)}>
                  <h2>{location}</h2>
                </div>
                <div className={cn(styles.blurb)}>
                  <p>{aboutBlurb}</p>
                </div>
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
            {isSubscribed ? (
              <div className={styles.filter}>
                <label className="label" htmlFor="order">
                  Order
                </label>
                <select
                  className="input select"
                  style={{ inlineSize: "auto" }}
                  id="order"
                  onChange={(e) => handleSort(e.target.value)}
                >
                  {filterOptions.map(({ label, value }) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
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
