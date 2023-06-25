export default function Subscribe() {
  return (
    <article
      className="container stack inline-max center-stage"
      style={{ "--max-inline-size": "400px" }}
    >
      <h1>Subscribe to DLCM</h1>
      <div
        className="container"
        style={{
          textAlign: "center",
          fontSize: 40,
          fontWeight: 600,
          paddingBlock: 75,
        }}
      >
        $5
      </div>
      <div className="perks">
        <ul role="list">
          <li>Unlimited Releases</li>
          <li>Custom URLs</li>
          <li>Password Protect Releases & Public Profile</li>
          <li>Turn Releases On/Off</li>
          <li>Bandcamp CSV Code Upload</li>
          <li>Social Site Links</li>
        </ul>
      </div>
    </article>
  )
}
