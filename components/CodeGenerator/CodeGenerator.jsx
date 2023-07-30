import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import styles from "./CodeGenerator.module.css"
import cn from "classnames"
import Loader from "../Loader/Loader"

export default function CodeGenerator({ release, profileYumLink }) {
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [activeCodes, setActiveCodes] = useState([])
  const [code, setCode] = useState()
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

  useEffect(() => {
    getActiveCodes()
  }, [])

  async function getActiveCodes() {
    try {
      setLoading(true)

      let {
        data: codes,
        error,
        status,
      } = await supabase
        .from("codes")
        .select("*")
        .eq("release_id", release.id)
        .eq("redeemed", false)

      if (error && status !== 406) {
        throw error
      }

      if (codes) {
        setActiveCodes(codes)
      }
    } catch (error) {
      alert("Error loading release codes!")
      console.log(error)
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return <Loader style={{ margin: "auto" }} />
  }

  return activeCodes.length > 0 ? (
    <div className={cn(styles.codes, "stack")}>
      {code ? (
        <>
          <p>{code.code}</p>
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
            <a href={`${release.yum_url}?code=${code.code}`}>Redeem</a>
          ) : (
            <a href={`${profileYumLink}?code=${code.code}`}>Redeem</a>
          )}
        </>
      ) : (
        <button
          type="button"
          className="button"
          data-variant="primary"
          onClick={() => getRandomCode()}
        >
          Generate Code
        </button>
      )}
    </div>
  ) : (
    <p className={styles.nocodes}>No codes for this release</p>
  )
}
