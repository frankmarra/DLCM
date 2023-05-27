import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"

export default function Login() {
  const supabase = useSupabaseClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    const { error } = supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    }
  }

  return (
    <article
      className="container stack inline-max center-stage"
      style={{ "--max-inline-size": "400px" }}
    >
      <h2>Sign In</h2>

      <form className="stack" onSubmit={handleSubmit}>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          id="email"
          type="email"
          value={email}
          required
        />

        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          id="password"
          type="password"
          value={password}
          required
        />

        <button
          className="button"
          data-variant="primary"
          type="submit"
          disabled={!email || !password}
        >
          Sign In
        </button>
      </form>

      <p>
        Not a member? <Link href="/signup">Sign up!</Link>
      </p>
    </article>
  )
}
