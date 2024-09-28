import PopoverTip from "../PopoverTip/PopoverTip"

export default function InputAudioPlayerEmbed({ playerEmbed, onChange }) {
  function stripEmbed(embedToStrip) {
    let albumRegex = /album=(\d+)/
    let trackRegex = /track=(\d+)/

    let albumMatch = embedToStrip.match(albumRegex)
    let trackMatch = embedToStrip.match(trackRegex)

    if (albumMatch && trackMatch) {
      // Both 'album=' and 'track=' are present
      let strippedEmbed = `album=${albumMatch[1]}, track=${trackMatch[1]}`
      return strippedEmbed
    } else if (albumMatch) {
      // Only 'album=' is present
      return `album=${albumMatch[1]}`
    } else if (trackMatch) {
      // Only 'track=' is present
      return `track=${trackMatch[1]}`
    } else if (embedToStrip === "") {
      return ""
    } else {
      return "Not a valid embed"
    }
  }

  return (
    <>
      <div className="input-wrapper">
        <div className="cluster">
          <label className="label" htmlFor="playerEmbed">
            Bandcamp audio player embed
          </label>
          <PopoverTip
            message={`Paste a bandcamp HTML embed here. We set what the player will look like for aesthetic consistency.`}
          />
        </div>
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
