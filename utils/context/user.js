import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase'
import { useRouter } from 'next/router'

const Context = createContext()

const UserProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState()
  const router = useRouter()

  useEffect(() => {
    const getUserProfile = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      console.log('user in user: ', activeUser)
      console.log('session user: ', user)
      if (user != null) {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setActiveUser({
          ...user,
          ...profiles
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
    setActiveUser(null)
    router.push('/')
  }

  const exposed = {
    activeUser,
    loginWithPassword,
    logout
  }

  return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useUser = () => useContext(Context)

export default UserProvider
