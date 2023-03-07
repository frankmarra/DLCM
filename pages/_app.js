import '@/styles/globals.css'
import UserProvider from '@/utils/context/user'

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
