import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import cn from "classnames"
import styles from "./Layout.module.css"
import Head from "next/head"
import SEO from "../SEO/SEO"

export default function Layout({ children }) {
  return (
    <>
      <SEO></SEO>
      <Header />
      <main className={cn(styles.main, "inline-max stack")}>{children}</main>
      <Footer />
    </>
  )
}
