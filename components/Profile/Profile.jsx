import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"
import SocialSites from "../SocialSites/SocialSites"
import { useState } from "react"

export default function ProfileLayout({
  avatar,
  name,
  location,
  releases,
  profileSlug,
  sites,
}) {
  const [artwork, setArtwork] = useState(avatar)
  return (
    <div className="label-wrapper">
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
      <h1>{name}</h1>
      <h2>{location}</h2>
      <SocialSites sites={sites} />
      <ul className="grid" role="list">
        {releases.map((release) =>
          release.is_active ? (
            <ReleaseCard
              key={release.id}
              release={release}
              profileSlug={profileSlug}
            />
          ) : null
        )}
      </ul>
    </div>
  )
}
