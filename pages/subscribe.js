import { useUser } from "@supabase/auth-helpers-react"
import Link from "next/link"
import Head from "next/head"

export default function Subscribe() {
  const user = useUser()

  return (
    <>
      <Head>
        <title>{"Subscribe to DLCM"}</title>
        <meta property="og:title" content="Subscribe to DLCM" key="title" />
        <meta
          property="og:description"
          content="Subscribe to DLCM.app"
          key="description"
        />
      </Head>
      <article
        className="container stack inline-max center-stage"
        style={{ "--max-inline-size": "400px" }}
      >
        <h1>Subscribe to DLCM</h1>
        <h2>Pro Plan</h2>
        <div
          className="container"
          style={{
            textAlign: "center",
            fontSize: 40,
            fontWeight: 600,
            paddingBlock: 60,
          }}
        >
          $5 a month
        </div>
        <div className="perks">
          <ul role="list">
            <li>Unlimited Releases</li>
            <li>Custom URLs</li>
            <li>Password Protect Releases & Public Profile</li>
            <li>Turn Releases On/Off</li>
            <li>Bandcamp CSV Code Upload</li>
            <li>Social Site Links</li>
          </ul>
        </div>

        <div className="subscribe-link" style={{ textAlign: "center" }}>
          {user ? (
            <Link style={{ display: "block" }} href="/">
              Subscribe from your user dashboard
            </Link>
          ) : (
            <Link style={{ display: "block" }} href="/signup">
              Create an account to subscribe
            </Link>
          )}
        </div>
      </article>
    </>
  )
}
