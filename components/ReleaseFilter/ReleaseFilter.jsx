import styles from "./ReleaseFilter.module.css"

export default function ReleaseFilter({
  releases,
  setFilteredReleases,
  artistList,
}) {
  const handleFilter = (value) => {
    if (value == "all") {
      setFilteredReleases(releases)
    } else {
      let selectedArtistReleases = []
      releases.forEach((release) => {
        if (release.artist == value) {
          selectedArtistReleases.push(release)
        }
      })
      setFilteredReleases(selectedArtistReleases)
    }
  }

  return (
    <div className={styles.filter}>
      <label className="label" htmlFor="filter">
        Filter by artist
      </label>
      <select
        className="input select"
        style={{ inlineSize: "auto" }}
        id="filter"
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
