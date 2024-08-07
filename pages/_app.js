import "@/styles/globals.css"
import { clashDisplay, archivo } from "@/utils/fonts"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { useState } from "react"
import "@fortawesome/fontawesome-svg-core/styles.css"
import Layout from "@/components/Layout/Layout"

function App({ Component, pageProps }) {
  const [supabase] = useState(() => createPagesBrowserClient())

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <style jsx global>{`
        :where(html) {
          --font-heading: ${clashDisplay.style.fontFamily}, var(--font-sans);
          --font-main: ${archivo.style.fontFamily}, var(--font-sans);
        }
      `}</style>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  )
}
export default App
