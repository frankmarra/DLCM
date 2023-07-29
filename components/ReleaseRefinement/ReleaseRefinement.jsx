import { useRef, useState, useEffect } from "react"
import ReleaseFilter from "../ReleaseFilter/ReleaseFilter"
import ReleaseSort from "../ReleaseSort/ReleaseSort"
import styles from "./ReleaseRefinement.module.css"

export default function ReleaseRefinement({
  isVisible,
  onRefinement,
  releases,
}) {
  const filtersRef = useRef(null)
  const [filtered, setFiltered] = useState(releases)
  const [sorted, setSorted] = useState(filtered)
  // const [artistList, setArtistList] = useState([])

  // useEffect(() => {
  //   let artists = []
  //   releases.forEach((release) => {
  //     if (!artists.some(({ value }) => value === release.artist)) {
  //       artists.push({ value: release.artist, label: release.artist })
  //     }
  //   })

  //   const sortedArtists = artists.sort((a, b) =>
  //     a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1
  //   )

  //   setArtistList(sortedArtists)
  // }, [releases])

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
      style={{ "--cluster-justify": "space-between" }}
    >
      <ReleaseFilter releases={releases} onChange={setFiltered} />

      <ReleaseSort releases={filtered} onChange={setSorted} />
    </div>
  )
}
