import SEO from "../SEO/SEO"
import Link from "next/link"
import styles from "./IndexLayout.module.css"
import cn from "classnames"
import ProfileCard from "../ProfileCard/ProfileCard"

export default function IndexLayout({ profiles }) {
  return (
    <>
      <SEO
        title="Public Index"
        description="Discover other artists and labels using the DLCM service"
      ></SEO>

      <h1>DLCM Public User Index</h1>

      <ul className={cn("grid")} role="list">
        {profiles.map((profile, index) => (
          <li key={index}>
            <Link className={styles.profile} href={`/${profile.slug}`}>
              <ProfileCard key={profile.id} profile={profile} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
