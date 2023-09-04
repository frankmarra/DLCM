import { useState, useEffect } from "react"
import CodeGenerator from "../CodeGenerator/CodeGenerator"
import SocialSites from "../SocialSites/SocialSites"
import styles from "./ReleaseLayout.module.css"
import cn from "classnames"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
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

  const sanitizedAbout = sanitize(release.about)
  const sanitizedEmbed = sanitize(release.player_embed)

  return (
    <>
      <SEO
        title={`${release.title} by ${release.artist}`}
        description={`Get a download code for ${release.title}`}
      ></SEO>
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
        {sanitizedEmbed ? (
          <Script
            id="bandcampEmbed"
            strategy="afterInteractive"
            // className={styles.embed}
            dangerouslySetInnerHTML={{ __html: sanitizedEmbed }}
          />
        ) : null}

        {!authorized ? (
          <InputPagePassword
            setAuthorized={setAuthorized}
            pagePassword={release.page_password}
            label="Enter password to generate code"
          />
        ) : (
          <div className={styles.codes}>
            <CodeGenerator release={release} profileYumLink={profileYumLink} />
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
    </>
  )
}
