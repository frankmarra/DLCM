import { prependProtocol } from "@/utils/utils"

export default function InputSocialSites({
  sites,
  onChange,
  hasProAccount,
  showPersonal,
  labelArtist,
}) {
  const handleChange = (e) => {
    onChange({
      type: "object-change",
      object: "sites",
      objectVariables: sites,
      name: e.target.id,
      value: e.target.value,
    })
  }

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
            value={sites?.personal ?? ""}
            onChange={handleChange}
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
        value={sites?.bandcamp ?? ""}
        required
        onChange={handleChange}
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
            value={sites?.apple ?? ""}
            onChange={handleChange}
          />

          <label className="label" htmlFor="spotify">
            Spotify Link
          </label>
          <input
            className="input"
            id="spotify"
            type="url"
            value={sites?.spotify ?? ""}
            onChange={handleChange}
          />
          <label className="label" htmlFor="soundcloud">
            Soundcloud Link
          </label>
          <input
            className="input"
            id="soundcloud"
            type="url"
            value={sites?.soundcloud ?? ""}
            onChange={handleChange}
          />
          <label className="label" htmlFor="youtube">
            YouTube Link
          </label>
          <input
            className="input"
            id="youtube"
            type="url"
            value={sites?.youtube ?? ""}
            onChange={handleChange}
          />
          <label className="label" htmlFor="facebook">
            Facebook Link
          </label>
          <input
            className="input"
            id="facebook"
            type="url"
            value={sites?.facebook ?? ""}
            onChange={handleChange}
          />
          <label className="label" htmlFor="instagram">
            Instagram Link
          </label>
          <input
            className="input"
            id="instagram"
            type="url"
            value={sites?.instagram ?? ""}
            onChange={handleChange}
          />
          <label className="label" htmlFor="tiktok">
            TikTok Link
          </label>
          <input
            className="input"
            id="tiktok"
            type="url"
            value={sites?.tiktok ?? ""}
            onChange={handleChange}
          />
          <label className="label" htmlFor="twitter">
            X (Twitter) Link
          </label>
          <input
            className="input"
            id="twitter"
            type="url"
            value={sites?.twitter ?? ""}
            onChange={handleChange}
          />
        </>
      ) : null}
    </>
  )
}
