import styles from "./Layout.module.css"

export default function Layout({ title, children }) {
  return (
    <>
      <header className={styles.header}>
        <h1>{title || "Download Code Manager"}</h1>
      </header>
      <main className="max-inline">{children}</main>
      <footer></footer>
    </>
  )
}
