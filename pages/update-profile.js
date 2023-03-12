import { useUser } from '@/utils/context/user'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabase'
import Link from 'next/link'
import Login from '@/components/Login'
import NotLoggedInUserScreen from '@/components/NotLoggedInUserScreen'

export default function UpdateProfile() {
  const { user } = useUser()
  const [updateData, setUpdateData] = useState({
    avatar: '',
    location: '',
    isPasswordProtected: '',
    pagePassword: '',
    sites: ''
  })

  useEffect(() => {
    if (user) {
      setUpdateData({
        avatar: user.avatar,
        location: user.location,
        isPasswordProtected: user.isPasswordProtected,
        pagePassword: user.pagePassword,
        sites: user.sites
      })
    }
  }, [user])

  const handleChange = (e) => {
    console.log('hi change')
    e.preventDefault()
    setUpdateData({ ...updateData, [e.target.id]: e.target.value })
  }

  const handleIsPasswordProtectedChange = (e) => {
    setUpdateData({
      ...updateData,
      isPasswordProtected: e.target.checked
    })
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
  }

  if (!user) {
    return (
      <NotLoggedInUserScreen actionText="You must login to create a new release" />
    )
  }

  return (
    <div className="update-profile-wrapper">
      <h1>Update Profile</h1>
      <form className="update-profile-form" onSubmit={updateProfile}>
        <div className="input-wrapper">
          <label htmlFor="avatar">Avatar</label>
          <input
            onChange={handleChange}
            id="avatar"
            type="text"
            value={updateData.avatar}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="location">Location</label>
          <input
            onChange={handleChange}
            id="location"
            type="text"
            value={updateData.location}
          />
        </div>
        <div className="input-wrapper">
          <input
            type="checkbox"
            id="isPasswordProtected"
            onChange={handleIsPasswordProtectedChange}
            checked={updateData.isPasswordProtected}
          />
          <label htmlFor="isPasswordProtected">
            Enable password protection
          </label>
        </div>
        {updateData.isPasswordProtected ? (
          <div className="input-wrapper">
            <label htmlFor="pagePassword">Page password</label>
            <input
              onChange={handleChange}
              id="pagePassword"
              type="password"
              value={updateData.pagePassword}
            />
          </div>
        ) : null}
        <button type="submit" className="btn primary">
          Update
        </button>
      </form>
    </div>
  )
}
