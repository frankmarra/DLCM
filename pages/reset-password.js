import { useUser } from "@supabase/auth-helpers-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Head from "next/head"
import SEO from "@/components/SEO/SEO"

export default function ResetPassword() {
  const supabase = createClientComponentClient()
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordCheck, setNewPasswordCheck] = useState("")
  const [passwordUpdated, setPasswordUpdated] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState({
    color: "transparent",
    message: "",
  })
  const [passwordGood, setPasswordGood] = useState(false)
  const user = useUser()
  const router = useRouter()

  const checkPassword = () => {
    if (newPassword.length > 0) {
      if (newPassword === newPasswordCheck) {
        setPasswordMessage({ color: "green", message: "Passwords match!" })
        setPasswordGood(true)
      } else if (newPassword != newPasswordCheck) {
        setPasswordMessage({ color: "red", message: "Passwords don't match!" })
        setPasswordGood(false)
      }
    }
  }

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

  return (
    <>
      <SEO title="Reset password"></SEO>
      {passwordUpdated ? (
        <div
          className=" container stack inline-max center-stage password-updated"
          style={{ "--max-inline-size": "400px" }}
        >
          <h1>Password Updated</h1>
          <p>Please log in to access your dashboard.</p>
          <Link href="/login">Log In</Link>
        </div>
      ) : (
        <div
          className="stack inline-max center-stage"
          style={{ "--max-inline-size": "45ch" }}
        >
          <h1 className="text-3">Update Password</h1>

          <form className="container stack" onSubmit={handleSubmit}>
            <div>
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
              <small>
                Password must be at least <strong>6</strong> characters long
              </small>
            </div>
            <div>
              <label className="label" htmlFor="passwordcheck">
                Verify New Password
              </label>
              <input
                onChange={(e) => setNewPasswordCheck(e.target.value)}
                className="input"
                id="passwordcheck"
                type="password"
                value={newPasswordCheck}
                onFocus={() =>
                  setPasswordMessage({ color: "transparent", message: "" })
                }
                disabled={newPassword.length < 6}
                onBlur={checkPassword}
                required
              />
              {
                <small
                  style={{ color: `${passwordMessage.color}` }}
                >{`${passwordMessage.message}`}</small>
              }
            </div>
            <button
              className="button"
              data-variant="primary"
              type="submit"
              disabled={!passwordGood}
            >
              Reset Password
            </button>
          </form>
        </div>
      )}
    </>
  )
}
