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
            <button
              className="button"
              data-variant="primary"
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
              className="button"
              data-variant="primary"
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
              className="button"
              data-variant="primary"
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
              className="button"
              data-variant="primary"
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
              className="button"
              data-variant="primary"
              onClick={() =>
                getCodes(
                  pastMonth.toLocaleDateString(),
                  tomorrow.toLocaleDateString()
                )
              }
            >
              30 Days
            </button>
            <button
              className="button"
              data-variant="primary"
              onClick={() =>
                getCodes("2023-01-22", tomorrow.toLocaleDateString())
              }
            >
              All
            </button>
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
