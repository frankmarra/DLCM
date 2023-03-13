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
  return release ? (
    <ReleaseLayout
      title={release.title}
      artist={release.artist}
      label={release.label}
      artwork_url={release.artwork_url}
      type={release.type}
      download_url={release.download_url}
    />
  ) : (
    <div>Loading...</div>
  )
}
