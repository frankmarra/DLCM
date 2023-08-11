import { useState, useEffect, forwardRef } from "react"
import ReleaseFilter from "../ReleaseFilter/ReleaseFilter"
import ReleaseSort from "../ReleaseSort/ReleaseSort"

function ReleaseRefinement(
  { isVisible, onRefinement, releases, isDashboard },
  ref
) {
  const [filtered, setFiltered] = useState(releases)
  const [sorted, setSorted] = useState(filtered)

  useEffect(() => {
    setSorted(filtered)
  }, [filtered])

  useEffect(() => {
    onRefinement(sorted)
  }, [sorted])

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
      <ReleaseSort
        releases={filtered}
        onChange={setSorted}
        isDashboard={isDashboard}
      />
    </div>
  )
}

export default forwardRef(ReleaseRefinement)
