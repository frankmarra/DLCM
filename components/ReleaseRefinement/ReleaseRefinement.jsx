import { useRef, useState, useEffect } from "react"
import ReleaseFilter from "../ReleaseFilter/ReleaseFilter"
import ReleaseSort from "../ReleaseSort/ReleaseSort"

export default function ReleaseRefinement({
  isVisible,
  onRefinement,
  releases,
}) {
  const filtersRef = useRef(null)
  const [filtered, setFiltered] = useState(releases)
  const [sorted, setSorted] = useState(filtered)

  useEffect(() => {
    onRefinement(sorted)
  }, [filtered, sorted])

  if (!isVisible) {
    return
  }

  return (
    <div
      ref={filtersRef}
      className="cluster"
      style={{ "--cluster-gap": "var(--size-3)" }}
    >
      <ReleaseFilter releases={releases} onChange={setFiltered} />
      <ReleaseSort releases={filtered} onChange={setSorted} />
    </div>
  )
}
