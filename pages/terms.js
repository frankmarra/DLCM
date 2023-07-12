import { useEffect } from "react"
import Head from "next/head"

export default function Terms() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://app.termly.io/embed-policy.min.js"
    script.async = true
    document.body.appendChild(script)
  }, [])
  return (
    <>
      <Head>
        <title>{"Terms and Conditions"}</title>
        <meta property="og:title" content="Terms and Conditions" key="title" />
        <meta
          property="og:description"
          content="View the terms and conditions for DLCM.app"
          key="description"
        />
      </Head>
      <div
        name="termly-embed"
        data-id="92a59950-bbba-4c58-af6c-8c8cf8872fa8"
        data-type="iframe"
      ></div>
    </>
  )
}
