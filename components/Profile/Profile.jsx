import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"
import SocialSites from "../SocialSites/SocialSites"

export default function ProfileLayout({
  avatar,
  name,
  location,
  releases,
  profileSlug,
  sites,
}) {
  return (
    <div className="label-wrapper">
      {avatar ? <img src={avatar} alt={name} width={200} height={200} /> : null}
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
