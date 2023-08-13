import { supabase } from "@/utils/supabase"
import ProfileLayout from "@/components/Profile/Profile"
import ReleaseLayout from "@/components/Releases/ReleaseLayout"

export async function getServerSideProps({ params }) {
  let { slug } = params
  let { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "avatar_url, username, location, slug, sites, page_password, is_password_protected, about_blurb, is_subscribed, dlcm_friend, releases(*, codes(count))"
    )
    .eq("slug", slug)
    .eq("releases.codes.redeemed", false)
    .eq("releases.is_active", true)
    .order("release_date", { foreignTable: "releases", ascending: false })
    .single()

  if (profile === null) {
    return { props: {}, redirect: { destination: "/404" } }
  }
  return { props: { profile } }
}

export default function ProfilePage({ profile }) {
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
      isDlcmFriend={profile.dlcm_friend}
    />
  ) : null
}
