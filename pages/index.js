import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import Account from "@/components/Account/Account"

const Home = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <div
      className="container max-inline"
      style={{ "--max-inline-size": "450px" }}
    >
      {!session ? (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Password",
              },
            },
          }}
        />
      ) : (
        <Account session={session} />
      )}
    </div>
  )
}

export default Home
