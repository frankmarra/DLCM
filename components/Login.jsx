import { useState } from 'react'
import { useUser } from '@/utils/context/user'
import Link from 'next/link'

const Login = () => {
  const [signIn, setsignIn] = useState({
    email: '',
    password: ''
  })
  const { loginWithPassword } = useUser()

  const handleChange = (e) => {
    setsignIn({ ...signIn, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    loginWithPassword(signIn.email, signIn.password)
  }

  return (
    <div className="signin form-container">
      <h2>Sign In</h2>
      <form className="signin-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            id="email"
            type="email"
            value={signIn.email}
            required
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            id="password"
            type="password"
            value={signIn.password}
            required
          />
        </div>
        <button
          type="submit"
          className="btn primary"
          disabled={!signIn.email || !signIn.password}
        >
          Sign In
        </button>
      </form>
    </div>
  )
}

export default Login
