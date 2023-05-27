import { supabase } from "@/utils/supabase"
import { useState } from "react"
import Link from "next/link"
import slugify from "slugify"
import { useRouter } from "next/router"

const accountTypes = [
  { value: "", label: "Choose account type", disabled: true },
  { value: "label", label: "Label", disabled: false },
  { value: "artist", label: "Artist", disabled: false },
]

const Signup = () => {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    type: accountTypes[0].value,
    name: "",
    location: "",
  })
  const [userCreated, setUserCreated] = useState(false)
  const router = useRouter()
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: {
        data: {
          type: newUser.type,
          username: newUser.name,
          location: newUser.location,
          slug: slugify(newUser.name, { lower: true }),
        },
      },
    })

    if (data && !error) {
      const response = await fetch("/api/create-customer", {
        method: "POST",
        body: JSON.stringify({ email: data.user.email, uid: data.user.id }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    if (error) {
      setNewUser({
        email: "",
        password: "",
        passwordCheck: "",
        type: accountTypes[0].value,
        name: "",
        location: "",
      })
      alert(error.message)
    } else {
      setUserCreated(true)
    }
  }
  return (
    <article
      className="container stack inline-max center-stage"
      style={{ "--max-inline-size": "400px" }}
    >
      {userCreated ? (
        <div className="user-created">
          <h1>New User Created</h1>
          <p>
            Thank you for signing up! Please sign in to access your dashboard.
          </p>
          <Link href="/">Sign In</Link>
        </div>
      ) : (
        <div>
          <h1>Create User</h1>
          <form className="stack" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="email">Email</label>
              <input
                className="input"
                onChange={handleChange}
                id="email"
                type="email"
                value={newUser.email}
                required
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                className="input"
                onChange={handleChange}
                id="password"
                type="password"
                value={newUser.password}
                required
              />
              <small>Password must be at least six characters long</small>
            </div>
            <div className="input-wrapper">
              <label htmlFor="passwordCheck">Re-enter password</label>
              <input
                className="input"
                onChange={handleChange}
                id="passwordCheck"
                type="password"
                value={newUser.passwordCheck}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="type">Account type</label>
              <select
                className="input"
                onChange={handleChange}
                id="type"
                value={newUser.type}
                required
              >
                {accountTypes.map((accountType) => (
                  <option
                    key={accountType.value}
                    value={accountType.value}
                    disabled={accountType.disabled}
                  >
                    {accountType.label}
                  </option>
                ))}
              </select>
            </div>
            {newUser.type === accountTypes[0].value ? null : newUser.type ===
              "label" ? (
              <>
                <div className="input-wrapper">
                  <label htmlFor="name">Label name</label>
                  <input
                    className="input"
                    onChange={handleChange}
                    id="name"
                    type="text"
                    value={newUser.name}
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <label htmlFor="location">Label location</label>
                  <input
                    className="input"
                    onChange={handleChange}
                    id="location"
                    type="text"
                    value={newUser.location}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="input-wrapper">
                  <label htmlFor="name">Artist name</label>
                  <input
                    className="input"
                    onChange={handleChange}
                    id="name"
                    type="text"
                    value={newUser.name}
                    required
                  />
                </div>

                <div className="input-wrapper">
                  <label htmlFor="location">Artist location</label>
                  <input
                    className="input"
                    onChange={handleChange}
                    id="location"
                    type="text"
                    value={newUser.location}
                  />
                </div>
              </>
            )}
            <div class="button-actions inline-wrap">
              <button
                type="submit"
                className="button"
                data-variant="primary"
                disabled={
                  !newUser.email ||
                  !newUser.password ||
                  newUser.password.length < 6 ||
                  newUser.password != newUser.passwordCheck ||
                  !newUser.name ||
                  newUser.type === accountTypes[0].value
                }
              >
                Sign Up
              </button>
              <button
                type="button"
                className="button"
                data-variant="secondary"
                onClick={() => router.push("/")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  )
}

export default Signup
