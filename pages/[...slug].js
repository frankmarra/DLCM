import { supabase } from "@/utils/supabase"
import ProfileLayout from "@/components/Profile/Profile"
import ReleaseLayout from "@/components/Releases/ReleaseLayout"

export async function getServerSideProps({ params }) {
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*, releases(*, codes(*))")
    .eq("slug", params.slug[0])
    .single()

  return { props: { profile, params } }
}

export default function ProfilePage({ profile, params }) {
  if (params.slug.length == 1) {
    return profile ? (
      <ProfileLayout
        avatar={profile.avatar_url}
        name={profile.name}
        location={profile.location}
        releases={profile.releases}
        profileSlug={profile.slug}
        sites={profile.sites}
      />
    ) : (
      <div>Loading...</div>
    )
  }

  if (params.slug.length == 2) {
    return profile ? (
      profile.releases.map((release, index) =>
        release.release_slug == params.slug[1] ? (
          <ReleaseLayout key={index} release={release} sites={profile.sites} />
        ) : null
      )
    ) : (
      <div>No Release Found</div>
    )
  }
}
