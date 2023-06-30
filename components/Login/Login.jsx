import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"
import styles from "./Login.module.css"
import cn from "classnames"

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
    <>
      <div className={styles.hero}>
        <h1>DLCM</h1>
        <h2>All of the Codes, Managed.</h2>
      </div>
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

        <h3>
          Not a member? <Link href="/signup">Sign up!</Link>
        </h3>
        <Link href="/request-password-reset">Forgot Password?</Link>
      </article>

      <section className={cn(styles.about, "stack inline-max")}>
        <p>DLCM is the definitive solution for managing your download codes.</p>

        <p>
          Your listeners can generate a code at their own convenience and have
          confidence that it will work.
        </p>

        <p> No more wondering what&apos;s already been used!</p>
      </section>

      <section className={cn(styles.subscription, "stack")}>
        <h2>Subscribe to DLCM</h2>
        <div className={styles.plans}>
          <section className={cn(styles.free, "container")}>
            <h2>Free Plan</h2>
            <div className="perks">
              <ul role="list">
                <li>Two Releases</li>
                <li>Unlimited Codes</li>
              </ul>
            </div>
          </section>

          <section className={cn(styles.pro, "container")}>
            <h2>Pro Plan</h2>
            <div className={styles.cost}>
              <p>$5/mth</p>
            </div>
            <div className="perks">
              <ul role="list">
                <li>Unlimited Releases</li>
                <li>Custom URLs</li>
                <li>Password Protected Public & Release Pages</li>
                <li>Turn Releases On/Off</li>
                <li>Bandcamp CSV Code Upload</li>
                <li>Social Site Links</li>
              </ul>
            </div>
          </section>
        </div>

        <div className={cn(styles.subscribe, "button")} data-variant="primary">
          <Link href="/signup">Create an account to subscribe</Link>
        </div>
      </section>
    </>
  )
}
