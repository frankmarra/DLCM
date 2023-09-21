import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogPortal,
  DialogClose,
} from "@/components/Dialog/Dialog"
import Chart from "chart.js/auto"
import { Bar } from "react-chartjs-2"

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

let today = new Date()

let yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)

let tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

let pastWeek = new Date()
pastWeek.setDate(pastWeek.getDate() - 6)

let pastTwoWeeks = new Date()
pastTwoWeeks.setDate(pastTwoWeeks.getDate() - 13)

let pastMonth = new Date()
pastMonth.setDate(pastMonth.getDate() - 29)

export default function ReleaseStats({ release }) {
  const [open, setOpen] = useState(false)
  const [redeemedCodes, setRedeemedCodes] = useState()
  const [labels, setLabels] = useState()
  const [chartData, setChartData] = useState()
  const supabase = createClientComponentClient()

  async function getCodes(startDate, endDate) {
    try {
      let { data, error } = await supabase
        .from("codes")
        .select("redeemed_at", { count: "exact" })
        .eq("release_id", release.id)
        .eq("redeemed", true)
        .gte("redeemed_at", startDate)
        .lte("redeemed_at", endDate)

      if (data) {
        setRedeemedCodes(data)
      }
      if (error) throw error
    } catch (error) {
      throw error
    }
  }

  // function chartCreator(length, filterType) {
  //   let dataArray = new Array(length)
  //   if(filterType == 'week') {

  //   }
  // }
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

  // const chart = {
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
            //<Bar datasetIdKey="barchart" data={chart} />
          }
          <div className="cluster">
            <button
              onClick={() =>
                getCodes("2023-01-22", tomorrow.toLocaleDateString())
              }
            >
              All
            </button>
            <button
              onClick={() =>
                getCodes(
                  today.toLocaleDateString(),
                  tomorrow.toLocaleDateString()
                )
              }
            >
              Today
            </button>
            <button
              onClick={() =>
                getCodes(
                  yesterday.toLocaleDateString(),
                  today.toLocaleDateString()
                )
              }
            >
              Yesterday
            </button>
            <button
              onClick={() =>
                getCodes(
                  pastWeek.toLocaleDateString(),
                  tomorrow.toLocaleDateString()
                )
              }
            >
              7 Days
            </button>
            <button
              onClick={() =>
                getCodes(
                  pastTwoWeeks.toLocaleDateString(),
                  tomorrow.toLocaleDateString()
                )
              }
            >
              14 Days
            </button>
            <button
              onClick={() =>
                getCodes(
                  pastMonth.toLocaleDateString(),
                  tomorrow.toLocaleDateString()
                )
              }
            >
              30 Days
            </button>
          </div>
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
