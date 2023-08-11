import { useEffect } from "react"
import SEO from "@/components/SEO/SEO"

export default function Terms() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://app.termly.io/embed-policy.min.js"
    script.async = true
    document.body.appendChild(script)
  }, [])
  return (
    <>
      <SEO title="Terms and Conditions"></SEO>
      <div
        name="termly-embed"
        data-id="92a59950-bbba-4c58-af6c-8c8cf8872fa8"
        data-type="iframe"
      ></div>
    </>
  )
}
