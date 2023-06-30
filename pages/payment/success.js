import Link from "next/link"
import { useUser } from "@supabase/auth-helpers-react"

export default function Success() {
  const user = useUser()

  return (
    <section className="container stack inline-max center-stage">
      <p>Hey, Alright! Thanks for joining!</p>
      <Link href="/">Go Home</Link>
    </section>
  )
}
