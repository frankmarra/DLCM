import { useSessionContext } from "@supabase/auth-helpers-react"
import Account from "@/components/Account/Account"
import styles from "@/styles/Home.module.css"
import BrandLogo from "@/components/BrandLogo/BrandLogo"
import Link from "next/link"
import cn from "classnames"

const Home = () => {
  const { isLoading, session, error } = useSessionContext()

  if (isLoading) {
    return
  }

  if (session) {
    return <Account session={session} />
  }

  return (
    <div className={cn(styles.hero, "stack")}>
      <h1 className={styles.logo}>DLCM</h1>
      <p className={styles.heading}>
        The definitive solution for download code management
      </p>
      <div className={cn(styles.actions, "cluster")}>
        <Link className="button" data-variant="primary" href="/signup">
          Get started for free
        </Link>
        <Link href="/about">Learn more</Link>
      </div>
    </div>
  )
}

export default Home
