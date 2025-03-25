import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useReducer, useState, useEffect } from "react"
import slugify from "slugify"
import { useRouter } from "next/router"
import PopoverTip from "@/components/PopoverTip/PopoverTip"
import Head from "next/head"
import SEO from "@/components/SEO/SEO"
import formReducer from "@/utils/formReducer"
import inputValidator from "@/utils/inputValidator"
import Loader from "@/components/Loader/Loader"

const nameRegEx = /[A-Za-z0-9\-_\.]/

const accountTypes = [
  { value: "", label: "Choose account type", disabled: true },
  { value: "label", label: "Label", disabled: false },
  { value: "artist", label: "Artist", disabled: false },
]

const initialFormValue = {
  email: "",
  sluggedName: "",
  password: "",
  passwordCheck: "",
  type: accountTypes[0].value,
  name: "",
  location: "",
  firstSlugCheck: false,
  submitting: false,
  success: false,
  error: null,
}

const Signup = () => {
  const supabase = createClientComponentClient()
  const [formValue, dispatch] = useReducer(formReducer, initialFormValue)

  const [validation, validate] = useReducer(inputValidator, {
    isEmailValid: {
      color: "transparent",
      message: "",
      isValid: false,
    },

    isPasswordValid: {
      color: "transparent",
      message: "",
      isValid: false,
    },
    isNameValid: {
      color: "transparent",
      message: "",
      isValid: false,
    },
    isFormValid: false,
    checking: false,
  })

  const {
    name,
    sluggedName,
    email,
    password,
    passwordCheck,
    type,
    location,
    firstSlugCheck,
  } = formValue

  const { isEmailValid, isPasswordValid, isNameValid, isFormValid } = validation

  const router = useRouter()

  useEffect(() => {
    const checkFormIsValid = () => {
      if (
        isEmailValid.isValid &&
        isNameValid.isValid &&
        isPasswordValid.isValid &&
        type.length > 0
      ) {
        validate({
          type: "formSuccess",
        })
      }
    }

    checkFormIsValid()
  }, [isEmailValid.isValid, isNameValid.isValid, isPasswordValid.isValid, type])

  const handleChange = (e) => {
    dispatch({
      type: "change",
      name: e.target.id,
      value: e.target.value,
    })
  }

  const checkEmail = async (e) => {
    e.preventDefault()
    if (formValue.email.length > 0) {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", formValue.email)

      if (data.length > 0) {
        validate({
          type: "error",
          name: "isEmailValid",
          message: "Account for this email already exists",
        })
      } else if (data.length == 0) {
        validate({
          type: "success",
          name: "isEmailValid",
          message: "Account available for this email",
        })
      }

      if (error) throw error
    }
  }

  const checkPassword = () => {
    if (formValue.password.length > 0) {
      if (formValue.password === formValue.passwordCheck) {
        validate({
          type: "success",
          name: "isPasswordValid",
          message: "Passwords match",
        })
      } else if (formValue.password != formValue.passwordCheck) {
        validate({
          type: "error",
          name: "isPasswordValid",
          message: "Passwords do not match",
        })
      }
    }
  }

  const checkName = async (e) => {
    e.preventDefault()

    if (firstSlugCheck == false) {
      dispatch({
        type: "change",
        name: "firstSlugCheck",
        value: true,
      })
    }
    if (sluggedName.length == 0) {
      dispatch({
        type: "error",
        name: "isNameValid",
        message: "User must have a slug",
      })
    }
    if (sluggedName.length > 0) {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", sluggedName)

      if (data.length > 0) {
        validate({
          type: "error",
          name: "isNameValid",
          message: "This URL is already in use",
        })
      } else if (data.length == 0) {
        validate({
          type: "success",
          name: "isNameValid",
          message: "This url is available, snag it!",
        })
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
        validate({
          type: "error",
          name: "isPasswordValid",
          message: "",
        })
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
              Thank you for signing up! <span> <a href="dlcm.app">Click here</a></span> to go to your dashboard.
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
                  onChange={handleChange}
                  id="email"
                  type="email"
                  value={email}
                  // onFocus={() => setEmailsTaken(null)}
                  onBlur={checkEmail}
                  required
                />
              </div>

              <small style={{ color: isEmailValid.color }}>
                {isEmailValid.message}
              </small>

              <div className="input-wrapper">
                <label htmlFor="password">Password</label>
                <input
                  className="input"
                  onChange={handleChange}
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
                  onChange={handleChange}
                  id="passwordCheck"
                  type="password"
                  value={passwordCheck}
                  // onFocus={() =>
                  //   setPasswordMessage({ color: "transparent", message: "" })
                  // }
                  disabled={password.length < 6}
                  onBlur={checkPassword}
                  required
                />
                <small style={{ color: isPasswordValid.color }}>
                  {isPasswordValid.message}
                </small>
              </div>
              <div className="input-wrapper">
                <label htmlFor="type">Account type</label>
                <select
                  className="select input"
                  onChange={handleChange}
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
                      onChange={handleChange}
                      id="name"
                      type="text"
                      value={name}
                      onInput={
                        firstSlugCheck
                          ? null
                          : (e) =>
                              dispatch({
                                type: "change",
                                name: "sluggedName",
                                value: slugify(e.target.value, {
                                  lower: true,
                                  trim: false,
                                  remove: /[*+~.()'"!:@]/g,
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
                      onChange={(e) =>
                        dispatch({
                          type: "change",
                          name: "sluggedName",
                          value: slugify(e.target.value, {
                            lower: true,
                            trim: false,
                            remove: /[*+~.()'"!:@]/g,
                          }),
                        })
                      }
                      id="slug"
                      type="text"
                      value={sluggedName}
                      onInput={
                        firstSlugCheck
                          ? null
                          : (e) =>
                              dispatch({
                                type: "change",
                                name: "sluggedName",
                                value: slugify(e.target.value, {
                                  lower: true,
                                  trim: false,
                                  remove: /[*+~.()'"!:@]/g,
                                }),
                              })
                      }
                      onBlur={checkName}
                    />
                  </div>
                  <small className="hint">
                    Public label URL will be:{" "}
                    <code>
                      {process.env.NEXT_PUBLIC_DLCM_URL}
                      {sluggedName}
                    </code>
                  </small>
                  <br />
                  <small style={{ color: isNameValid.color }}>
                    {isNameValid.message}
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
                      value={name}
                      onInput={
                        firstSlugCheck
                          ? null
                          : (e) =>
                              dispatch({
                                type: "change",
                                name: "sluggedName",
                                value: slugify(e.target.value, {
                                  lower: true,
                                  trim: false,
                                  remove: /[*+~.()'"!:@]/g,
                                }),
                              })
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
                      onChange={(e) =>
                        dispatch({
                          type: "change",
                          name: "sluggedName",
                          value: slugify(e.target.value, {
                            lower: true,
                            trim: false,
                            remove: /[*+~.()'"!:@]/g,
                          }),
                        })
                      }
                      id="slug"
                      type="text"
                      value={sluggedName}
                      onBlur={checkName}
                      required
                    />
                  </div>
                  <small>
                    Public artist URL will be:{" "}
                    {process.env.NEXT_PUBLIC_DLCM_URL}
                    {sluggedName}
                  </small>
                  <br />
                  <small style={{ color: isNameValid.color }}>
                    {isNameValid.message}
                  </small>
                </>
              )}

              <div className="button-actions cluster">
                <button
                  type="submit"
                  className="button"
                  data-variant="primary"
                  disabled={!isFormValid}
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
