import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import styles from "./CodeGenerator.module.css"
import cn from "classnames"

export default function CodeGenerator({ release, profileYumLink }) {
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [activeCodes, setActiveCodes] = useState([])
  const [code, setCode] = useState()
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  useEffect(() => {
    getActiveCodes()
    setLoading(false)
  }, [])

  async function getActiveCodes() {
    let { data: codes, error } = await supabase
      .from("codes")
      .select("*")
      .eq("release_id", release.id)
      .eq("redeemed", false)

    setActiveCodes(codes)
  }

  async function getRandomCode() {
    let rng = Math.floor(Math.random() * activeCodes.length)
    setCode(activeCodes[rng])
    const { data, error } = await supabase
      .from("codes")
      .update({ redeemed: true, redeemed_at: new Date().toISOString() })
      .eq("id", activeCodes[rng].id)
  }

  async function copyToClipboard(code) {
    if ("clipboard" in navigator) {
      setCopiedToClipboard(true)
      return await navigator.clipboard.writeText(code)
    } else {
      setCopiedToClipboard(true)
      return document.execCommand("copy", true, code)
    }
  }

  return activeCodes.length > 0 ? (
    <div className={cn(styles.codes, "stack")}>
      {code ? (
        <>
          <p style={{ fontSize: 25, fontWeight: 600, letterSpacing: ".1em" }}>
            {code.code}
          </p>
          {copiedToClipboard ? (
            <button
              className="button"
              type="button"
              data-variant="primary"
              disabled
            >
              Copied!
            </button>
          ) : (
            <button
              type="button"
              className="button"
              data-variant="primary"
              onClick={() => copyToClipboard(code.code)}
            >
              Copy Code
            </button>
          )}
          {release.yum_url ? (
            <a
              href={`${release.yum_url}?code=${code.code}`}
              style={{ fontSize: 20, fontWeight: 600 }}
            >
              Redeem
            </a>
          ) : (
            <a
              href={`${profileYumLink}?code=${code.code}`}
              style={{ fontSize: 20, fontWeight: 600 }}
            >
              Redeem
            </a>
          )}
        </>
      ) : (
        <button
          type="button"
          className="button"
          data-variant="primary"
          style={{ fontSize: "24px" }}
          onClick={() => getRandomCode()}
        >
          Generate Code
        </button>
      )}
    </div>
  ) : (
    <p>No Codes for this release</p>
  )
}
