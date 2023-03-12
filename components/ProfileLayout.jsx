export default function ProfileLayout({ avatar, name, location }) {
  return (
    <div className="label-wrapper">
      {avatar ? <img src={avatar} alt={name} width={200} height={200} /> : null}
      <h1>{name}</h1>
      <h2>{location}</h2>
    </div>
  )
}
