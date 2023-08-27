import { useState } from "react"
import { useUser } from "@supabase/auth-helpers-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import styles from "./LoginForm.module.css"
import { useRouter } from "next/router"

export default function LoginForm() {
  const supabase = createClientComponentClient()
  const user = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (user) {
    router.push("/")
  }

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
    } else {
      router.push("/")
    }
  }

  return (
    <article
      className="stack inline-max center-stage"
      style={{ "--max-inline-size": "45ch" }}
    >
      <h1>Log in</h1>
      <form className="container stack" onSubmit={handleSubmit}>
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

        <div className={styles.password}>
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
          <p className={styles.forgotPassword}>
            <Link href="/request-password-reset">Forgot password?</Link>
          </p>
        </div>

        <button
          className="button"
          data-variant="primary"
          type="submit"
          disabled={!email || !password}
        >
          Log In
        </button>
      </form>

      <p>
        Not a member yet? <Link href="/signup">Sign up!</Link>
      </p>
    </article>
  )
}
