import { useState, useEffect } from "react"

const sortByCreatedAt = (a, b) => (a.created_at > b.created_at ? 1 : -1)
const sortByReleaseDate = (a, b) => (a.release_date > b.release_date ? 1 : -1)
const sortByTitle = (a, b) => (a.title > b.title ? 1 : -1)
const sortByArtist = (a, b) =>
  a.artist.toLowerCase() > b.artist.toLowerCase() ? 1 : -1

const sortOptions = [
  {
    label: "Recently Added",
    value: "newest",
    method: sortByCreatedAt,
    direction: "desc",
  },
  {
    label: "Release Date (newest)",
    value: "release date (newest)",
    method: sortByReleaseDate,
    direction: "desc",
  },
  {
    label: "Release Date (oldest)",
    value: "release date (oldest)",
    method: sortByReleaseDate,
    direction: "asc",
  },
  {
    label: "Release (a - z)",
    value: "release (a - z)",
    method: sortByTitle,
    direction: "asc",
  },
  {
    label: "Release (z - a)",
    value: "release (z - a)",
    method: sortByTitle,
    direction: "desc",
  },
  {
    label: "Artist (a - z)",
    value: "artist (a - z)",
    method: sortByArtist,
    direction: "asc",
  },
  {
    label: "Artist (z - a)",
    value: "artist (z - a)",
    method: sortByArtist,
    direction: "desc",
  },
]

// const sortDashboardOptions = [
//   {
//     label: "Recently Added",
//     value: "newest",
//     method: sortByCreatedAt,
//     direction: "desc",
//   },
//   {
//     label: "Oldest First",
//     value: "oldest",
//     method: sortByCreatedAt,
//     direction: "asc",
//   },
//   ...sortProfileOptions,
// ]

export default function ReleaseSort({ releases, onChange, isDashboard }) {
  const [selected, setSelected] = useState("newest")

  const handleChange = (e) => {
    const value = e.target.value
    const selected = sortOptions.find((option) => option.value === value)
    let sortedItems = [...releases].sort(selected.method)

    if (selected.direction === "desc") {
      sortedItems.reverse()
    }

    setSelected(value)
    onChange(sortedItems)
  }

  // useEffect(() => {
  //   setSelected(isDashboard ? "newest" : "release date (newest)")
  // }, [releases])

  return (
    <div>
      <label className="label" htmlFor="sort">
        Sort
      </label>
      <select
        id="sort"
        className="input select"
        value={selected}
        onChange={handleChange}
      >
        {sortOptions.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
