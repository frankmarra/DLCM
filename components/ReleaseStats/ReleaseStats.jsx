import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogPortal,
  DialogClose,
} from "@/components/Dialog/Dialog"

let today = new Date()

let yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

let tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

let pastWeek = new Date(today)
pastWeek.setDate(pastWeek.getDate() - 6)

let pastTwoWeeks = new Date(today)
pastTwoWeeks.setDate(pastTwoWeeks.getDate() - 13)

let past30Days = new Date(today)
past30Days.setDate(past30Days.getDate() - 29)

let allDates = new Date("2023-01-22")

export default function ReleaseStats({ release }) {
  const [open, setOpen] = useState(false)
  const [redeemedCodes, setRedeemedCodes] = useState()
  const [labels, setLabels] = useState()
  const [chartData, setChartData] = useState()
  const supabase = createClientComponentClient()

  async function getCodes(startDate, endDate) {
    try {
      let { count, error } = await supabase
        .from("codes")
        .select("redeemed_at", { count: "exact", head: true })
        .eq("release_id", release.id)
        .eq("redeemed", true)
        .gte("redeemed_at", startDate)
        .lte("redeemed_at", endDate)

      if (count) {
        setRedeemedCodes(count)
      } else if (count === 0) {
        setRedeemedCodes(0)
      }

      if (error) throw error
    } catch (error) {
      throw error
    }
  }

  const statsTime = [
    {
      label: "Today",
      start: today,
      end: tomorrow,
    },
    {
      label: "Yesterday",
      start: yesterday,
      end: today,
    },
    {
      label: "7 Days",
      start: pastWeek,
      end: tomorrow,
    },
    {
      label: "14 Days",
      start: pastTwoWeeks,
      end: tomorrow,
    },
    {
      label: "30 Days",
      start: past30Days,
      end: tomorrow,
    },
    {
      label: "All",
      start: allDates,
      end: tomorrow,
    },
  ]

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
          <p>Total codes redeemed: {redeemedCodes}</p>
          <div className="flex-grid">
            {statsTime.map((time, index) => (
              <button
                key={index}
                className="button"
                data-variant="primary"
                onClick={() =>
                  getCodes(
                    time.start.toLocaleDateString(),
                    time.end.toLocaleDateString()
                  )
                }
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>

        <footer className="intrinsic-center">
          <div>
            <DialogClose className="button" onClick={() => setOpen(false)}>
              Close
            </DialogClose>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
