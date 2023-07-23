import { useSessionContext } from "@supabase/auth-helpers-react"
import Account from "@/components/Account/Account"
import Login from "@/components/Login/Login"

const Home = () => {
  const { isLoading, session, error } = useSessionContext()

  if (isLoading) {
    return
  }

  return session ? <Account session={session} /> : <Login />
}

export default Home
