import { useState } from "react"
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

const months = [
  { id: 0, text: "January" },
  { id: 1, text: "February" },
  { id: 2, text: "March" },
  { id: 3, text: "April" },
  { id: 4, text: "May" },
  { id: 5, text: "June" },
  { id: 6, text: "July" },
  { id: 7, text: "August" },
  { id: 8, text: "September" },
  { id: 9, text: "October" },
  { id: 10, text: "November" },
  { id: 11, text: "December" },
]

export default function ReleaseStats({ release }) {
  const [open, setOpen] = useState(false)
  const [redeemedCodes, setRedeemedCodes] = useState()
  const supabase = createClientComponentClient()

  async function getCodes() {
    try {
      let { data, error } = await supabase
        .from("codes")
        .select("*")
        .eq("release_id", release.id)
        .eq("redeemed", true)

      if (data) {
        setRedeemedCodes(data)
      }
      if (error) throw error
    } catch (error) {
      throw error
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
        <header>
          <h2 className="text-3">Release Statistics</h2>
        </header>

        <div className="stack">
          <h3 className="text-3">{release.title} Codes</h3>
          <p>Total codes redeemed: {redeemedCodes?.length}</p>
          {
            //<Bar datasetIdKey="barchart" data={chartData} />
          }
          <button onClick={getCodes}>All</button>
        </div>

        <footer className="button-actions cluster">
          <DialogClose className="button" onClick={() => setOpen(false)}>
            Close
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
