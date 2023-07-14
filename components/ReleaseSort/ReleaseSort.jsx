import styles from "./ReleaseSort.module.css"

export default function ReleaseSort({ releases, setSortedReleases }) {
  const sortByCreatedAt = (a, b) => (a.created_at > b.created_at ? 1 : -1)
  const sortByTitle = (a, b) => (a.title > b.title ? 1 : -1)

  const filterOptions = [
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

  const handleSort = (value) => {
    const selected = filterOptions.find((option) => option.value === value)
    let sortedItems

    sortedItems = [...releases].sort(selected.method)

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
        onChange={(e) => handleSort(e.target.value)}
      >
        {filterOptions.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
