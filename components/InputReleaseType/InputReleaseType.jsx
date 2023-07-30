export default function InputReleaseType({ type, setType }) {
  const releaseTypes = [
    { id: 0, text: "Choose release type", isDisabled: true, isSelected: true },
    { id: 1, text: "LP" },
    { id: 2, text: "EP" },
    { id: 3, text: "Single" },
    { id: 4, text: "Compilation" },
    { id: 5, text: "Soundtrack" },
  ]

  return (
    <>
      <label className="label" htmlFor="type">
        Type
      </label>
      <select
        className="input select"
        onChange={(e) => setType(e.target.value)}
        id="type"
        value={type}
        required
      >
        {releaseTypes.map((releaseType) => (
          <option
            key={releaseType.id}
            value={releaseType.value}
            disabled={releaseType.isDisabled}
            selected={releaseType.isSelected}
          >
            {releaseType.text}
          </option>
        ))}
      </select>
    </>
  )
}
