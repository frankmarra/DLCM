import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"
import styles from "./Layout.module.css"
import { useRouter } from "next/router"

export default function Layout({ children }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const date = new Date()
  const router = useRouter()

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      <header className={styles.header}>
        {user ? (
          <>
            <h1 className={styles.title}>
              <Link
                href="/"
                style={{ textDecoration: "none", color: "var(--text-1)" }}
              >
                HOME
              </Link>
            </h1>

            <nav>
              <ul className={styles.list} role="list">
                <li>
                  <Link
                    className="button"
                    data-size="small"
                    href="/help"
                    style={{ textDecoration: "none" }}
                  >
                    Docs
                  </Link>
                </li>
                <li>
                  <button
                    className="button"
                    data-size="small"
                    onClick={signOut}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </nav>
          </>
        ) : (
          <>
            <h1 className={styles.title}>
              <Link
                href="/"
                style={{ textDecoration: "none", color: "var(--text-1)" }}
              >
                DLCM
              </Link>
            </h1>
            <nav>
              <ul className={styles.list} role="list">
                <li>
                  <Link
                    className="button"
                    data-size="small"
                    href="/help"
                    style={{ textDecoration: "none" }}
                  >
                    Docs
                  </Link>
                </li>
              </ul>
            </nav>
          </>
        )}
      </header>
      <main className="inline-max stack">{children}</main>
      <footer className={styles.footer}>
        <div className={styles.contact}>
          <a href="mailto:dlcm.app@gmail.com">Contact Us</a>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms and Conditions</Link>
        </div>
        <div className={styles.copyright}>
          <Link href="/signup">Join</Link>
          <Link href="https://mysterycircles.com/donate-to-mc">
            Buy us a coffee
          </Link>
          <p>&copy; {`${date.getFullYear()}`} Mystery Circles</p>
        </div>
      </footer>
    </>
  )
}
