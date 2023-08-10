import { useState, useEffect } from "react"
import CodeGenerator from "../CodeGenerator/CodeGenerator"
import SocialSites from "../SocialSites/SocialSites"
import styles from "./ReleaseLayout.module.css"
import cn from "classnames"
import Head from "next/head"
import Image from "next/image"
import HandlePagePassword from "../HandlePagePassword/HandlePagePassword"
import SEO from "../SEO/SEO"

export default function ReleaseLayout({
  release,
  isSubscribed,
  isDlcmFriend,
  profileYumLink,
}) {
  const [authorized, setAuthorized] = useState(!release.is_password_protected)

  return (
    <>
      <SEO
        title={release.title}
        description={`Download code page for ${release.title}`}
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
        <HandlePagePassword
          setAuthorized={setAuthorized}
          pagePassword={release.page_password}
        />
      ) : (
        <div className={styles.codes}>
          <CodeGenerator release={release} profileYumLink={profileYumLink} />
        </div>
      )}
    </>
  )
}
