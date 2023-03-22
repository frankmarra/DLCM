import { supabase } from "@/utils/supabase"
import { useState } from "react"
import Link from "next/link"

const accountTypes = [
  { id: 1, text: "Label" },
  { id: 2, text: "Artist" },
  { id: 3, text: "Choose account type", isDisabled: true },
]

const Signup = () => {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    type: accountTypes[2].text,
    name: "",
    avatar: "",
    location: "",
  })
  const [userCreated, setUserCreated] = useState(false)

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    let slugger = newUser.name.toLowerCase()
    e.preventDefault()
    let { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: {
        data: {
          type: newUser.type,
          username: newUser.name,
          avatar_url: newUser.avatar,
          location: newUser.location,
          slug: slugger
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-"),
        },
      },
    })

    if (data) {
      const response = await fetch("/api/create-customer", {
        method: "POST",
        body: JSON.stringify({ email: data.user.email, uid: data.user.id }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    if (error) {
      return <p>Something went wrong, try again later</p>
    } else {
      setUserCreated(true)
    }
  }
  return (
    <div className="signup form-container">
      {userCreated ? (
        <div className="user-created">
          <h1>New User Created</h1>
          <p>
            Thank you for signing up! Please sign in to continue creating your
            profile.
          </p>
          <Link href="/">Sign In</Link>
        </div>
      ) : (
        <div className="create-user">
          <h1>Create User</h1>
          <form className="create-user-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="email">Email</label>
              <input
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
                onChange={handleChange}
                id="password"
                type="password"
                value={newUser.password}
                required
              />
              <p>Password must be at least six characters long</p>
            </div>
            <div className="input-wrapper">
              <label htmlFor="passwordCheck">Re-enter password</label>
              <input
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
                onChange={handleChange}
                id="type"
                value={newUser.type}
                required
              >
                {accountTypes.map((accountType) => (
                  <option
                    key={accountType.id}
                    value={accountType.text}
                    disabled={accountType.isDisabled}
                  >
                    {accountType.text}
                  </option>
                ))}
              </select>
            </div>
            {newUser.type === accountTypes[2].text ? null : newUser.type ===
              "Label" ? (
              <>
                <div className="input-wrapper">
                  <label htmlFor="name">Label Name</label>
                  <input
                    onChange={handleChange}
                    id="name"
                    type="text"
                    value={newUser.name}
                    required
                  />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="name">Label avatar</label>
                  <input
                    onChange={handleChange}
                    id="avatar"
                    type="text"
                    value={newUser.avatar_url}
                  />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="location">Label location</label>
                  <input
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
                  <label htmlFor="name">Artist Name</label>
                  <input
                    onChange={handleChange}
                    id="name"
                    type="text"
                    value={newUser.name}
                    required
                  />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="name">Artist avatar</label>
                  <input
                    onChange={handleChange}
                    id="avatar"
                    type="text"
                    value={newUser.avatar_url}
                  />
                </div>
                <div className="input-wrapper">
                  <label htmlFor="location">Artist location</label>
                  <input
                    onChange={handleChange}
                    id="location"
                    type="text"
                    value={newUser.location}
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="btn primary"
              disabled={
                !newUser.email ||
                !newUser.password ||
                newUser.password.length < 6 ||
                newUser.password != newUser.passwordCheck ||
                !newUser.name ||
                newUser.type === accountTypes[2].text
              }
            >
              Sign Up
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Signup
