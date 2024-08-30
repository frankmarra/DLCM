import PopoverTip from "../PopoverTip/PopoverTip"

export default function InputAudioPlayerEmbed({ playerEmbed, onChange }) {
  function stripEmbed(embedToStrip) {
    let albumRegex = /album=(\d+)/
    let trackRegex = /track=(\d+)/

    if (embedToStrip.includes("album")) {
      let match = embedToStrip.match(albumRegex)
      let strippedEmbed = match[1]

      return "album=" + strippedEmbed
    } else if (embedToStrip.includes("track")) {
      let match = embedToStrip.match(trackRegex)
      let strippedEmbed = match[1]

      return "track=" + strippedEmbed
    } else if (embedToStrip == "") {
      return ""
    } else {
      return "Not a valid embed"
    }
  }

  return (
    <>
      <div className="input-wrapper">
        <label className="label" htmlFor="playerEmbed">
          Bandcamp audio player embed
        </label>
        <PopoverTip
          message={`Paste a bandcamp HTML embed here. We set what the player will look like for aesthetic consistency.`}
        />
        <input
          className="input"
          id="playerEmbed"
          type="text"
          value={playerEmbed}
          onChange={(e) =>
            onChange({
              type: "change",
              name: e.target.id,
              value: stripEmbed(e.target.value),
            })
          }
        />
        <small>
          {"We will automatically format the embed when you paste it here."}
        </small>
      </div>
    </>
  )
}
