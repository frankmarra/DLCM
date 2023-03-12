import { supabase } from "@/utils/supabase"
import ProfileLayout from "@/components/ProfileLayout"

export async function getServerSideProps({ params }) {
  let { data: label, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("type", "Label")
    .eq("slug", params.slug)
    .single()

  return { props: { label } }
}

export default function LabelPage({ label }) {
  return label ? (
    <ProfileLayout
      avatar={label.avatar}
      name={label.name}
      location={label.location}
    />
  ) : (
    <div>Loading...</div>
  )
}
