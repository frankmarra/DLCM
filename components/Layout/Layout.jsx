import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import styles from "./Layout.module.css"

export default function Layout({ children }) {
  const user = useUser()
  console.log(user)
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>DLCM</h1>
        <nav>
          <ul className={styles.list} role="list">
            <li>
              <a href="#">Account</a>
            </li>
            <li>
              <a href="#">Logout</a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="inline-max stack">{children}</main>
      <footer></footer>
    </>
  )
}
