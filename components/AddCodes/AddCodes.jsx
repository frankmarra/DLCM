import { useState, useEffect } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function AddCodes({ user_id, release_id, setShowAddCodes }) {
  const supabase = useSupabaseClient()
  const [codes, setCodes] = useState()

  async function createCodes() {
    try {
      let codeArray = []
      let newCodes = codes.split(/\s/g)
      newCodes.forEach((code) => {
        let newCode = {
          release_id: release_id,
          user_id: user_id,
          code: code,
        }
        codeArray.push(newCode)
      })
      const { data, error } = await supabase.from("codes").insert(codeArray)
      if (error) throw error

      setShowAddCodes(false)
    } catch (error) {
      alert("Error creating codes!")
      console.log(error)
    }
  }

  return (
    <div
      className="stack max-inline"
      style={{ "--max-inline-size": "var(--input-screen-max-inline-size)" }}
    >
      <h3>Add codes</h3>

      <label className="label" htmlFor="codes">
        Codes
      </label>
      <textarea
        id="albumCodes"
        placeholder="Enter your codes separated by a space"
        cols="20"
        rows="8"
        onChange={(e) => setCodes(e.target.value)}
      ></textarea>

      <button className="button" data-variant="primary" onClick={createCodes}>
        Add
      </button>
      <button
        className="button"
        data-variant="primary"
        onClick={() => setShowAddCodes(false)}
      >
        Cancel
      </button>
    </div>
  )
}
