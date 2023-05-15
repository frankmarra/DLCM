import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"
import styles from "./Layout.module.css"

export default function Layout({ children }) {
  const supabase = useSupabaseClient()
  const user = useUser()

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>DLCM</h1>
        {user ? (
          <nav>
            <ul className={styles.list} role="list">
              <li>
                <Link href="/subscribe">Subscribe</Link>
              </li>
              <li>
                <button
                  className="button"
                  data-size="small"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>
      <main className="inline-max stack">{children}</main>
      <footer className={styles.footer}>
        <p>
          Footer content: copyright info, contact links, privacy policy, etc.
        </p>
      </footer>
    </>
  )
}
