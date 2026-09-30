import { useState } from "react"
import {
  MapPin,
  CalendarDays,
  UsersRound,
  Search,
  Hotel,
  Tickets,
  Minus,
  Plus,
} from "lucide-react"
import { destinations, today, type SearchCriteria } from "../data"

export default function TravelSearch({
  onSearch,
}: {
  onSearch: (criteria: SearchCriteria) => void
}) {
  const [tab, setTab] = useState<SearchCriteria["tab"]>("Places")
  const [destination, setDestination] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [travelers, setTravelers] = useState(2)
  const [popover, setPopover] = useState<"dates" | "travelers" | null>(null)
  const [error, setError] = useState("")

  return (
    <div className="relative z-20 mt-7 w-full max-w-[780px] text-foreground sm:mt-8">
      <div
        role="tablist"
        aria-label="Travel search category"
        className="flex w-fit rounded-t-[18px] bg-[#06292ce6]"
      >
        {([
          { label: "Places", icon: MapPin },
          { label: "Hotels", icon: Hotel },
          { label: "Experiences", icon: Tickets },
        ] as const).map(({ label, icon: Icon }) => (
          <button
            key={label}
            id={`tab-${label}`}
            type="button"
            role="tab"
            aria-selected={tab === label}
            aria-controls="travel-search-panel"
            onClick={() => setTab(label)}
            className={`flex items-center gap-1.5 rounded-t-[17px] px-3 py-3.5 text-[11px] font-medium transition-colors sm:gap-2 sm:px-7 sm:text-xs ${
              tab === label
                ? "bg-white text-foreground"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            <Icon size={15} strokeWidth={1.7} />
            {label}
          </button>
        ))}
      </div>
      <form
        id="travel-search-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        onSubmit={(event) => {
          event.preventDefault()
          if (start && !end) {
            setPopover("dates")
            setError("Please add a return date.")
            return
          }
          setError("")
          setPopover(null)
          onSearch({ destination, start, end, travelers, tab })
        }}
        className="relative flex flex-col rounded-b-[22px] rounded-tr-[22px] bg-white p-2 shadow-[0_12px_40px_#00000018] sm:flex-row sm:items-center sm:rounded-b-full sm:rounded-tr-full sm:p-2.5"
      >
        <label className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 sm:px-5 sm:py-2">
          <MapPin size={19} strokeWidth={1.6} className="shrink-0" />
          <span className="sr-only">Destination</span>
          <input
            id="destination-search"
            list="travel-destinations"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder={
              tab === "Hotels"
                ? "Where do you want to stay?"
                : "Where do you want to go?"
            }
            className="w-full min-w-0 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <datalist id="travel-destinations">
            {destinations.map((place) => (
              <option value={place.name} key={place.name} />
            ))}
          </datalist>
        </label>
        <div className="relative border-t border-border sm:border-t-0 sm:border-l">
          <button
            type="button"
            aria-expanded={popover === "dates"}
            onClick={() => setPopover(popover === "dates" ? null : "dates")}
            className="flex w-full items-center gap-3 px-4 py-4 text-[13px] text-muted-foreground sm:px-5 sm:py-2"
          >
            <CalendarDays
              size={19}
              className="text-foreground"
              strokeWidth={1.6}
            />
            <span>
              {start
                ? new Date(`${start}T12:00:00`).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                  }) +
                  (end
                    ? ` – ${new Date(`${end}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}`
                    : "")
                : "Add dates"}
            </span>
          </button>
          {popover === "dates" && (
            <div className="absolute top-full left-0 z-30 mt-5 w-[280px] rounded-2xl border border-border bg-white p-5 shadow-xl sm:left-1/2 sm:-translate-x-1/2">
              <p className="mb-4 text-sm font-semibold">
                When are you heading out?
              </p>
              <label className="block text-xs text-muted-foreground">
                Departure
                <input
                  aria-label="Departure date"
                  type="date"
                  min={today()}
                  value={start}
                  onChange={(event) => {
                    setStart(event.target.value)
                    if (end < event.target.value) setEnd("")
                  }}
                  className="mt-1.5 mb-3 w-full rounded-lg border border-border p-2.5 text-sm text-foreground"
                />
              </label>
              <label className="block text-xs text-muted-foreground">
                Return
                <input
                  aria-label="Return date"
                  type="date"
                  min={start || today()}
                  value={end}
                  onChange={(event) => setEnd(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border p-2.5 text-sm text-foreground"
                />
              </label>
              {error && (
                <p role="alert" className="mt-2 text-xs text-destructive">
                  {error}
                </p>
              )}
              <button
                type="button"
                disabled={!start || !end}
                onClick={() => {
                  setPopover(null)
                  setError("")
                }}
                className="mt-4 w-full rounded-full bg-accent py-2 text-sm font-semibold disabled:opacity-40"
              >
                Done
              </button>
            </div>
          )}
        </div>
        <div className="relative flex items-center justify-between border-t border-border sm:border-t-0 sm:border-l">
          <button
            type="button"
            aria-expanded={popover === "travelers"}
            onClick={() =>
              setPopover(popover === "travelers" ? null : "travelers")
            }
            className="flex items-center gap-3 px-4 py-4 text-[13px] text-muted-foreground sm:px-5 sm:py-2"
          >
            <UsersRound
              size={19}
              className="text-foreground"
              strokeWidth={1.6}
            />
            {travelers} {travelers === 1 ? "Traveler" : "Travelers"}
          </button>
          <button
            type="submit"
            aria-label={`Search ${tab.toLowerCase()}`}
            className="group flex size-12 shrink-0 items-center justify-center rounded-full bg-accent transition-colors hover:bg-[#f4b73a] sm:size-[54px]"
          >
            <Search
              size={22}
              strokeWidth={1.7}
              className="transition-transform group-hover:scale-110"
            />
          </button>
          {popover === "travelers" && (
            <div className="absolute top-full right-0 z-30 mt-5 w-[250px] rounded-2xl border border-border bg-white p-5 shadow-xl">
              <p className="text-sm font-semibold">Who's coming along?</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Travelers of all ages
              </p>
              <div className="mt-5 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Remove traveler"
                  disabled={travelers <= 1}
                  onClick={() => setTravelers(travelers - 1)}
                  className="rounded-full border border-border p-2 disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold">{travelers}</span>
                <button
                  type="button"
                  aria-label="Add traveler"
                  disabled={travelers >= 12}
                  onClick={() => setTravelers(travelers + 1)}
                  className="rounded-full border border-border p-2 disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setPopover(null)}
                className="mt-4 w-full rounded-full bg-accent py-2 text-sm font-semibold"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
