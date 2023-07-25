import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"
import Head from "next/head"

export default function RequestPasswordReset() {
  const supabase = useSupabaseClient()
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    let { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://dlcm.app/reset-password",
    })

    if (error) {
      setEmail("")
      alert(error.message)
    } else {
      setEmailSent(true)
    }
  }
  return (
    <>
      <Head>
        <title>{"Password reset"}</title>
        <meta
          property="og:title"
          content="Request a password reset"
          key="title"
        />
        <meta
          property="og:description"
          content="Request a password reset for your DLCM account"
          key="description"
        />
      </Head>
      {emailSent ? (
        <div className="password-updated">
          <h1>Reset Password Email Sent</h1>
          <p>
            Please check your email for a link from dlcm.app to reset your
            password. Make sure to check your spam if you don&apos;t see it.
          </p>
        </div>
      ) : (
        <article
          className="stack inline-max center-stage"
          style={{ "--max-inline-size": "400px" }}
        >
          <h2>Reset Password</h2>

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
            <button
              className="button"
              data-variant="primary"
              type="submit"
              disabled={!email}
            >
              Reset Password
            </button>
          </form>
        </article>
      )}
    </>
  )
}
