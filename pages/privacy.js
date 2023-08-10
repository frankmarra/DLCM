import { useEffect } from "react"
import Head from "next/head"
import SEO from "@/components/SEO/SEO"

export default function PrivacyPolicy() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://app.termly.io/embed-policy.min.js"
    script.async = true
    document.body.appendChild(script)
  }, [])
  return (
    <>
      <SEO title="Privacy Policy"></SEO>
      <div
        name="termly-embed"
        data-id="a462fd7d-322c-495e-bf39-340ef098101b"
        data-type="iframe"
      ></div>
    </>
  )
}
