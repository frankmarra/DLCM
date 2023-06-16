import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function CodeGenerator({ release }) {
  const supabase = useSupabaseClient()
  const [activeCodes, setActiveCodes] = useState([])
  const [code, setCode] = useState()
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  useEffect(() => {
    getActiveCodes()
  }, [])

  function getActiveCodes() {
    let codeCheck = []
    release.codes.forEach((code) => {
      if (code.redeemed == false) {
        codeCheck.push(code)
      }
    })
    setActiveCodes(codeCheck)
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
    <div>
      {code ? (
        <>
          <p>{code.code}</p>
          {copiedToClipboard ? (
            <button type="button" data-variant="primary" disabled>
              Copied!
            </button>
          ) : (
            <button
              type="button"
              data-variant="primary"
              onClick={() => copyToClipboard(code.code)}
            >
              Copy Code
            </button>
          )}
          <a href={`${release.yum_url}`}>Redeem</a>
        </>
      ) : (
        <button
          type="button"
          data-variant="primary"
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
