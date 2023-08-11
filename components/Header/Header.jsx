import { useEffect, useState } from "react"
import Link from "next/link"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle.jsx"
import Logo from "@/icons/dlcm-logo.svg"
import cn from "classnames"
import styles from "./Header.module.css"

export default function Header() {
  const [isNavOpen, setNavOpen] = useState(false)
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  const nav = [
    { id: "about", label: "About", url: "/about", isAuth: false },
    { id: "pricing", label: "Pricing", url: "/pricing", isAuth: false },
    { id: "sign up", label: "Sign up", url: "/signup", isAuth: false },
  ]

  const userNav = [
    { id: "dashboard", label: "Dashboard", url: "/" },
    // {
    //   id: "subscribe",
    //   label: "Subscribe",
    //   url: "/api/subscribe-to-dlcm",
    //   hasProAccount: user?.is_subscribed || user?.dlcm_friend,
    // },
  ]

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  const closeNav = () => setNavOpen(false)

  useEffect(() => {
    router.events.on("routeChangeComplete", closeNav)
    return () => router.events.off("routeChangeComplete", closeNav)
  }, [router.events])

  return (
    <header className={cn(styles.header, "cluster")}>
      <Link
        className={styles.logo}
        href="/"
        aria-label={user ? "Go to dashboard" : "Go to homepage"}
      >
        <Logo />
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
          {user ? (
            <>
              {userNav.map(({ id, label, url, hasProAccount }) => {
                if (hasProAccount) {
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
              <button className={styles.link} onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              {nav.map(({ id, label, url }) => {
                return (
                  <li key={id}>
                    <Link className={styles.link} href={url}>
                      {label}
                    </Link>
                  </li>
                )
              })}
              <Link className={styles.link} href="/login">
                Log in
              </Link>
            </>
          )}
        </ul>
        <div className={styles.themeToggle}>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
