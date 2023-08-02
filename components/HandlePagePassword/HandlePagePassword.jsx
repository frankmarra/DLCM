import { useState } from "react"

export default function HandlePagePassword({ setAuthorized, pagePassword }) {
  const [password, setPassword] = useState()
  const [showError, setShowError] = useState(false)

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (pagePassword === password) {
      setAuthorized(true)
    } else {
      setPassword("")
      setShowError(true)
    }
  }

  return (
    <>
      <form
        className="container inline-max stack"
        style={{
          "--max-inline-size": "45ch",
        }}
        onSubmit={handlePasswordSubmit}
      >
        <label htmlFor="password">Enter page password</label>

        <input
          className="input"
          id="password"
          type="password"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" data-variant="primary" type="submit">
          Submit
        </button>
        {showError ? <p>Incorrect password. Try Again.</p> : null}
      </form>
    </>
  )
}
