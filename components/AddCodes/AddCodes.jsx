import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog/Dialog"

export default function AddCodes({ userId, releaseId, setOnCodeAdded }) {
  const supabase = useSupabaseClient()
  const [codes, setCodes] = useState()
  const [open, setOpen] = useState(false)

  async function createCodes() {
    try {
      let codeArray = []

      let newCodes = codes.split(/\s/g)
      newCodes.forEach((code) => {
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
            Codes
          </label>
          <textarea
            className="input block-resize"
            id="albumCodes"
            placeholder="Enter your codes separated by a space"
            cols="20"
            rows="8"
            onChange={(e) => setCodes(e.target.value)}
          ></textarea>
        </div>

        <footer className="button-actions inline-wrap">
          <button
            className="button"
            data-variant="primary"
            onClick={createCodes}
          >
            Add
          </button>

          <DialogClose className="button">Cancel</DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
