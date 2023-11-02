import { supabase } from "@/utils/supabase"
import { useReducer, useState } from "react"
import slugify from "slugify"
import { useRouter } from "next/router"
import PopoverTip from "@/components/PopoverTip/PopoverTip"
import Head from "next/head"
import SEO from "@/components/SEO/SEO"
import InputReducer from "@/components/InputReducer/InputReducer"
import Loader from "@/components/Loader/Loader"

const accountTypes = [
  { value: "", label: "Choose account type", disabled: true },
  { value: "label", label: "Label", disabled: false },
  { value: "artist", label: "Artist", disabled: false },
]

const Signup = () => {
  const [formValue, dispatch] = useReducer(InputReducer, {
    email: "",
    sluggedName: "",
    password: "",
    passwordCheck: "",
    type: accountTypes[0].value,
    name: "",
    location: "",
    submitting: false,
    success: false,
    error: null,
  })

  const { name, sluggedName, email, password, passwordCheck, type, location } =
    formValue

  // const [userCreated, setUserCreated] = useState(false)
  // const [createdUser, setCreatedUser] = useState()
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
  // const [sluggedName, setSluggedName] = useState("")
  const [noGo, setNoGO] = useState(true)
  const [firstSlugCheck, setFirstSlugCheck] = useState(false)
  const router = useRouter()

  // const handleChange = (e) => {
  //   setFormValue({ ...formValue, [e.target.id]: e.target.value })
  // }

  const checkEmail = async (e) => {
    e.preventDefault()
    if (formValue.email.length > 0) {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", formValue.email)

      if (data.length > 0) {
        setEmailsTaken(true)
      } else if (data.length == 0) {
        setEmailsTaken(false)
      }

      if (error) throw error
    }
  }

  const checkPassword = () => {
    if (formValue.password.length > 0) {
      if (formValue.password === formValue.passwordCheck) {
        setPasswordMessage({ color: "green", message: "Passwords match!" })
        setPasswordGood(true)
      } else if (formValue.password != formValue.passwordCheck) {
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
    if (sluggedName.length == 0) {
      setNamesTaken({ color: "red", message: "User must have a slug" })
      setNoGO(true)
    }
    if (sluggedName.length > 0) {
      // setSluggedName(slugify(sluggedName))
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

    dispatch({ type: "submit" })
    try {
      //Create dlcm user
      let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            type: type,
            username: name,
            location: location,
            slug: sluggedName,
          },
        },
      })
      //Create Stripe customer
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
        dispatch({ type: "error", error: error.message })
        setPasswordGood(false)
        alert(error.message)
      } else {
        dispatch({ type: "success" })
      }
    } catch (error) {
      dispatch({ type: "error", error: error.message })
    }
  }

  if (formValue.submitting) {
    return <Loader style={{ margin: "auto" }} />
  }

  return (
    <>
      <SEO
        title="Create account"
        description="Create a new account and get started with DLCM, the definitive solution for download code management."
      ></SEO>
      <article
        className="stack inline-max center-stage"
        style={{ "--max-inline-size": "45ch" }}
      >
        {formValue.success ? (
          <div className="user-created">
            <h1>New User Created</h1>
            <br />

            <p>
              {`A(n) ${type} account has been made for
                ${name}`}
            </p>

            <br />
            <p>
              Thank you for signing up! Please verify your email address to
              finish the signup process. Make sure to check your spam if you do
              not see the email in your inbox.
            </p>
          </div>
        ) : (
          <div className="stack">
            <h1 className="text-4">Create account</h1>
            <p>Fill in the following details to get started.</p>
            <form className="stack container" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <label htmlFor="email">Email</label>
                <input
                  className="input"
                  onChange={(e) =>
                    dispatch({
                      type: "input",
                      name: "email",
                      value: e.target.value,
                    })
                  }
                  id="email"
                  type="email"
                  value={email}
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
                  onChange={(e) =>
                    dispatch({
                      type: "input",
                      name: "password",
                      value: e.target.value,
                    })
                  }
                  id="password"
                  type="password"
                  value={password}
                  onBlur={passwordCheck ? checkPassword : null}
                  required
                />
                <small>
                  Password must be at least <strong>6</strong> characters long.
                </small>
              </div>
              <div className="input-wrapper">
                <label htmlFor="passwordCheck">Re-enter password</label>
                <input
                  className="input"
                  onChange={(e) =>
                    dispatch({
                      type: "input",
                      name: "passwordCheck",
                      value: e.target.value,
                    })
                  }
                  id="passwordCheck"
                  type="password"
                  value={passwordCheck}
                  onFocus={() =>
                    setPasswordMessage({ color: "transparent", message: "" })
                  }
                  disabled={password.length < 6}
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
                  className="select input"
                  onChange={(e) =>
                    dispatch({
                      type: "input",
                      name: "type",
                      value: e.target.value,
                    })
                  }
                  id="type"
                  value={type}
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

              {type === accountTypes[0].value ? null : type === "label" ? (
                <>
                  <div className="input-wrapper">
                    <label htmlFor="name">Label name</label>
                    <input
                      className="input"
                      onChange={(e) =>
                        dispatch({
                          type: "input",
                          name: "name",
                          value: e.target.value,
                        })
                      }
                      id="name"
                      type="text"
                      value={name}
                      onInput={
                        firstSlugCheck
                          ? null
                          : (e) =>
                              dispatch({
                                type: "input",
                                name: "sluggedName",
                                value: slugify(e.target.value, {
                                  lower: true,
                                  trim: false,
                                }),
                              })
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
                  <small className="hint">
                    Public label URL will be:{" "}
                    <code>
                      {process.env.NEXT_PUBLIC_DLCM_URL}
                      {`${sluggedName}`}
                    </code>
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
                      onChange={(e) =>
                        dispatch({
                          type: "input",
                          name: "name",
                          value: e.target.value,
                        })
                      }
                      id="name"
                      type="text"
                      value={name}
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

              <div className="button-actions cluster">
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
