import styles from "./ReleaseSort.module.css"
import { useState, useEffect } from "react"
import React from "react"

export default function ReleaseSort({ filteredReleases, setSortedReleases }) {
  const [sortBy, setSortBy] = useState("oldest")
  const sortByCreatedAt = (a, b) => (a.created_at > b.created_at ? 1 : -1)
  const sortByTitle = (a, b) => (a.title > b.title ? 1 : -1)

  const sortOptions = [
    {
      label: "Oldest First",
      value: "oldest",
      method: sortByCreatedAt,
      direction: "asc",
    },
    {
      label: "Newest First",
      value: "newest",
      method: sortByCreatedAt,
      direction: "desc",
    },
    { label: "A to Z", value: "a-z", method: sortByTitle, direction: "asc" },
    { label: "Z to A", value: "z-a", method: sortByTitle, direction: "desc" },
  ]

  useEffect(() => {
    handleSort()
  }, [sortBy, filteredReleases])

  const handleSort = () => {
    const selected = sortOptions.find((option) => option.value === sortBy)
    let sortedItems

    sortedItems = [...filteredReleases].sort(selected.method)

    if (selected.direction === "desc") {
      sortedItems.reverse()
    }

    setSortedReleases(sortedItems)
  }

  return (
    <div className={styles.filter}>
      <label className="label" htmlFor="order">
        Order
      </label>
      <select
        className="input select"
        style={{ inlineSize: "auto" }}
        id="order"
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
