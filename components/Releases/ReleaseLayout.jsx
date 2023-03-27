import CodeGenerator from "../CodeGenerator/CodeGenerator"

export default function ReleaseLayout({ release }) {
  return (
    <div
      className="stack inline-max"
      style={{ "--max-inline-size": "var(--input-screen-inline-max-size" }}
    >
      {release.artwork_url ? (
        <img
          src={release.artwork_url}
          alt={release.title}
          height={250}
          width={250}
        />
      ) : null}
      <h1>{release.title}</h1>
      <h2>{release.artist}</h2>
      <h3>{release.label}</h3>
      <h4>{release.type}</h4>

      <CodeGenerator releaseId={release.id} />
    </div>
  )
}
