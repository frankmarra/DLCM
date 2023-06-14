import ReleaseCard from "@/components/Releases/ReleaseCard"
import styles from "./Profile.module.css"
import cn from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faApple,
  faSpotify,
  faBandcamp,
  faYoutube,
  faSoundcloud,
} from "@fortawesome/free-brands-svg-icons"

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
      <div className="social-sites">
        <ul>
          {sites.bandcamp ? <FontAwesomeIcon icon={faBandcamp} /> : null}
          {sites.apple ? <FontAwesomeIcon icon={faApple} /> : null}
          {sites.spotify ? <FontAwesomeIcon icon={faSpotify} /> : null}
          {sites.soundcloud ? <FontAwesomeIcon icon={faSoundcloud} /> : null}
          {sites.youtube ? <FontAwesomeIcon icon={faYoutube} /> : null}
        </ul>
      </div>
      <ul className="stack" role="list">
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
