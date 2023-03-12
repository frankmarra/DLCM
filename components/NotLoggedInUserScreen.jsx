import Login from '@/components/Login'
import Link from 'next/link'

export default function NotLoggedInUserScreen({ actionText }) {
  return (
    <div>
      {actionText ? <p>{actionText}</p> : null}
      <Login />
      <p>
        Don‘t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  )
}
