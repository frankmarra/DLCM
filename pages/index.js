import Login from '@/components/login'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>D L C M V 2</h1>
      <Login />
      <p>
        Not a member?{' '}
        <span>
          <Link href="/signup">Sign up!</Link>
        </span>
      </p>
    </div>
  )
}
