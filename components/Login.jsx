import { useState } from "react";
import { useUser } from "@/utils/context/user";
import Link from "next/link";

export default function Login() {
  const [signIn, setsignIn] = useState({
    email: "",
    password: "",
  });
  const { loginWithPassword } = useUser();

  const handleChange = (e) => {
    setsignIn({ ...signIn, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginWithPassword(signIn.email, signIn.password);
  };

  return (
    <article
      className="container max-inline stack"
      style={{ "--max-inline-size": "var(--input-screen-max-inline-size)" }}>
      <h2>Sign In</h2>

      <form className="stack" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input onChange={handleChange} id="email" type="email" value={signIn.email} required />

        <label htmlFor="password">Password</label>
        <input onChange={handleChange} id="password" type="password" value={signIn.password} required />

        <button type="submit" className="button" disabled={!signIn.email || !signIn.password}>
          Sign In
        </button>
      </form>

      <p>
        Not a member? <Link href="/signup">Sign up!</Link>
      </p>
    </article>
  );
}
