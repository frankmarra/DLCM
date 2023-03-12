import { supabase } from "@/utils/supabase"
import ProfileLayout from "@/components/ProfileLayout"

export async function getServerSideProps({ params }) {
  let { data: artist, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("type", "Artist")
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
    />
  ) : (
    <div>Loading...</div>
  )
}
