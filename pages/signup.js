import { supabase } from "@/utils/supabase"
import { useState } from "react"
import Link from "next/link"
import slugify from "slugify"
import { useRouter } from "next/router"
import Script from "next/script"

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
  const [createdUser, setCreatedUser] = useState()
  const [namesTaken, setNamesTaken] = useState({
    color: "transparent",
    message: "",
  })
  const [emailsTaken, setEmailsTaken] = useState()
  const [passwordMessage, setPasswordMessage] = useState({
    color: "transparent",
    message: "",
  })
  const router = useRouter()

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.id]: e.target.value })
  }

  const checkEmail = async (e) => {
    e.preventDefault()
    if (newUser.email.length > 0) {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", newUser.email)

      if (data.length > 0) {
        setEmailsTaken(true)
      } else if (data.length == 0) {
        setEmailsTaken(false)
      }

      if (error) throw error
    }
  }

  const checkPassword = () => {
    if (newUser.password.length > 0) {
      if (newUser.password === newUser.passwordCheck) {
        setPasswordMessage({ color: "green", message: "Passwords match!" })
      } else if (newUser.password != newUser.passwordCheck) {
        setPasswordMessage({ color: "red", message: "Passwords don't match!" })
      }
    }
  }

  const checkName = async (e) => {
    if (newUser.name.length > 0) {
      e.preventDefault()
      let sluggedName = slugify(newUser.name, { lower: true })

      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", sluggedName)

      if (data.length > 0) {
        setNamesTaken({ color: "red", message: "Names taken, try again" })
      } else if (data.length == 0) {
        setNamesTaken({
          color: "green",
          message: "This name is available, snag it!",
        })
      }

      if (error) throw error
    }
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
      setCreatedUser(data.user)
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
          <br />
          {createdUser.user_metadata.type == "artist" ? (
            <p>
              An artist account has been made for{" "}
              {`${createdUser.user_metadata.username}`}
            </p>
          ) : (
            <p>
              A label account has been made for{" "}
              {`${createdUser.user_metadata.username}`}
            </p>
          )}
          <br />
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
                onFocus={() => setEmailsTaken(null)}
                onBlur={checkEmail}
                required
              />
            </div>
            {emailsTaken ? (
              <small style={{ color: "red" }}>
                Account for this email already exists
              </small>
            ) : null}

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
                onFocus={() =>
                  setPasswordMessage({ color: "transparent", message: "" })
                }
                onBlur={checkPassword}
                required
              />
              {
                <small
                  style={{ color: `${passwordMessage.color}` }}
                >{`${passwordMessage.message}`}</small>
              }
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
                    onFocus={() =>
                      setNamesTaken({ color: "transparent", message: "" })
                    }
                    onBlur={checkName}
                    required
                  />
                </div>

                <small style={{ color: `${namesTaken.color}` }}>
                  {namesTaken.message}
                </small>

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
                    onFocus={() =>
                      setNamesTaken({ color: "transparent", message: "" })
                    }
                    onBlur={checkName}
                    required
                  />
                </div>
                <small style={{ color: `${namesTaken.color}` }}>
                  {namesTaken.message}
                </small>

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
            <div className="button-actions inline-wrap">
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
