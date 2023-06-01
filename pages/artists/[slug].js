import { supabase } from "@/utils/supabase"
import ProfileLayout from "@/components/Profile/Profile"

export async function getServerSideProps({ params }) {
  let { data: artist, error } = await supabase
    .from("profiles")
    .select("*, releases(*, codes(*))")
    .eq("type", "artist")
    .eq("slug", params.slug)
    .single()

  return { props: { artist } }
}

export default function ArtistPage({ artist }) {
  return artist ? (
    <ProfileLayout
      avatar={artist.avatar_url}
      name={artist.name}
      location={artist.location}
      releases={artist.releases}
      slug={artist.slug}
    />
  ) : (
    <div>Loading...</div>
  )
}
