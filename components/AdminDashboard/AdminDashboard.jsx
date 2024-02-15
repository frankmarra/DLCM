import { useUser } from "@supabase/auth-helpers-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AdminDashboard() {
  //Supabase
  const user = useUser()
  const supabase = createClientComponentClient()

  const getAllUsers = async () => {
    try {
      let { data, error, status } = await supabase
        .from("profiles")
        .select("username, email, slug")
        .csv()

      if (error) throw error

      if (data) {
        const blob = new Blob([data], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "dlcm_user_list.csv")
        document.body.appendChild(link)
        link.click()
      }
    } catch (error) {
      alert("Error loading user data!")
      console.log(error)
    }
  }

  return (
    <>
      <div className="stack">
        <div className="container">
          <h2>Get all usernames, slugs, and emails</h2>
          <button
            className="button"
            data-variant="secondary"
            onClick={getAllUsers}
          >
            Get CSV
          </button>
        </div>
      </div>
    </>
  )
}
