import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase'
import { useRouter } from 'next/router'

const Context = createContext()

//create context so user state is available anywhere in app
const UserProvider = ({ children }) => {
  const [user, setUser] = useState()
  const router = useRouter()

  const userTypePaths = new Map([
    ['Label', 'labels'],
    ['Artist', 'artists']
  ])

  useEffect(() => {
    const getUserProfile = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (user != null) {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setUser({
          ...user,
          ...profiles
        })
      }
    }
    //get user profile on mount and any time the auth state changes.
    getUserProfile()
    supabase.auth.onAuthStateChange(() => {
      getUserProfile()
    })
  }, [])

  //login with dlcm user name and password
  const loginWithPassword = async (email, password) => {
    const {
      data: { user },
      error
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (user) {
      router.push(
        `/${userTypePaths.get(user.user_metadata.type)}/${
          user.user_metadata.slug
        }`
      )
    }
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
