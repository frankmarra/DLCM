import { supabase } from "@/utils/supabase"
import ProfileLayout from "@/components/Profile/Profile"
import ReleaseLayout from "@/components/Releases/ReleaseLayout"

export async function getServerSideProps({ params }) {
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*, releases(*, codes(*))")
    .eq("slug", params.slug[0])
    .eq("releases.codes.redeemed", false)
    .single()

  return { props: { profile, params } }
}

export default function ProfilePage({ profile, params }) {
  if (params.slug.length == 1) {
    return profile ? (
      <ProfileLayout
        avatar={profile.avatar_url}
        name={profile.username}
        location={profile.location}
        releases={profile.releases}
        profileSlug={profile.slug}
        sites={profile.sites}
        pagePassword={profile.page_password}
        isPasswordProtected={profile.is_password_protected}
        aboutBlurb={profile.about_blurb}
        isSubscribed={profile.is_subscribed}
      />
    ) : (
      <div>Loading...</div>
    )
  }

  if (params.slug.length == 2) {
    let album
    profile.releases.map((release, index) =>
      release.release_slug == params.slug[1] ? (album = release) : null
    )
    return profile && album ? (
      <ReleaseLayout release={album} />
    ) : (
      <div>No Release Found</div>
    )
  }
}
