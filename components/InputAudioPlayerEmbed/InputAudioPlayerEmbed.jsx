import PopoverTip from "../PopoverTip/PopoverTip"

export default function InputAudioPlayerEmbed({ playerEmbed, onChange }) {
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
              value: e.target.value,
            })
          }
        />
      </div>
    </>
  )
}
