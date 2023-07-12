import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Head from "next/head"

export default function ResetPassword() {
  const supabase = useSupabaseClient()
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
      <Head>
        <title>{"Update your password"}</title>
        <meta property="og:title" content="Update your password" key="title" />
        <meta
          property="og:description"
          content="Update your DLCM user password"
          key="description"
        />
      </Head>
      {passwordUpdated ? (
        <div
          className=" container stack inline-max center-stage password-updated"
          style={{ "--max-inline-size": "400px" }}
        >
          <h1>Password Updated</h1>
          <p>Please log in to access your dashboard.</p>
          <Link href="/">Log In</Link>
        </div>
      ) : (
        <div
          className="container stack inline-max center-stage"
          style={{ "--max-inline-size": "400px" }}
        >
          <h1>Update Password</h1>

          <form className="stack" onSubmit={handleSubmit}>
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
              <small>Password must be at least six characters long</small>
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
