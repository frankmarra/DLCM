import { prependProtocol } from "@/utils/utils"
import { useEffect, useState } from "react"

export default function InputSocialSites({
  sites,
  setSites,
  isSubscribed,
  isDlcmFriend,
}) {
  const [bandcampUrl, setBandcampUrl] = useState(sites?.bandcamp ?? null)
  const [appleMusicUrl, setAppleMusicUrl] = useState(sites?.apple ?? null)
  const [spotifyUrl, setSpotifyUrl] = useState(sites?.spotify ?? null)
  const [soundcloudUrl, setSoundcloudUrl] = useState(sites?.soundcloud ?? null)
  const [youtubeUrl, setYoutubeUrl] = useState(sites?.youtube ?? null)

  useEffect(() => {
    setSites({
      bandcamp: bandcampUrl ? prependProtocol(bandcampUrl) : null,
      apple: appleMusicUrl ? prependProtocol(appleMusicUrl) : null,
      spotify: spotifyUrl ? prependProtocol(spotifyUrl) : null,
      soundcloud: soundcloudUrl ? prependProtocol(soundcloudUrl) : null,
      youtube: youtubeUrl ? prependProtocol(youtubeUrl) : null,
    })
  }, [bandcampUrl, appleMusicUrl, spotifyUrl, soundcloudUrl, youtubeUrl])
  return (
    <>
      <label className="label" htmlFor="bandcamp">
        Bandcamp Link
      </label>
      <input
        className="input"
        id="bandcamp"
        type="url"
        value={bandcampUrl}
        required
        onChange={(e) => setBandcampUrl(e.target.value)}
      />
      {isSubscribed || isDlcmFriend ? (
        <>
          <label className="label" htmlFor="apple">
            Apple Music Link
          </label>
          <input
            className="input"
            id="apple"
            type="url"
            value={appleMusicUrl}
            onChange={(e) => setAppleMusicUrl(e.target.value)}
          />

          <label className="label" htmlFor="spotify">
            Spotify Link
          </label>
          <input
            className="input"
            id="spotify"
            type="url"
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
          />
          <label className="label" htmlFor="soundcloud">
            Soundcloud Link
          </label>
          <input
            className="input"
            id="soundcloud"
            type="url"
            value={soundcloudUrl}
            onChange={(e) => setSoundcloudUrl(e.target.value)}
          />
          <label className="label" htmlFor="youtube">
            YouTube Link
          </label>
          <input
            className="input"
            id="youtube"
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        </>
      ) : null}
    </>
  )
}
