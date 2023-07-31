import { useState, useEffect } from "react"

const sortByCreatedAt = (a, b) => (a.created_at > b.created_at ? 1 : -1)
const sortByTitle = (a, b) => (a.title > b.title ? 1 : -1)
const sortByArtist = (a, b) =>
  a.artist.toLowerCase() > b.artist.toLowerCase() ? 1 : -1

const sortOptions = [
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

export default function ReleaseSort({ releases, onChange }) {
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

  useEffect(() => {
    setSelected("newest")
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
        {sortOptions.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
