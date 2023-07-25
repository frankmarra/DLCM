import { supabase } from "@/utils/supabase"
import ReleaseLayout from "@/components/Releases/ReleaseLayout"
import { useRouter } from "next/router"

export async function getServerSideProps({ params }) {
  let { user, slug } = params
  let { data: releaseInfo, error } = await supabase
    .from("profiles")
    .select("is_subscribed, dlcm_friend, yum_url , releases(*)")
    .eq("slug", user)
    .eq("releases.release_slug", slug)
    .single()

  if (releaseInfo.releases[0] == null) {
    return { props: {}, redirect: { destination: "/404" } }
  }
  return { props: { releaseInfo } }
}

export default function ReleasePage({ releaseInfo }) {
  return releaseInfo.releases[0] != null ? (
    <ReleaseLayout
      isSubscribed={releaseInfo.is_subscribed}
      isDlcmFriend={releaseInfo.dlcm_friend}
      profileYumLink={releaseInfo.yum_url}
      release={releaseInfo.releases[0]}
    />
  ) : null
}
