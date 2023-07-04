import { supabase } from "@/utils/supabase"
import { useState, useEffect } from "react"
import Link from "next/link"
import slugify from "slugify"
import { useRouter } from "next/router"
import PopoverTip from "@/components/PopoverTip/PopoverTip"
import Head from "next/head"

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
  const [emailsTaken, setEmailsTaken] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState({
    color: "transparent",
    message: "",
  })
  const [passwordGood, setPasswordGood] = useState(false)
  const [sluggedName, setSluggedName] = useState("")
  const [noGo, setNoGO] = useState(true)
  const [firstSlugCheck, setFirstSlugCheck] = useState(false)
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
        setPasswordGood(true)
      } else if (newUser.password != newUser.passwordCheck) {
        setPasswordMessage({ color: "red", message: "Passwords don't match!" })
        setPasswordGood(false)
      }
    }
  }

  const checkName = async (e) => {
    e.preventDefault()

    if (firstSlugCheck == false) {
      setFirstSlugCheck(true)
    }

    if (sluggedName.length > 0) {
      setSluggedName(slugify(sluggedName))
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", sluggedName)

      if (data.length > 0) {
        setNamesTaken({ color: "red", message: "This URL is already in use" })
        setNoGO(true)
      } else if (data.length == 0) {
        setNamesTaken({
          color: "green",
          message: "This url is available, snag it!",
        })
        setNoGO(false)
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
          slug: sluggedName,
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
      setPasswordGood(false)
      alert(error.message)
    } else {
      setUserCreated(true)
    }
  }

  return (
    <>
      <Head>
        <title>Sign up to DLCM</title>
        <meta property="og:title" content="Sign up to DLCM" key="title" />
        <meta
          property="og:description"
          content="Sign up to start using DLCM"
          key="description"
        />
      </Head>

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
                  onBlur={newUser.passwordCheck ? checkPassword : null}
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
                  disabled={newUser.password.length < 6}
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
                      onInput={
                        firstSlugCheck
                          ? null
                          : (e) =>
                              setSluggedName(
                                slugify(e.target.value, { lower: true })
                              )
                      }
                      onBlur={firstSlugCheck ? null : checkName}
                      required
                    />
                  </div>

                  <div className="input-wrapper">
                    <label htmlFor="slug">Label slug</label>
                    <PopoverTip
                      message={`Your public label URL. You won't be able to change this again unless you subscribe to the pro plan.`}
                    />
                    <input
                      className="input"
                      onChange={(e) => setSluggedName(e.target.value)}
                      id="slug"
                      type="text"
                      value={
                        sluggedName
                          ? slugify(sluggedName, { lower: true, trim: false })
                          : sluggedName
                      }
                      onInput={
                        firstSlugCheck
                          ? null
                          : (e) =>
                              setSluggedName(
                                slugify(e.target.value, { lower: true })
                              )
                      }
                      onBlur={checkName}
                    />
                  </div>
                  <small>
                    Public label URL will be: {process.env.NEXT_PUBLIC_DLCM_URL}
                    {`${sluggedName}`}
                  </small>
                  <br />
                  <small style={{ color: `${namesTaken.color}` }}>
                    {namesTaken.message}
                  </small>
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
                      onInput={
                        firstSlugCheck
                          ? null
                          : (e) =>
                              setSluggedName(
                                slugify(e.target.value, { lower: true })
                              )
                      }
                      onBlur={firstSlugCheck ? null : checkName}
                      required
                    />
                  </div>

                  <div className="input-wrapper">
                    <label htmlFor="slug">Artist slug</label>
                    <PopoverTip
                      message={`Your public artist URL. You won't be able to change this again unless you subscribe to the pro plan.`}
                    />
                    <input
                      className="input"
                      onChange={(e) => setSluggedName(e.target.value)}
                      id="slug"
                      type="text"
                      value={
                        sluggedName
                          ? slugify(sluggedName, { lower: true, trim: false })
                          : sluggedName
                      }
                      onBlur={checkName}
                      required
                    />
                  </div>
                  <small>
                    Public artist URL will be:{" "}
                    {process.env.NEXT_PUBLIC_DLCM_URL}
                    {`${sluggedName}`}
                  </small>
                  <br />
                  <small style={{ color: `${namesTaken.color}` }}>
                    {namesTaken.message}
                  </small>
                </>
              )}

              <div className="button-actions inline-wrap">
                <button
                  type="submit"
                  className="button"
                  data-variant="primary"
                  disabled={noGo || emailsTaken || !passwordGood}
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
    </>
  )
}

export default Signup
