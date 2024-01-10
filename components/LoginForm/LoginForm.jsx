import { useState, useReducer } from "react"
import { useUser } from "@supabase/auth-helpers-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import styles from "./LoginForm.module.css"
import { useRouter } from "next/router"
import formReducer from "../../utils/formReducer"
import Loader from "@/components/Loader/Loader"

export default function LoginForm() {
  const supabase = createClientComponentClient()
  const user = useUser()
  const router = useRouter()

  const initialFormValue = {
    email: "",
    password: "",
    submitting: false,
    success: false,
    error: null,
  }

  const [formValue, dispatch] = useReducer(formReducer, initialFormValue)

  const { email, password } = formValue

  if (user) {
    router.push("/")
  }

  const handleChange = (e) => {
    dispatch({
      type: "change",
      name: e.target.name,
      value: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    dispatch({ type: "submit" })
    e.preventDefault()

    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      dispatch({ type: "error" })
      dispatch({
        type: "change",
        name: "password",
        value: "",
      })
      alert(error.message)
    } else {
      dispatch({ type: "success" })
      router.push("/")
    }
  }

  if (formValue.submitting) {
    return <Loader style={{ margin: "auto" }} />
  }

  return (
    <article
      className="stack inline-max center-stage"
      style={{ "--max-inline-size": "45ch" }}
    >
      <h1>Log in</h1>
      <form className="container stack" onSubmit={handleSubmit}>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          onChange={handleChange}
          className="input"
          name="email"
          type="email"
          value={email}
          required
        />

        <div className={styles.password}>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            onChange={handleChange}
            className="input"
            name="password"
            type="password"
            value={password}
            required
          />
          <p className={styles.forgotPassword}>
            <Link href="/request-password-reset">Forgot password?</Link>
          </p>
        </div>

        <button
          className="button"
          data-variant="primary"
          type="submit"
          disabled={!email || !password}
        >
          Log In
        </button>
      </form>

      <p>
        Not a member yet? <Link href="/signup">Sign up!</Link>
      </p>
    </article>
  )
}
