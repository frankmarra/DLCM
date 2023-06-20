import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"

export default function RequestPasswordReset() {
  const supabase = useSupabaseClient()
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    let { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://unrivaled-pie-1255ea.netlify.app/reset-password",
    })

    if (error) {
      setEmail("")
      alert(error.message)
    } else {
      setEmailSent(true)
    }
  }
  return emailSent ? (
    <div className="password-updated">
      <h1>Reset Password Email Sent</h1>
      <p>
        Please check your email for a link to reset your password. It is
        possible that the email is in your spam folder. It will be from
        noreply@mail.app.supabase.io
      </p>
    </div>
  ) : (
    <article
      className="container stack inline-max center-stage"
      style={{ "--max-inline-size": "400px" }}
    >
      <h2>Reset Password</h2>

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
  )
}
