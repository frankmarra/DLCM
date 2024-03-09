export default function AdminDashboard({ supabase }) {
  const getAllUsers = async () => {
    try {
      let { data, error, status } = await supabase
        .from("profiles")
        .select(
          "username, email, slug, type, dlcm_friend, is_subscribed, created_at"
        )
        .order("created_at", { ascending: false })
        .csv()

      if (error) throw error

      if (data) {
        let today = new Date()
        let month = today.getMonth() + 1
        let day = today.getDate()
        let year = today.getFullYear()

        const blob = new Blob([data], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute(
          "download",
          `dlcm_user_list_${month}_${day}_${year}.csv`
        )
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
      <button
        className="button"
        data-variant="secondary"
        data-size="small"
        onClick={getAllUsers}
      >
        Get user list
      </button>
    </>
  )
}
