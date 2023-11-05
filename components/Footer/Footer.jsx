import Link from "next/link"
import styles from "./Footer.module.css"

const nav = [
  { id: "about", label: "About", url: "/about" },
  { id: "pricing", label: "Pricing", url: "/pricing" },
  { id: "privacy", label: "Privacy Policy", url: "/privacy" },
  { id: "terms", label: "Terms and Conditions", url: "/terms" },
  { id: "contact", label: "Contact Us", url: "mailto:dlcm.app@gmail.com" },
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
      <div className={styles.advertisement}>
        <a
          href="https://link.perfectcircuit.com/t/v1/4-467423-320526-9759"
          rel="sponsored"
        >
          <img
            src="//link.perfectcircuit.com/b/v1/4-467423-320526-9759"
            border="0"
            width="468"
            height="60"
            title="Gear 468x60"
            alt="Gear 468x60"
          />
        </a>
        <small>
          Help support dlcm.app by clicking through the below link to shop at
          Perfect Circuit!
        </small>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {`${new Date().getFullYear()}`} DLCM</p>
      </div>
    </footer>
  )
}
