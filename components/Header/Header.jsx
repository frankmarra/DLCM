import { useEffect, useState } from "react"
import Link from "next/link"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle.jsx"
import BrandLogo from "../BrandLogo/BrandLogo"
import cn from "classnames"
import styles from "./Header.module.css"

const nav = [
  { id: "dashboard", label: "Dashboard", url: "/", isAuth: true },
  { id: "about", label: "About", url: "/about", isAuth: false },
  { id: "pricing", label: "Pricing", url: "/pricing", isAuth: false },
]

export default function Header() {
  const [isNavOpen, setNavOpen] = useState(false)
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  const closeNav = () => setNavOpen(false)

  useEffect(() => {
    router.events.on("routeChangeStart", closeNav)
    return () => router.events.off("routeChangeStart", closeNav)
  }, [router.events])

  return (
    <header className={cn(styles.header, "cluster")}>
      <Link
        className={styles.logo}
        href="/"
        aria-label={user ? "Go to dashboard" : "Go to homepage"}
      >
        <BrandLogo />
      </Link>
      <button
        className={cn(styles.navToggle, "button")}
        data-size="small"
        onClick={() => setNavOpen(!isNavOpen)}
      >
        Menu
      </button>
      <nav className={cn(styles.nav, isNavOpen ? styles.isOpen : "")}>
        <ul className={cn(styles.list, "cluster")} role="list">
          {nav.map(({ id, label, url, isAuth }) => {
            if (!user && isAuth) {
              return
            }

            return (
              <li key={id}>
                <Link className={styles.link} href={url}>
                  {label}
                </Link>
              </li>
            )
          })}
          <li>
            {user ? (
              <button className={styles.link} onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <Link className={styles.link} href="/login">
                Log in
              </Link>
            )}
          </li>
        </ul>
        <div className={styles.themeToggle}>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
