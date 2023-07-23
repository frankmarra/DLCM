import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import cn from "classnames"
import styles from "./Layout.module.css"

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className={cn(styles.main, "inline-max stack")}>{children}</main>
      <Footer />
    </>
  )
}
