import { useState, useEffect, forwardRef } from "react"
import ReleaseFilter from "../ReleaseFilter/ReleaseFilter"
import ReleaseSort from "../ReleaseSort/ReleaseSort"

function ReleaseRefinement(
  { isVisible, onRefinement, releases, artists, isDashboard },
  ref
) {
  const [filtered, setFiltered] = useState("all")
  const [sortType, setSortType] = useState({
    sortBy: "created_at",
    ascending: true,
  })

  // useEffect(() => {
  //   setSorted(filtered)
  // }, [filtered])

  useEffect(() => {
    onRefinement(sortType, filtered)
  }, [sortType, filtered])

  if (!isVisible) {
    return
  }

  return (
    <div
      ref={ref}
      className="cluster"
      style={{ "--cluster-gap": "var(--size-3)" }}
    >
      <ReleaseFilter
        artistNames={artists}
        releases={releases}
        onChange={setFiltered}
      />
      <ReleaseSort onChange={setSortType} />
    </div>
  )
}

export default forwardRef(ReleaseRefinement)
