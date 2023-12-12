import { prependProtocol } from "@/utils/utils"

export default function InputSocialSites({
  sites,
  onChange,
  hasProAccount,
  showPersonal,
  labelArtist,
}) {
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
              onChange({
                type: "object-change",
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
          onChange({
            type: "object-change",
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
              onChange({
                type: "object-change",
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
              onChange({
                type: "object-change",
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
              onChange({
                type: "object-change",
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
              onChange({
                type: "object-change",
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
