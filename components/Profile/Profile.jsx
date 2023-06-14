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
          {sites.bandcamp ? (
            <a href={`${sites.bandcamp}`}>
              <FontAwesomeIcon icon={faBandcamp} />
            </a>
          ) : null}
          {sites.apple ? (
            <a href={`${sites.apple}`}>
              <FontAwesomeIcon icon={faApple} />
            </a>
          ) : null}
          {sites.spotify ? (
            <a href={`${sites.spotify}`}>
              <FontAwesomeIcon icon={faSpotify} />
            </a>
          ) : null}
          {sites.soundcloud ? (
            <a href={`${sites.soundcloud}`}>
              <FontAwesomeIcon icon={faSoundcloud} />
            </a>
          ) : null}
          {sites.youtube ? (
            <a href={`${sites.youtube}`}>
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          ) : null}
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
