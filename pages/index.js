import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import Account from "@/components/Account/Account"
import Login from "@/components/Login/Login"

const Home = () => {
  const session = useSession()

  return !session ? <Login /> : <Account session={session} />
}

export default Home
