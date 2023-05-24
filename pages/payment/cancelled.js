import Link from "next/link"
export default function Cancelled() {
  return (
    <p>
      All good. Maybe next time. You have not been charged.
      <span>
        <Link href="/">Go Home</Link>
      </span>
    </p>
  )
}
