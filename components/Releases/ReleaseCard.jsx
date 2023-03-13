import styles from "./ReleaseCard.module.css"

export default function ReleaseCard({
  title,
  artist,
  label,
  type,
  artwork_url,
  size,
}) {
  return (
    <div className="container">
      {artwork_url ? (
        <img
          className={styles.image}
          src={artwork_url}
          alt=""
          height={size}
          width={size}
        />
      ) : (
        <div style={{ height: size, width: size }} />
      )}
      <h3>{title}</h3>
      <h4>{artist}</h4>
      <h5>{label}</h5>
      <h6>{type}</h6>
    </div>
  )
}
