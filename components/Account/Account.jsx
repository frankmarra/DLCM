import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Avatar from "@/components/Avatar/Avatar"
import Releases from "@/components/Releases/Releases"
import UpdateProfile from "../UpdateProfile/UpdateProfile"
import styles from "./Account.module.css"
import cn from "classnames"
import Link from "next/link"

export default function Account({ session }) {
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [showUpdateView, setShowUpdateView] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const { user } = session

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`*`)
        .eq("id", user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setProfileData(data)
      }
    } catch (error) {
      alert("Error loading user data!")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <article className={cn(styles.profile)}>
        <div className={cn(styles.userInfo)}>
          <Avatar url={profileData.avatar_url} size={100} />
          <div className={styles.details}>
            <div style={{ marginInlineEnd: "1em" }} className="badge">
              {profileData.type.charAt(0).toUpperCase() +
                profileData.type.slice(1)}
            </div>
            <div className="badge">
              {profileData.is_subscribed || profileData.dlcm_friend
                ? "Pro user"
                : "Free user"}
            </div>

            <h1>{profileData.username}</h1>
            <div>
              <strong>Location: </strong>
              {profileData.location}
            </div>
            <div className={styles.url}>
              <strong>Profile page: </strong>
              <a href={`/${profileData.slug}`}>{profileData.slug}</a>
            </div>
          </div>
        </div>

        <div className={styles.update}>
          <UpdateProfile
            getProfile={getProfile}
            profileData={profileData}
            setShowUpdateView={setShowUpdateView}
          />

          {!profileData.dlcm_friend ? (
            profileData.is_subscribed ? (
              <Link
                className="button"
                data-variant="primary"
                style={{ display: "block", textDecoration: "none" }}
                href="/api/stripe-customer-portal"
              >
                Manage subscription
              </Link>
            ) : (
              <Link
                className="button"
                data-variant="primary"
                style={{ display: "block", textDecoration: "none" }}
                href="/api/subscribe-to-dlcm"
              >
                Subscribe
              </Link>
            )
          ) : null}
        </div>
      </article>

      <Releases profileData={profileData} />
    </>
  )
}
