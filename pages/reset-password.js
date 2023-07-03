import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

export default function ResetPassword() {
  const supabase = useSupabaseClient()
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordCheck, setNewPasswordCheck] = useState("")
  const [passwordUpdated, setPasswordUpdated] = useState(false)
  const user = useUser()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (!error) {
        setPasswordUpdated(true)
        await supabase.auth.signOut()
      }
    } catch (error) {
      throw error
    }
  }

  if (!user && !passwordUpdated) {
    return <p>You are not permitted to do this.</p>
  }

  return passwordUpdated ? (
    <div className="password-updated">
      <h1>Password Updated</h1>
      <p>Please log in to access your dashboard.</p>
      <Link href="/">Log In</Link>
    </div>
  ) : (
    <div
      className="container stack inline-max center-stage"
      style={{ "--max-inline-size": "400px" }}
    >
      <h1>Reset Password</h1>

      <form className="stack" onSubmit={handleSubmit}>
        <label className="label" htmlFor="password">
          New Password
        </label>
        <input
          onChange={(e) => setNewPassword(e.target.value)}
          className="input"
          id="password"
          type="password"
          value={newPassword}
          required
        />

        <label className="label" htmlFor="passwordcheck">
          Verify New Password
        </label>
        <input
          onChange={(e) => setNewPasswordCheck(e.target.value)}
          className="input"
          id="passwordcheck"
          type="password"
          value={newPasswordCheck}
          required
        />
        <button
          className="button"
          data-variant="primary"
          type="submit"
          disabled={newPassword != newPasswordCheck || newPassword.length < 8}
        >
          Reset Password
        </button>
      </form>
    </div>
  )
}
