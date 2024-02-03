import { useState, useEffect, forwardRef } from "react"
import ReleaseFilter from "../ReleaseFilter/ReleaseFilter"
import ReleaseSort from "../ReleaseSort/ReleaseSort"

function ReleaseRefinement(
  { isVisible, onRefinement, releases, isDashboard },
  ref
) {
  const [filtered, setFiltered] = useState(releases)
  const [sortType, setSortType] = useState()

  // useEffect(() => {
  //   setSorted(filtered)
  // }, [filtered])

  useEffect(() => {
    onRefinement(sortType)
  }, [sortType])

  if (!isVisible) {
    return
  }

  return (
    <div
      ref={ref}
      className="cluster"
      style={{ "--cluster-gap": "var(--size-3)" }}
    >
      <ReleaseFilter releases={releases} onChange={setFiltered} />
      <ReleaseSort onChange={setSortType} />
    </div>
  )
}

export default forwardRef(ReleaseRefinement)
