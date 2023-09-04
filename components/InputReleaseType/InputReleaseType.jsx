const releaseTypes = [
  { id: 0, text: "Choose release type", isDisabled: true, isSelected: true },
  { id: 1, text: "LP" },
  { id: 2, text: "EP" },
  { id: 3, text: "Single" },
  { id: 4, text: "Sample Pack" },
  { id: 5, text: "Compilation" },
  { id: 6, text: "Soundtrack" },
  { id: 7, text: "Mixtape" },
  { id: 8, text: "Remix" },
  { id: 9, text: "Demo" },
]

export default function InputReleaseType({ type, onChange }) {
  return (
    <>
      <label className="label" htmlFor="type">
        Type
      </label>
      <select
        className="input select"
        onChange={(e) => onChange(e.target.value)}
        id="type"
        value={type}
        required
      >
        {releaseTypes.map((type) => (
          <option
            key={type.id}
            value={type.value}
            disabled={type.isDisabled}
            selected={type.isSelected}
          >
            {type.text}
          </option>
        ))}
      </select>
      <small>*required</small>
    </>
  )
}
