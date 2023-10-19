import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogPortal,
  DialogClose,
} from "@/components/Dialog/Dialog"

let now = new Date()
now = now.toLocaleDateString()

let allDates = new Date("2023-01-22")
allDates = allDates.toLocaleDateString()

export default function ReleaseStats({ release }) {
  const [open, setOpen] = useState(false)
  const [redeemedCodes, setRedeemedCodes] = useState({
    count: 0,
    period: "none selected",
  })
  const [labels, setLabels] = useState()
  const [chartData, setChartData] = useState()
  const supabase = createClientComponentClient()

  async function getCodes(startDate, endDate, period) {
    try {
      let { count, error } = await supabase
        .from("codes")
        .select("redeemed_at", { count: "exact", head: true })
        .eq("release_id", release.id)
        .eq("redeemed", true)
        .gte("redeemed_at", startDate)
        .lte("redeemed_at", endDate)

      if (count) {
        setRedeemedCodes({ count: count, period: period })
      } else if (count === 0) {
        setRedeemedCodes({ count: 0, period: period })
      }

      if (error) throw error
    } catch (error) {
      throw error
    }
  }

  function getPastDate(days) {
    let date = new Date(now)
    date.setDate(date.getDate() - days)

    return date.toLocaleDateString()
  }

  const statsFrom = [
    {
      label: "Today",
      start: now,
      end: now,
    },
    {
      label: "Yesterday",
      start: getPastDate(1),
      end: getPastDate(1),
    },
    {
      label: "7 Days",
      start: getPastDate(7),
      end: now,
    },
    {
      label: "14 Days",
      start: getPastDate(14),
      end: now,
    },
    {
      label: "30 Days",
      start: getPastDate(30),
      end: now,
    },
    {
      label: "All",
      start: allDates,
      end: now,
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
          <p>Codes redeemed for selected period: {redeemedCodes.period}</p>
          <h4 className="text-4 intrinsic-center">{redeemedCodes.count}</h4>
          <div className="flex-grid">
            {statsFrom.map((time) => (
              <button
                key={time.label}
                className="button"
                data-variant="primary"
                onClick={() => getCodes(time.start, time.end, time.label)}
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
