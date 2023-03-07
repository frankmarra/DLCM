import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase'
import { useRouter } from 'next/router'

const Context = createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(supabase.auth.getUser())
  const router = useRouter()

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.getUser()

      if (sessionUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .single()

        setUser({
          ...sessionUser,
          ...profile
        })
      }
    }

    getUserProfile()
    supabase.auth.onAuthStateChange(() => {
      getUserProfile()
    })
  }, [])

  const loginWithPassword = async (email, password) => {
    await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    router.push('/logged')
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const exposed = {
    user,
    loginWithPassword,
    logout
  }

  return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useUser = () => useContext(Context)

export default UserProvider
