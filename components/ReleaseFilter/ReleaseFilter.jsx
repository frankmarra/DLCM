const sortByName = (a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1)

export default function ReleaseFilter({ releases, artistNames, onChange }) {
  const artists = [
    ...new Map(artistNames.map(({ artist }) => [artist, artist])).values(),
  ].sort(sortByName)

  // const handleFilter = (value) => {
  //   if (value == "all") {
  //     onChange(releases)
  //   } else {
  //     onChange(releases.filter(({ artist }) => artist === value))
  //   }
  // }

  const handleFilter = (value) => {
    onChange(value)
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
        className="input select truncate"
        style={{ maxInlineSize: "300px" }}
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
