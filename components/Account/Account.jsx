import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import Avatar from "@/components/Avatar/Avatar"
import Releases from "@/components/Releases/Releases"
import UpdateProfile from "@/components/UpdateProfile/UpdateProfile"
import Loader from "@/components/Loader/Loader"
import styles from "./Account.module.css"
import cn from "classnames"
import Link from "next/link"
import Head from "next/head"

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
        .select("*, releases(*, codes(count))")
        .eq("id", user.id)
        .eq("releases.codes.redeemed", false)
        .order("created_at", { foreignTable: "releases", ascending: true })
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

  if (!loading) {
    return <Loader style={{ margin: "auto" }} />
  }

  return (
    <>
      <Head>
        <title>{profileData.username}&apos;s DLCM dashboard</title>
        <meta
          property="og:title"
          content={`${profileData.username}'s DLCM dashboard`}
          key="title"
        />
        <meta
          property="og:description"
          content="This is the home dashboard for DLCM. Users have full access of their account from here."
          key="description"
        />
      </Head>
      <div className={cn(styles.update, "cluster")}>
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
              data-size="small"
              style={{ display: "block", textDecoration: "none" }}
              href="/api/stripe-customer-portal"
            >
              Manage subscription
            </Link>
          ) : (
            <Link
              className="button"
              data-variant="primary"
              data-size="small"
              style={{ display: "block", textDecoration: "none" }}
              href="/api/subscribe-to-dlcm"
            >
              Subscribe
            </Link>
          )
        ) : null}
      </div>
      <article className={cn(styles.profile)}>
        <div className="with-sidebar">
          <Avatar url={profileData.avatar_url} size={150} />
          <div className={cn(styles.details, "stack")}>
            <h1 className={cn(styles.userName, "text-3")}>
              {profileData.username}
            </h1>
            <ul className="cluster" role="list">
              <li className="badge">
                {profileData.type.charAt(0).toUpperCase() +
                  profileData.type.slice(1)}
              </li>
              <li className="badge">
                {profileData.is_subscribed || profileData.dlcm_friend
                  ? "Pro user"
                  : "Free user"}
              </li>
            </ul>

            <dl>
              {profileData.location ? (
                <div className={styles.detail}>
                  <dt>
                    <strong>Location:</strong>
                  </dt>
                  <dd>{profileData.location}</dd>
                </div>
              ) : null}
              <div className={styles.detail}>
                <dt className={styles.url}>
                  <strong>Profile page: </strong>
                </dt>
                <dd>
                  <a href={`/${profileData.slug}`}>{profileData.slug}</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </article>

      <Releases profileData={profileData} getProfile={getProfile} />
    </>
  )
}
