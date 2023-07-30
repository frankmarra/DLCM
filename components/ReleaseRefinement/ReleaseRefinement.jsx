import { useState, useEffect, forwardRef } from "react"
import ReleaseFilter from "../ReleaseFilter/ReleaseFilter"
import ReleaseSort from "../ReleaseSort/ReleaseSort"

function ReleaseRefinement({ isVisible, onRefinement, releases }, ref) {
  const [filtered, setFiltered] = useState(releases)
  const [sorted, setSorted] = useState(filtered)

  useEffect(() => {
    onRefinement(sorted)
  }, [filtered, sorted, onRefinement])

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
      <ReleaseSort releases={filtered} onChange={setSorted} />
    </div>
  )
}

export default forwardRef(ReleaseRefinement)