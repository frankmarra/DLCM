import { useState, useEffect } from "react"
import Loader from "../Loader/Loader"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog/Dialog"

export default function EditCodes({
  userId,
  releaseId,
  releaseName,
  setOnCodeAdded,
  profileDate,
}) {
  const supabase = createClientComponentClient()
  const [activeCodes, setActiveCodes] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

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
        .eq("release_id", releaseId)
        .eq("redeemed", false)

      if (error && status !== 406) {
        throw error
      }

      if (codes) {
        setActiveCodes(codes)
      }
    } catch (error) {
      alert("Error loading release codes.")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  function removeCode(index) {
    let updatedCodes = activeCodes.toSpliced(index, 1)
    setActiveCodes(updatedCodes)
  }

  if (loading) {
    return <Loader style={{ margin: "auto" }} />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="button"
        data-variant="secondary"
        data-size="small"
      >
        Edit Codes
      </DialogTrigger>

      <DialogContent>
        <header>
          <h2 className="text-3">{`Codes for ${releaseName}`}</h2>
        </header>

        <div className="stack block-overflow"></div>
        <div>
          <table>
            <thead>
              <tr>
                <th colSpan="2">Available Codes</th>
              </tr>
            </thead>
            <tbody>
              {activeCodes?.map((code, index) => (
                <tr key={index}>
                  <td>{code.code}</td>
                  <td>
                    <button
                      className="button"
                      type="button"
                      data-variant="secondary"
                      onClick={() => removeCode(index)}
                    >
                      remove?
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
