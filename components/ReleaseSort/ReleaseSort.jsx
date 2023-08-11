import { useState, useEffect } from "react"

const sortByCreatedAt = (a, b) => (a.created_at > b.created_at ? 1 : -1)
const sortByReleaseDate = (a, b) => (a.release_date > b.release_date ? 1 : -1)
const sortByTitle = (a, b) => (a.title > b.title ? 1 : -1)
const sortByArtist = (a, b) =>
  a.artist.toLowerCase() > b.artist.toLowerCase() ? 1 : -1

const sortDashboardOptions = [
  {
    label: "Newest First",
    value: "newest",
    method: sortByCreatedAt,
    direction: "desc",
  },
  {
    label: "Oldest First",
    value: "oldest",
    method: sortByCreatedAt,
    direction: "asc",
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
    label: "A to Z (release)",
    value: "a-z (release)",
    method: sortByTitle,
    direction: "asc",
  },
  {
    label: "Z to A (release)",
    value: "z-a (release)",
    method: sortByTitle,
    direction: "desc",
  },
  {
    label: "A to Z (artist)",
    value: "a-z (artist)",
    method: sortByArtist,
    direction: "asc",
  },
  {
    label: "Z to A (artist)",
    value: "z-a (artist)",
    method: sortByArtist,
    direction: "desc",
  },
]

const sortProfileOptions = [
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
    label: "A to Z (release)",
    value: "a-z (release)",
    method: sortByTitle,
    direction: "asc",
  },
  {
    label: "Z to A (release)",
    value: "z-a (release)",
    method: sortByTitle,
    direction: "desc",
  },
  {
    label: "A to Z (artist)",
    value: "a-z (artist)",
    method: sortByArtist,
    direction: "asc",
  },
  {
    label: "Z to A (artist)",
    value: "z-a (artist)",
    method: sortByArtist,
    direction: "desc",
  },
]

export default function ReleaseSort({ releases, onChange, isDashboard }) {
  const [selected, setSelected] = useState(
    isDashboard ? "newest" : "release date (newest)"
  )

  const handleChange = (e) => {
    const value = e.target.value
    const selected = sortDashboardOptions.find(
      (option) => option.value === value
    )
    let sortedItems = [...releases].sort(selected.method)

    if (selected.direction === "desc") {
      sortedItems.reverse()
    }

    setSelected(value)
    onChange(sortedItems)
  }

  useEffect(() => {
    setSelected(isDashboard ? "newest" : "release date (newest)")
  }, [releases])

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
        {isDashboard
          ? sortDashboardOptions.map(({ label, value }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))
          : sortProfileOptions.map(({ label, value }) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
      </select>
    </div>
  )
}
