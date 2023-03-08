import { useUser } from '@/utils/context/user'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/utils/supabase'

const trueFalse = [
  { id: 1, text: 'True', value: true },
  { id: 2, text: 'False', value: false }
]

export default function UpdateProfile() {
  const { activeUser } = useUser()
  const [updateData, setUpdateData] = useState({
    avatar: '',
    location: '',
    isPasswordProtected: '',
    pagePassword: '',
    sites: ''
  })

  useEffect(() => {
    if (activeUser) {
      setUpdateData({
        avatar: activeUser.avatar,
        location: activeUser.location,
        isPasswordProtected: activeUser.isPasswordProtected,
        pagePassword: activeUser.pagePassword,
        sites: activeUser.sites
      })
    }
  }, [activeUser])

  const handleChange = (e) => {
    e.preventDefault()
    setUpdateData({ ...updateData, [e.target.id]: e.target.value })
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', activeUser.id)
  }
  return activeUser ? (
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
          <label htmlFor="isPasswordProtected">
            Password protect public site?
          </label>
          <select
            onChange={handleChange}
            id="isPasswordProtected"
            value={activeUser.isPasswordProtected}
          >
            {trueFalse.map((bool) => (
              <option key={bool.id} value={bool.value}>
                {bool.text}
              </option>
            ))}
          </select>
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
  ) : (
    <div>You do not have permission to access this page</div>
  )
}
