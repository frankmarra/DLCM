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

    ascending: false,
    sortBy: "created_at",
  },
  {
    label: "Release Date (newest)",
    value: "release date (newest)",

    ascending: false,
    sortBy: "release_date",
  },
  {
    label: "Release Date (oldest)",
    value: "release date (oldest)",

    ascending: true,
    sortBy: "release_date",
  },
  {
    label: "Release (a - z)",
    value: "release (a - z)",

    ascending: true,
    sortBy: "title",
  },
  {
    label: "Release (z - a)",
    value: "release (z - a)",

    ascending: false,
    sortBy: "title",
  },
  {
    label: "Artist (a - z)",
    value: "artist (a - z)",

    ascending: true,
    sortBy: "artist",
  },
  {
    label: "Artist (z - a)",
    value: "artist (z - a)",

    ascending: false,
    sortBy: "artist",
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
    // let sortedItems = [...releases].sort(selected.method)

    // if (selected.direction === "desc") {
    //   sortedItems.reverse()
    // }

    setSelected(value)
    onChange(selected)
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
