import { useState, useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogPortal,
  DialogClose,
} from "@radix-ui/react-dialog"
import Chart from "chart.js/auto"
import { Bar } from "react-chartjs-2"

export default function ReleaseStats({ release }) {
  const [open, setOpen] = useState(false)
  const [codes, setCodes] = useState()
  const supabase = createClientComponentClient()

  // useEffect(() => {
  //   getCodes()
  // }, [])

  async function getCodes() {
    let { data, error } = await supabase
      .from("codes")
      .select("*")
      .eq("release_id", release.id)
      .eq("redeemed", true)

    if (data) {
      setCodes(data)
    }
  }

  // const julyDownloads = codes.map((code) => {
  //   console.log(code)
  //   let count = 0
  //   let download = new Date(code.redeemed_at)
  //   console.log(download.getMonth())
  //   if (download.getMonth() == 8) {
  //     count++
  //   }
  //   console.log(count)
  // })

  const labels = ["July", "August", "September"]

  // const chartData = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       label: "Downloads",
  //       data: [0, 0, 0],
  //     },
  //   ],
  // }

  function closeModal() {
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="button"
        data-variant="secondary"
        data-size="small"
      >
        Stats
      </DialogTrigger>

      <DialogContent>
        <DialogPortal>
          <header>
            <h2 className="text-3">Release Statistics</h2>
          </header>
          <>
            <div className="stack block-overflow">
              <h3 className="text-3">{release.title} Codes</h3>
            </div>
            {
              //<Bar datasetIdKey="barchart" data={chartData} />
            }
            <button onClick={getCodes}>All</button>
          </>
          <footer className="button-actions cluster">
            <DialogClose className="button" onClick={() => setOpen(false)}>
              Close
            </DialogClose>
          </footer>
        </DialogPortal>
      </DialogContent>
    </Dialog>
  )
}
