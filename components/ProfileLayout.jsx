export default function ProfileLayout({ avatar, name, location, logout }) {
  return (
    <div className="label-wrapper">
      {avatar ? <img src={avatar} alt={name} width={200} height={200} /> : null}
      <h1>{name}</h1>
      <h2>{location}</h2>
      <button type="button" onClick={logout}>
        logout
      </button>
    </div>
  )
}
