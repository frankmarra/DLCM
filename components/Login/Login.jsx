import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"

export default function Login() {
  const supabase = useSupabaseClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setEmail("")
      setPassword("")
      alert(error.message)
    }
  }

  return (
    <article
      className="container stack inline-max center-stage"
      style={{ "--max-inline-size": "400px" }}
    >
      <h2>Log In</h2>

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
          Log In
        </button>
      </form>

      <h2>
        Not a member? <Link href="/signup">Sign up!</Link>
      </h2>
      <Link href="/request-password-reset">Forgot Password?</Link>
    </article>
  )
}
