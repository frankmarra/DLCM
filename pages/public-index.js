import IndexLayout from "@/components/IndexLayout/IndexLayout"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function getServerSideProps() {
  let supabase = createClientComponentClient()

  let { data: publicProfiles, error } = await supabase
    .from("profiles")
    .select("avatar_url, username, type, location, slug")
    .eq("in_public_index", true)
    .order("username", { ascending: true })

  if (publicProfiles === null) {
    return { props: {}, redirect: { destination: "/404" } }
  }

  return { props: { publicProfiles } }
}

export default function PublicIndex({ publicProfiles }) {
  return publicProfiles ? <IndexLayout profiles={publicProfiles} /> : null
}
