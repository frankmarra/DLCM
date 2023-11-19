import { prependProtocol } from "@/utils/utils"
import { useEffect, useState, useReducer } from "react"
import InputReducer from "../InputReducer/InputReducer"

export default function InputSocialSites({
  sites,
  dispatch,
  hasProAccount,
  showPersonal,
  labelArtist,
}) {
  // const initialSitesValue = {
  //   personalUrl: sites?.personal ?? null,
  //   bandcampUrl: sites?.bandcamp ?? null,
  //   appleMusicUrl: sites?.apple ?? null,
  //   spotifyUrl: sites?.spotify ?? null,
  //   soundcloudUrl: sites?.soundcloud ?? null,
  //   youtubeUrl: sites?.youtube ?? null,
  // }
  // const [sitesValue, dispatch] = useReducer(InputReducer, initialSitesValue)
  // const [personalUrl, setPersonalUrl] = useState(sites?.personal ?? null)
  // const [bandcampUrl, setBandcampUrl] = useState(sites?.bandcamp ?? null)
  // const [appleMusicUrl, setAppleMusicUrl] = useState(sites?.apple ?? null)
  // const [spotifyUrl, setSpotifyUrl] = useState(sites?.spotify ?? null)
  // const [soundcloudUrl, setSoundcloudUrl] = useState(sites?.soundcloud ?? null)
  // const [youtubeUrl, setYoutubeUrl] = useState(sites?.youtube ?? null)

  // useEffect(() => {
  //   setSites({
  //     personal: personalUrl ? prependProtocol(personalUrl) : null,
  //     bandcamp: bandcampUrl ? prependProtocol(bandcampUrl) : null,
  //     apple: appleMusicUrl ? prependProtocol(appleMusicUrl) : null,
  //     spotify: spotifyUrl ? prependProtocol(spotifyUrl) : null,
  //     soundcloud: soundcloudUrl ? prependProtocol(soundcloudUrl) : null,
  //     youtube: youtubeUrl ? prependProtocol(youtubeUrl) : null,
  //   })
  // }, [
  //   bandcampUrl,
  //   appleMusicUrl,
  //   spotifyUrl,
  //   soundcloudUrl,
  //   youtubeUrl,
  //   personalUrl,
  // ])
  return (
    <>
      {showPersonal ? (
        <>
          <label className="label" htmlFor="personal">
            {labelArtist} site{" "}
            <span>
              <small>(This makes your logo a link)</small>
            </span>
          </label>
          <input
            className="input"
            id="personal"
            type="url"
            value={sites?.personal ?? null}
            onChange={(e) =>
              dispatch({
                type: "object-input",
                object: "sites",
                objectVariables: sites,
                name: "personal",
                value: e.target.value,
              })
            }
          />
        </>
      ) : null}
      <label className="label" htmlFor="bandcamp">
        Bandcamp Link
      </label>
      <input
        className="input"
        id="bandcamp"
        type="url"
        value={sites?.bandcamp ?? null}
        required
        onChange={(e) =>
          dispatch({
            type: "object-input",
            object: "sites",
            objectVariables: sites,
            name: "bandcamp",
            value: e.target.value,
          })
        }
      />
      {hasProAccount ? (
        <>
          <label className="label" htmlFor="apple">
            Apple Music Link
          </label>
          <input
            className="input"
            id="apple"
            type="url"
            value={sites?.apple ?? null}
            onChange={(e) =>
              dispatch({
                type: "object-input",
                name: "apple",
                object: "sites",
                objectVariables: sites,
                value: e.target.value,
              })
            }
          />

          <label className="label" htmlFor="spotify">
            Spotify Link
          </label>
          <input
            className="input"
            id="spotify"
            type="url"
            value={sites?.spotify ?? null}
            onChange={(e) =>
              dispatch({
                type: "object-input",
                object: "sites",
                objectVariables: sites,
                name: "spotify",
                value: e.target.value,
              })
            }
          />
          <label className="label" htmlFor="soundcloud">
            Soundcloud Link
          </label>
          <input
            className="input"
            id="soundcloud"
            type="url"
            value={sites?.soundcloud ?? null}
            onChange={(e) =>
              dispatch({
                type: "object-input",
                name: "soundcloud",
                object: "sites",
                objectVariables: sites,
                value: e.target.value,
              })
            }
          />
          <label className="label" htmlFor="youtube">
            YouTube Link
          </label>
          <input
            className="input"
            id="youtube"
            type="url"
            value={sites?.youtube ?? null}
            onChange={(e) =>
              dispatch({
                type: "object-input",
                name: "youtube",
                object: "sites",
                objectVariables: sites,
                value: e.target.value,
              })
            }
          />
        </>
      ) : null}
    </>
  )
}
