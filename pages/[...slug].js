import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import ProfileLayout from "@/components/Profile/Profile"

export async function getServerSideProps({ params }) {
  let supabase = createClientComponentClient()
  let { slug } = params
  let { data: profile, error } = await supabase
    .from("profiles")
    // .select(
    //   "avatar_url, username, location, slug, sites, page_password, is_password_protected, about_blurb, is_subscribed, dlcm_friend, releases(*, codes(count))"
    // )
    .select(
      "id, avatar_url, username, location, slug, sites, page_password, is_password_protected, about_blurb, is_subscribed, dlcm_friend, releases(count)"
    )
    .eq("slug", slug)
    .eq("releases.is_active", true)
    .single()

  if (profile === null) {
    return { props: {}, redirect: { destination: "/404" } }
  }
  return { props: { profile } }
}

export default function ProfilePage({ profile }) {
  return profile ? (
    <ProfileLayout
      userId={profile.id}
      avatar={profile.avatar_url}
      name={profile.username}
      location={profile.location}
      releases={profile.releases[0].count}
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
