import Link from "next/link"
import { useUser } from "@supabase/auth-helpers-react"

export default function Cancelled() {
  const user = useUser()
  return (
    <section className="container stack inline-max center-stage">
      <p>All good. Maybe next time. You have not been charged.</p>
      <Link href="/">Go Home</Link>
    </section>
  )
}
