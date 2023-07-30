import { useState, useEffect } from "react"

export default function ReleaseSort({ releases, onChange }) {
  const [sortBy, setSortBy] = useState("newest")
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

  const handleSort = () => {
    const selected = sortOptions.find((option) => option.value == sortBy)
    let sortedItems

    sortedItems = [...releases].sort(selected.method)

    if (selected.direction === "desc") {
      sortedItems.reverse()
    }

    onChange(sortedItems)
  }
  useEffect(() => {
    setSortBy("newest")
  }, [releases])

  useEffect(() => {
    handleSort()
  }, [sortBy])

  return (
    <div>
      <label className="label" htmlFor="sort">
        Sort
      </label>
      <select
        id="sort"
        className="input select"
        onChange={(e) => setSortBy(e.target.value)}
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
