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

  const sanitizedAbout = sanitize(release.about)
  const embeds = release.player_embed.split(",")

  useEffect(() => {
    setIsClient(true)
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

          {embeds?.length > 0 &&
            embeds[0] !== "Not a valid embed" &&
            embeds[0] !== "" && (
              <section>
                <iframe
                  style={{ border: 0, width: "100%", height: "120px" }}
                  src={`https://bandcamp.com/EmbeddedPlayer/${
                    embeds[0]
                  }/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=small/${
                    embeds.length > 1 ? embeds[1] : ""
                  }/transparent=true/`}
                  seamless
                ></iframe>
                <a href=""></a>
              </section>
            )}

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
