import { useState, useEffect } from "react"
import CodeGenerator from "../CodeGenerator/CodeGenerator"
import SocialSites from "../SocialSites/SocialSites"
import styles from "./ReleaseLayout.module.css"
import cn from "classnames"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import InputPagePassword from "../InputPagePassword/InputPagePassword"
import SEO from "../SEO/SEO"
import { sanitize } from "isomorphic-dompurify"

export default function ReleaseLayout({
  release,
  isSubscribed,
  isDlcmFriend,
  profileYumLink,
  userType,
  userSlug,
}) {
  const [authorized, setAuthorized] = useState(!release.is_password_protected)
  const [releaseDate, setReleaseDate] = useState(new Date(release.release_date))
  const [isClient, setIsClient] = useState(false)
  const [albumCode, setAlbumCode] = useState()
  const sanitizedAbout = sanitize(release.about)

  useEffect(() => {
    setIsClient(true)

    if (release.player_embed) {
      let embedArray = release.player_embed.split("/")
      let code = embedArray[4].slice(6)
      setAlbumCode(code)
    }
  }, [])

  return (
    <>
      <SEO
        title={`${release.title} by ${release.artist}`}
        description={`Get a download code for ${release.title}`}
      ></SEO>

      {isClient ? (
        <div className={cn(styles.wrapper, "stack inline-max")}>
          <Image
            className={styles.artwork}
            src={release.artwork_url || "/default-image-release.png"}
            alt={release.title}
            height={250}
            width={250}
          />
          {albumCode ? (
            <section>
              <iframe
                style={{ border: 0, width: 100 + "%", height: 120 + "px" }}
                src={`https://bandcamp.com/EmbeddedPlayer/album=${albumCode}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/transparent=true/`}
                seamless
              >
                <a href=""></a>
              </iframe>
            </section>
          ) : null}
          <div>
            <h1 className={styles.title}>{release.title}</h1>
            {userType == "artist" ? (
              <Link href={`/${userSlug}`} className={styles.artist}>
                {release.artist}
              </Link>
            ) : (
              <p className={styles.artist}>{release.artist}</p>
            )}
            {userType == "label" ? (
              <Link href={`/${userSlug}`} className={styles.label}>
                {release.label}
              </Link>
            ) : (
              <p className={styles.label}>{release.label}</p>
            )}
            <p>
              {release.type == "Choose release type" ? null : release.type}{" "}
              {release.release_date ? `  — ${releaseDate.getFullYear()}` : null}
            </p>
          </div>
          {!authorized ? (
            <InputPagePassword
              setAuthorized={setAuthorized}
              pagePassword={release.page_password}
              label="Enter password to generate Bandcamp code"
            />
          ) : (
            <div className={styles.codes}>
              <CodeGenerator
                release={release}
                profileYumLink={profileYumLink}
              />
            </div>
          )}
          <SocialSites
            sites={release.sites}
            isSubscribed={isSubscribed}
            isDlcmFriend={isDlcmFriend}
          />
          {sanitizedAbout && authorized ? (
            <section
              className={styles.about}
              dangerouslySetInnerHTML={{ __html: sanitizedAbout }}
            />
          ) : null}
        </div>
      ) : null}
    </>
  )
}
