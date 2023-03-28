import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"

export default function ProfileLayout({
  avatar,
  name,
  location,
  releases,
  slug,
}) {
  return (
    <div className="label-wrapper">
      {avatar ? <img src={avatar} alt={name} width={200} height={200} /> : null}
      <h1>{name}</h1>
      <h2>{location}</h2>
      <ul className="stack" role="list">
        {releases.map((release) =>
          release.codes.length > 0 && release.is_active ? (
            <ReleaseCard key={release.id} release={release} />
          ) : null
        )}
      </ul>
    </div>
  )
}
