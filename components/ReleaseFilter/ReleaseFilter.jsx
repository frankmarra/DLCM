import { useEffect, useState } from "react"

export default function ReleaseFilter({ releases, onChange }) {
  const [artistList, setArtistList] = useState([])

  useEffect(() => {
    let artists = []
    releases.forEach((release) => {
      if (!artists.some(({ value }) => value === release.artist)) {
        artists.push({ value: release.artist, label: release.artist })
      }
    })

    const sortedArtists = artists.sort((a, b) =>
      a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1
    )

    setArtistList(sortedArtists)
  }, [releases])

  const handleFilter = (value) => {
    if (value == "all") {
      onChange(releases)
    } else {
      let selectedArtistReleases = []
      releases.forEach((release) => {
        if (release.artist == value) {
          selectedArtistReleases.push(release)
        }
      })
      onChange(selectedArtistReleases)
    }
  }

  if (artistList.length <= 1) {
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
        {artistList.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
