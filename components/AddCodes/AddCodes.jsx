import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog/Dialog"
import Papa from "papaparse"

export default function AddCodes({
  userId,
  releaseId,
  setOnCodeAdded,
  profileData,
}) {
  const supabase = useSupabaseClient()
  const [codes, setCodes] = useState()
  const [open, setOpen] = useState(false)
  const [displayCodes, toggleDisplayCodes] = useState(false)

  function handleUpload(e) {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        let codeArray = []
        let start = 0

        results.data.map((d, index) => {
          if (Object.values(d) == "code") {
            start = index
          }
          if (start != 0 && start < index) {
            codeArray.push(Object.values(d)[0])
          }
        })
        setCodes(codeArray)
        toggleDisplayCodes(true)
      },
    })
  }
  async function createCodes() {
    try {
      let codeArray = []

      codes.forEach((code) => {
        let newCode = {
          release_id: releaseId,
          user_id: userId,
          code: code,
        }
        codeArray.push(newCode)
      })

      const { data, error } = await supabase.from("codes").insert(codeArray)
      if (error) throw error
      alert("New codes added!")
      setOnCodeAdded(true)
    } catch (error) {
      alert("Error creating codes!")
      console.log(error)
    } finally {
      console.log("All done!")

      setOpen(false)
    }
  }

  function closeModal() {
    setCodes()
    toggleDisplayCodes(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="button"
        data-variant="secondary"
        data-size="small"
      >
        Add codes
      </DialogTrigger>

      <DialogContent>
        <header>
          <h3>Add codes</h3>
        </header>

        <div className="stack block-overflow">
          <label className="label" htmlFor="codes">
            Enter manually
          </label>
          <textarea
            className="input block-resize"
            id="codes"
            placeholder="Copy and paste codes here"
            cols="20"
            rows="8"
            onChange={(e) => setCodes(e.target.value.split(/\s/g))}
          ></textarea>
          {profileData.is_subscribed ? (
            <>
              <label className="label" htmlFor="csvcodes">
                Upload with Bandcamp CSV
              </label>
              <br />
              <small>Must be Bandcamp codes CSV or this will not work.</small>
              <input
                type="file"
                id="csvcodes"
                accept=".csv"
                onChange={(e) => handleUpload(e)}
              />
            </>
          ) : null}

          {displayCodes ? (
            <>
              <p>Codes to add:</p>
              <ul>
                {codes.map((code, index) => (
                  <li key={index}>{code}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <footer className="button-actions inline-wrap">
          <button
            className="button"
            data-variant="primary"
            onClick={createCodes}
          >
            Add
          </button>

          <DialogClose className="button" onClick={closeModal}>
            Cancel
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
