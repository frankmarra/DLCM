import { useEffect } from "react"
import Head from "next/head"

export default function PrivacyPolicy() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://app.termly.io/embed-policy.min.js"
    script.async = true
    document.body.appendChild(script)
  }, [])
  return (
    <>
      <Head>
        <title>{"Sign up to DLCM"}</title>
        <meta property="og:title" content="Sign up to DLCM" key="title" />
        <meta
          property="og:description"
          content="Sign up to start using DLCM"
          key="description"
        />
      </Head>
      <div
        name="termly-embed"
        data-id="a462fd7d-322c-495e-bf39-340ef098101b"
        data-type="iframe"
      ></div>
    </>
  )
}
