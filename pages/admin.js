import AdminDashboard from "@/components/AdminDashboard/AdminDashboard"
import SEO from "@/components/SEO/SEO"

export default function Admin() {
  return (
    <>
      <SEO title="Admin"></SEO>
      <section
        className="stack inline-max center-stage"
        style={{ "--max-inline-size": "65ch" }}
      >
        <h1>Admin</h1>
        <AdminDashboard />
      </section>
    </>
  )
}
