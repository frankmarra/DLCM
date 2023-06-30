import styles from "./SocialSites.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSpotify,
  faBandcamp,
  faYoutube,
  faSoundcloud,
  faItunesNote,
} from "@fortawesome/free-brands-svg-icons"

export default function SocialSites({ sites }) {
  let showSites = false
  let iconSize
  Object.values(sites).forEach((site) => {
    if (site) {
      showSites = true
    }
  })
  const vw = Math.max(window.innerWidth || 0)

  //change icon size (xs, s, null, lg, xl, 2xl, #x)
  if (vw < 480) {
    iconSize = "xl"
  } else {
    iconSize = "2x"
  }

  return showSites ? (
    <>
      <div className={styles.sites}>
        <h3>Listen</h3>
        <ul>
          {sites.bandcamp ? (
            <li className="bandcamp">
              <a href={`${sites.bandcamp}`}>
                <FontAwesomeIcon
                  icon={faBandcamp}
                  size={iconSize}
                  color="#3B98AA"
                />
              </a>
            </li>
          ) : null}
          {sites.apple ? (
            <li className="apple">
              <a href={`${sites.apple}`}>
                <FontAwesomeIcon
                  icon={faItunesNote}
                  size={iconSize}
                  color="#FF354D"
                />
              </a>
            </li>
          ) : null}
          {sites.spotify ? (
            <li className="spotify">
              <a href={`${sites.spotify}`}>
                <FontAwesomeIcon
                  icon={faSpotify}
                  size={iconSize}
                  color="#1DD461"
                />
              </a>
            </li>
          ) : null}
          {sites.soundcloud ? (
            <li className="soundcloud">
              <a href={`${sites.soundcloud}`}>
                <FontAwesomeIcon
                  icon={faSoundcloud}
                  size={iconSize}
                  color="#FE8A23"
                />
              </a>
            </li>
          ) : null}
          {sites.youtube ? (
            <li className="youtube">
              <a href={`${sites.youtube}`}>
                <FontAwesomeIcon
                  icon={faYoutube}
                  size={iconSize}
                  color="#FE0100"
                />
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </>
  ) : null
}
