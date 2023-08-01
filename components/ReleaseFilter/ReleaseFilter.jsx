const sortByName = (a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1)

export default function ReleaseFilter({ releases, onChange }) {
  const artists = [
    ...new Map(releases.map(({ artist }) => [artist, artist])).values(),
  ].sort(sortByName)

  const handleFilter = (value) => {
    if (value == "all") {
      onChange(releases)
    } else {
      onChange(releases.filter(({ artist }) => artist === value))
    }
  }

  if (artists.length <= 1) {
    return
  }

  return (
    <div>
      <label className="label" htmlFor="filter">
        Filter by artist
      </label>
      <select
        id="filter"
        className="input select"
        onChange={(e) => handleFilter(e.target.value)}
      >
        <option value="all" key="all">
          All Artists
        </option>
        {artists.map((artist) => (
          <option value={artist} key={artist}>
            {artist}
          </option>
        ))}
      </select>
    </div>
  )
}
