import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle.jsx"
import styles from "./Layout.module.css"

export default function Layout({ children }) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const date = new Date()

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
                    onClick={() => supabase.auth.signOut()}
                  >
                    Sign Out
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
        <ul className={styles.contact} role="list">
          <li>
            <a href="mailto:dlcm.app@gmail.com">Contact Us</a>
          </li>
          <li>
            <Link href="/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/terms">Terms and Conditions</Link>
          </li>
          <li>
            <Link href="/signup">Sign up</Link>
          </li>
          <li>
            <Link href="https://mysterycircles.com/donate-to-mc">
              Buy us a coffee
            </Link>
          </li>
        </ul>
        <div className={styles.copyright}>
          <ThemeToggle></ThemeToggle>
          <p>&copy; {`${date.getFullYear()}`} Mystery Circles</p>
        </div>
      </footer>
    </>
  )
}
