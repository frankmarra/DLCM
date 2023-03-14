export default function ReleaseLayout({
  title,
  artist,
  label,
  artwork_url,
  download_url,
  type,
}) {
  return (
    <div
      className="stack max-inline"
      style={{ "--max-inline-size": "var(--input-screen-max-inline-size" }}
    >
      {artwork_url ? (
        <img src={artwork_url} alt={title} height={250} width={250} />
      ) : null}
      <h1>{title}</h1>
      <h2>{artist}</h2>
      <h3>{label}</h3>
      <h4>{type}</h4>
    </div>
  )
}
