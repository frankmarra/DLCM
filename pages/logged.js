import { useUser } from '@/utils/context/user'

const Logged = () => {
  const { activeUser, logout } = useUser()
  console.log('user: ', activeUser)

  return (
    <div>
      <h1>Logged In!</h1>
      <p>you are currently logged in. Dont believe me? check the console.</p>
      <button type="button" onClick={() => logout()}>
        Log Out
      </button>
    </div>
  )
}

export default Logged
