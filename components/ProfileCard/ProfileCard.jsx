import cn from "classnames"
import styles from "./ProfileCard.module.css"
import Link from "next/link"
import IconDownload from "@/icons/download.svg"
import Image from "next/image"

export default function ProfileCard({ profile }) {
  return (
    <div className={cn(styles.component)}>
      <div className={styles.content}>
        <Image
          className={styles.image}
          src={profile.avatar_url || "/default-image-release.png"}
          alt={profile.username}
          height={250}
          width={250}
          quality={60}
        />
        <div className={styles.details}>
          <div>
            <h3 className={cn(styles.title, "line-clamp")}>
              <Link className="link" href={`/${profile.slug}`}>
                {profile.username}
              </Link>
            </h3>
            <div className={cn(styles.artist, "line-clamp")}>
              {profile.type}
            </div>
          </div>
          <div
            className={cn(
              styles.codes,
              profile.releases[0].count <= 0 && styles.empty
            )}
          >
            <IconDownload aria-label="Available download codes" />
            {profile.releases[0].count}{" "}
            <small style={{ fontWeight: "normal" }}>releases</small>
          </div>
        </div>
      </div>
    </div>
  )
}
