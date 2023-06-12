import { supabase } from "@/utils/supabase"
import ProfileLayout from "@/components/Profile/Profile"
import ReleaseLayout from "@/components/Releases/ReleaseLayout"

export async function getServerSideProps({ params }) {
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*, releases(*, codes(*))")
    .eq("slug", params.slug)
    .single()

  return { props: { profile, params } }
}

export default function ProfilePage({ profile, params }) {
  if (params.length == 1) {
    return profile ? (
      <ProfileLayout
        avatar={profile.avatar_url}
        name={profile.name}
        location={profile.location}
        releases={profile.releases}
        slug={profile.slug}
      />
    ) : (
      <div>Loading...</div>
    )
  }

  if (params.length == 2) {
    return profile.releases ? (
      <ReleaseLayout release={release} />
    ) : (
      <div>Loading...</div>
    )
  }
}
