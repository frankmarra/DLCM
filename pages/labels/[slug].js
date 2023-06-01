import { supabase } from "@/utils/supabase"
import ProfileLayout from "@/components/Profile/Profile"

export async function getServerSideProps({ params }) {
  let { data: label, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("type", "label")
    .eq("slug", params.slug)
    .single()

  return { props: { label } }
}

export default function LabelPage({ label }) {
  return label ? (
    <ProfileLayout
      avatar={label.avatar_url}
      name={label.name}
      location={label.location}
    />
  ) : (
    <div>Loading...</div>
  )
}
