import Link from "next/link"
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle.jsx"
import styles from "./Footer.module.css"

const nav = [
  { id: "contact", label: "Contact Us", url: "mailto:dlcm.app@gmail.com" },
  { id: "privacy", label: "Privacy Policy", url: "/privacy" },
  { id: "terms", label: "Terms and Conditions", url: "/terms" },
  { id: "signup", label: "Sign up", url: "/signup" },
  {
    id: "coffee",
    label: "Buy us a coffee",
    url: "https://mysterycircles.com/donate-to-mc",
  },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <ul className={styles.contact} role="list">
        {nav.map(({ id, label, url }) => (
          <li key={id}>
            <Link id={id} href={url}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.copyright}>
        <p>&copy; {`${new Date().getFullYear()}`} DLCM</p>
      </div>
    </footer>
  )
}
