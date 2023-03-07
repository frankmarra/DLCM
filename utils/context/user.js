import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../supabase'
import { useRouter } from 'next/router'

const Context = createContext()

//create context so user state is available anywhere in app
const UserProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState()
  const router = useRouter()

  useEffect(() => {
    //gets current user from auth table in supabase
    const getUserProfile = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()
      //if there is an auth user, grab that users public profile from supabase
      if (user != null) {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        //set the active user with the user from auth and profiles so all user info is accessible throughout app
        setActiveUser({
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
        `/${user.user_metadata.type === 'Label' ? 'labels' : 'artists'}/${
          user.user_metadata.slug
        }`
      )
    }
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
