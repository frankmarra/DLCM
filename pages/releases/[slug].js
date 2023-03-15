import { supabase } from "@/utils/supabase"
import ReleaseLayout from "@/components/Releases/ReleaseLayout"

export async function getServerSideProps({ params }) {
  let { data: release, error } = await supabase
    .from("releases")
    .select("*")
    .eq("release_slug", params.slug)
    .single()

  return { props: { release } }
}

export default function ReleasePage({ release }) {
  return release ? <ReleaseLayout release={release} /> : <div>Loading...</div>
}
