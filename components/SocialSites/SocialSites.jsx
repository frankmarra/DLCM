import styles from "./SocialSites.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSpotify,
  faBandcamp,
  faYoutube,
  faSoundcloud,
  faItunesNote,
} from "@fortawesome/free-brands-svg-icons"

export default function SocialSites({ sites, isSubscribed, isDlcmFriend }) {
  let showSites = false

  Object.values(sites).forEach((site) => {
    if (site) {
      showSites = true
    }
  })

  //change icon size (xs, s, null, lg, xl, 2xl, #x)

  let iconSize = "xl"

  return showSites ? (
    <>
      <div className={styles.sites}>
        <p>Listen</p>
        <ul>
          {isSubscribed || isDlcmFriend ? (
            <>
              {sites.bandcamp ? (
                <li className="bandcamp">
                  <a href={`${sites.bandcamp}`}>
                    <span className="visually-hidden">
                      Visit profile on Bandcamp
                    </span>
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
                    <span className="visually-hidden">
                      Listen on Apple Music
                    </span>
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
                    <span className="visually-hidden">Listen on Spotify</span>
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
                    <span className="visually-hidden">
                      Listen on Soundcloud
                    </span>
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
                    <span className="visually-hidden">Watch on YouTube</span>
                    <FontAwesomeIcon
                      icon={faYoutube}
                      size={iconSize}
                      color="#FE0100"
                    />
                  </a>
                </li>
              ) : null}
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>
      </div>
    </>
  ) : null
}
