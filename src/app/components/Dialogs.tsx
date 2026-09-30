import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  MapPin,
  CalendarDays,
  UsersRound,
  Star,
  Download,
  Heart,
  CheckCircle2,
  Compass,
  Play,
  Pause,
  ExternalLink,
  Leaf,
  Mountain,
  Coffee,
  Waves,
  Camera,
  Utensils,
} from "lucide-react"
import {
  destinations,
  packages,
  experiences,
  hotels,
  imagePath,
  formatPrice,
  today,
  type ModalState,
  type PlannerPreferences,
  type SearchCriteria,
  type TripPackage,
} from "../data"
import {
  DestinationCard,
  TripPackageCard,
  goldButton,
  outlineButton,
} from "./Sections"

type NonNullModal = Exclude<ModalState, null>
type OpenModal = (modal: ModalState) => void
type PackageDetailsProps = { trip: TripPackage } & { open: OpenModal }
type InfoContentProps = { title: string } & { open: OpenModal }
const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"

export function Dialog({
  modal,
  close,
  open,
}: {
  modal: NonNullModal
  close: () => void
  open: OpenModal
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const title =
    modal.type === "planner"
      ? "A trip that's uniquely you"
      : modal.type === "search"
        ? `Find your ${modal.criteria.tab.toLowerCase()}`
        : modal.type === "package"
          ? modal.trip.name
          : modal.type === "destinations"
            ? "Where will you go next?"
            : modal.type === "packages"
              ? "Your next great getaway"
              : modal.type === "experiences"
                ? "Go beyond the ordinary"
                : modal.type === "story"
                  ? "Made for the moments"
                  : modal.title
  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [])
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            close()
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-24px)] max-w-[860px] overflow-y-auto rounded-[24px] bg-background p-0 text-foreground shadow-2xl backdrop:bg-[#00181bb3] backdrop:backdrop-blur-sm sm:w-[calc(100%-64px)]"
    >
      <div className="sticky top-0 z-20 flex items-center justify-between gap-5 border-b border-border bg-background/95 px-6 py-5 backdrop-blur-sm sm:px-8">
        <div>
          <p className="mb-1.5 text-[9px] font-semibold tracking-[0.2em] text-[#8c7040]">
            TRIPPLANNERS · YOUR JOURNEY
          </p>
          <h2
            id="dialog-title"
            className="font-display text-[25px] leading-tight sm:text-[31px]"
          >
            {title}
          </h2>
        </div>
        <button
          autoFocus
          onClick={close}
          aria-label="Close dialog"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border hover:bg-white"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-6 sm:p-8">
        {modal.type === "planner" && (
          <TripPlanner
            initialDestination={modal.destination}
            initial={modal.initial}
          />
        )}
        {modal.type === "destinations" && (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Six places to fall in love with. Choose one to make it your own.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination.name}
                  destination={destination}
                  onClick={() =>
                    open({ type: "planner", destination: destination.name })
                  }
                />
              ))}
            </div>
          </>
        )}
        {modal.type === "packages" && (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Handpicked stays, memorable moments, and a little room for
              serendipity.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {packages.map((trip) => (
                <TripPackageCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => open({ type: "package", trip })}
                />
              ))}
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Sample package prices per person. Live availability and booking
              are not connected.
            </p>
          </>
        )}
        {modal.type === "package" && (
          <PackageDetails trip={modal.trip} open={open} />
        )}
        {modal.type === "experiences" && <ExperiencesContent open={open} />}
        {modal.type === "search" && (
          <SearchResults criteria={modal.criteria} open={open} />
        )}
        {modal.type === "story" && <OurStory />}
        {modal.type === "info" && (
          <InfoContent title={modal.title} open={open} />
        )}
      </div>
    </dialog>
  )
}

function TripPlanner({
  initialDestination,
  initial,
}: {
  initialDestination?: string
  initial?: Partial<PlannerPreferences>
}) {
  const [step, setStep] = useState(0)
  const [saved, setSaved] = useState(false)
  const [savingError, setSavingError] = useState("")
  const [savedPreferences, setSavedPreferences] =
    useState<PlannerPreferences | null>(null)
  const [preferences, setPreferences] = useState<PlannerPreferences>({
    destination: initialDestination || "",
    start: "",
    end: "",
    travelers: 2,
    budget: "50000",
    style: "Balanced",
    interests: ["Nature"],
    accommodation: "Boutique hotel",
    ...initial,
  })
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("tripplanners-saved-itinerary") || "null",
      )
      if (
        stored?.preferences &&
        destinations.some(
          (place) => place.name === stored.preferences.destination,
        )
      )
        setSavedPreferences(stored.preferences)
    } catch {
      setSavedPreferences(null)
    }
  }, [])
  const update = <Key extends keyof PlannerPreferences,>(
    key: Key,
    value: PlannerPreferences[Key],
  ) => setPreferences((current) => ({ ...current, [key]: value }))
  const destination = destinations.find(
    (place) => place.name === preferences.destination,
  )
  const numberOfDays =
    preferences.start && preferences.end
      ? Math.round(
          (new Date(preferences.end).getTime() -
            new Date(preferences.start).getTime()) /
            86400000,
        ) + 1
      : 5
  const validDates =
    (!preferences.start && !preferences.end) ||
    (!!preferences.start &&
      !!preferences.end &&
      preferences.start >= today() &&
      preferences.end >= preferences.start &&
      numberOfDays <= 14)
  const interestActivities: Record<string, string> = {
    Nature: "Take the scenic route and explore a local nature trail",
    Adventure: "Join a guided outdoor adventure suited to your comfort level",
    "Food & culture": "Visit a neighborhood market and taste a local specialty",
    Beaches: "Spend an unhurried afternoon by the water",
    Photography: "Find a beautiful viewpoint for golden-hour photography",
    Wellness: "Recharge with a gentle walk and a relaxing wellness session",
  }
  const dayPlans = Array.from(
    { length: Math.min(numberOfDays, 14) },
    (_, index) => ({
      day: index + 1,
      title:
        index === 0
          ? "Arrive & find your rhythm"
          : index === numberOfDays - 1
            ? "One more memory & homeward bound"
            : destination?.highlights[
                (index - 1) % destination.highlights.length
              ] || "Explore at your own pace",
      morning:
        index === 0
          ? `Arrive in ${preferences.destination} and settle into your ${preferences.accommodation.toLowerCase()}`
          : destination?.highlights[
              (index - 1) % destination.highlights.length
            ] || "A local discovery",
      afternoon:
        interestActivities[
          preferences.interests[
            index % Math.max(preferences.interests.length, 1)
          ] || "Nature"
        ],
      evening:
        preferences.style === "Relaxed"
          ? "A quiet dinner and time to unwind"
          : preferences.style === "Adventure-packed"
            ? "Explore the evening scene and a local night market"
            : "Dinner at a neighborhood favorite and a sunset stroll",
    }),
  )
  const itineraryText = `TRIPPLANNERS — YOUR PERSONAL TRIP PLAN\n\n${preferences.destination} · ${numberOfDays} days · ${preferences.travelers} travelers\nDates: ${preferences.start || "Flexible"} ${
    preferences.end ? `to ${preferences.end}` : ""
  }\nBudget per person: ${formatPrice(Number(preferences.budget))}\nStyle: ${preferences.style}\nInterests: ${preferences.interests.join(", ")}\nAccommodation: ${preferences.accommodation}\n\n${dayPlans.map((day) => `DAY ${day.day}: ${day.title}\nMorning: ${day.morning}\nAfternoon: ${day.afternoon}\nEvening: ${day.evening}`).join("\n\n")}\n\nThis is a suggested itinerary, not a reservation. Check local opening hours and availability. Transport timings and live prices are not included.`
  if (step === 2)
    return (
      <div>
        <div className="relative mb-6 h-44 overflow-hidden rounded-2xl">
          <img
            src={imagePath(destination?.image || "bali")}
            alt={preferences.destination}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 to-transparent" />
          <div className="absolute bottom-5 left-5 text-white">
            <p className="mb-1 text-[10px] tracking-[0.15em] text-accent">
              YOUR NEXT CHAPTER
            </p>
            <h3 className="font-display text-3xl">
              {preferences.destination}, your way.
            </h3>
          </div>
        </div>
        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white px-3 py-2">
            {numberOfDays} days
          </span>
          <span className="rounded-full bg-white px-3 py-2">
            {preferences.travelers} travelers
          </span>
          <span className="rounded-full bg-white px-3 py-2">
            {preferences.style}
          </span>
          <span className="rounded-full bg-white px-3 py-2">
            {preferences.accommodation}
          </span>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          A suggested itinerary built around your choices.{" "}
          {preferences.start
            ? `Travel dates: ${preferences.start} to ${preferences.end}.`
            : "Your dates are flexible."}{" "}
          This is a starting point, not a booking.
        </p>
        <div className="space-y-4">
          {dayPlans.map((day) => (
            <article
              key={day.day}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold">
                  {String(day.day).padStart(2, "0")}
                </span>
                <h4 className="font-semibold">{day.title}</h4>
              </div>
              <div className="ml-1 space-y-3 border-l-2 border-accent/50 pl-4 text-sm">
                <p>
                  <span className="mr-2 text-[10px] font-bold tracking-wider text-muted-foreground">
                    MORNING
                  </span>
                  {day.morning}
                </p>
                <p>
                  <span className="mr-2 text-[10px] font-bold tracking-wider text-muted-foreground">
                    AFTERNOON
                  </span>
                  {day.afternoon}
                </p>
                <p>
                  <span className="mr-2 text-[10px] font-bold tracking-wider text-muted-foreground">
                    EVENING
                  </span>
                  {day.evening}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="my-6 rounded-2xl bg-primary p-5 text-white">
          <h4 className="font-display text-xl">
            A little clarity for your budget
          </h4>
          <p className="mt-2 text-sm text-white/80">
            Planning allowance: {formatPrice(Number(preferences.budget))} per
            person ·{" "}
            {formatPrice(Number(preferences.budget) * preferences.travelers)}{" "}
            total
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            {[
              { label: "Stays · 45%", amount: 0.45 },
              { label: "Travel · 30%", amount: 0.3 },
              { label: "Experiences · 25%", amount: 0.25 },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-white/65">{item.label}</p>
                <p className="mt-1 font-semibold">
                  {formatPrice(
                    Math.round(Number(preferences.budget) * item.amount),
                  )}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-white/65">
            Suggested allocation, not a live quote. Check actual costs before
            booking.
          </p>
        </div>
        <a
          href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(preferences.destination)}`}
          target="_blank"
          rel="noreferrer"
          className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-primary"
        >
          <MapPin size={15} />
          Explore {preferences.destination} on OpenStreetMap{" "}
          <ExternalLink size={13} />
        </a>
        <div className="flex flex-wrap gap-3">
          <button
            className={goldButton}
            onClick={() => {
              const blob = new Blob([itineraryText], {
                type: "text/plain;charset=utf-8",
              })
              const url = URL.createObjectURL(blob)
              const link = document.createElement("a")
              link.href = url
              link.download = `TripPlanners-${preferences.destination}-itinerary.txt`
              link.click()
              setTimeout(() => URL.revokeObjectURL(url), 1000)
            }}
          >
            <Download size={16} />
            Download plan
          </button>
          <button
            className={outlineButton}
            onClick={() => {
              try {
                localStorage.setItem(
                  "tripplanners-saved-itinerary",
                  JSON.stringify({ preferences, dayPlans }),
                )
                setSaved(true)
                setSavingError("")
              } catch {
                setSavingError(
                  "Couldn't save on this device. You can download your plan instead.",
                )
              }
            }}
          >
            {saved ? <Check size={16} /> : <Heart size={16} />}
            {saved ? "Saved on this device" : "Save plan"}
          </button>
          <button
            className="px-3 text-xs font-semibold underline underline-offset-4"
            onClick={() => {
              setStep(0)
              setSaved(false)
            }}
          >
            Edit preferences
          </button>
        </div>
        {savingError && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {savingError}
          </p>
        )}
      </div>
    )
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (step === 0 && (!destination || !validDates)) return
        setStep(step + 1)
      }}
    >
      {step === 0 && savedPreferences && (
        <button
          type="button"
          onClick={() => {
            setPreferences(savedPreferences)
            setStep(2)
            setSaved(true)
          }}
          className="mb-5 flex w-full items-center justify-between rounded-xl border border-accent/70 bg-accent/10 px-4 py-3 text-left text-xs"
        >
          <span>
            <span className="font-semibold">
              Your {savedPreferences.destination} adventure is waiting.
            </span>
            <br />
            <span className="mt-1 block text-muted-foreground">
              Open your saved itinerary from this device
            </span>
          </span>
          <ArrowRight size={17} />
        </button>
      )}
      <div className="mb-7 flex gap-3">
        {["The essentials", "Your travel style", "Your itinerary"].map(
          (label, index) => (
            <div key={label} className="flex-1">
              <div
                className={`mb-2 h-1 rounded-full ${
                  index <= step ? "bg-accent" : "bg-border"
                }`}
              />
              <span
                className={`text-[10px] ${
                  index === step
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {index + 1}. {label}
              </span>
            </div>
          ),
        )}
      </div>
      {step === 0 ? (
        <>
          <p className="mb-5 text-sm text-muted-foreground">
            Start with the big picture. We'll take care of the little details.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-xs font-semibold sm:col-span-2">
              Where's your next adventure?
              <select
                required
                value={preferences.destination}
                onChange={(event) => update("destination", event.target.value)}
                className={inputClass}
              >
                <option value="">Choose a destination</option>
                {destinations.map((place) => (
                  <option key={place.name} value={place.name}>
                    {place.name} · {place.region}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold">
              Departure date{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
              <input
                type="date"
                value={preferences.start}
                min={today()}
                onChange={(event) => {
                  update("start", event.target.value)
                  if (preferences.end < event.target.value) update("end", "")
                }}
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold">
              Return date{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
              <input
                type="date"
                value={preferences.end}
                min={preferences.start || today()}
                onChange={(event) => update("end", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold">
              Number of travelers
              <input
                required
                type="number"
                min={1}
                max={12}
                value={preferences.travelers}
                onChange={(event) =>
                  update("travelers", Number(event.target.value))
                }
                className={inputClass}
              />
            </label>
            <label className="text-xs font-semibold">
              Budget per person
              <select
                value={preferences.budget}
                onChange={(event) => update("budget", event.target.value)}
                className={inputClass}
              >
                {[
                  ...new Set([
                    25000,
                    50000,
                    75000,
                    100000,
                    150000,
                    Number(preferences.budget),
                  ]),
                ]
                  .sort((first, second) => first - second)
                  .map((budget) => (
                    <option value={budget} key={budget}>
                      {formatPrice(budget)}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          {!validDates && (
            <p role="alert" className="mt-4 text-xs text-destructive">
              Choose both dates in order, up to 14 days apart, or leave both
              blank for a flexible trip.
            </p>
          )}
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-accent/15 p-3 text-xs text-[#81622e]">
            <CalendarDays size={16} />
            Dates not decided? Leave them blank for a flexible 5-day itinerary.
          </div>
        </>
      ) : (
        <>
          <h3 className="font-display text-2xl">How do you like to travel?</h3>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "Relaxed", icon: Coffee },
              { label: "Balanced", icon: Compass },
              { label: "Adventure-packed", icon: Mountain },
            ].map(({ label, icon: Icon }) => (
              <button
                type="button"
                key={label}
                aria-pressed={preferences.style === label}
                onClick={() => update("style", label)}
                className={`flex flex-col items-center gap-3 rounded-xl border p-4 text-center text-xs ${
                  preferences.style === label
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white"
                }`}
              >
                <Icon size={22} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
          <h3 className="mt-7 text-sm font-semibold">
            What makes you happy?{" "}
            <span className="font-normal text-muted-foreground">
              Pick a few.
            </span>
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "Nature", icon: Leaf },
              { label: "Adventure", icon: Mountain },
              { label: "Food & culture", icon: Utensils },
              { label: "Beaches", icon: Waves },
              { label: "Photography", icon: Camera },
              { label: "Wellness", icon: Heart },
            ].map(({ label, icon: Icon }) => (
              <button
                type="button"
                key={label}
                aria-pressed={preferences.interests.includes(label)}
                onClick={() =>
                  update(
                    "interests",
                    preferences.interests.includes(label)
                      ? preferences.interests.filter(
                          (interest) => interest !== label,
                        )
                      : [...preferences.interests, label],
                  )
                }
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs ${
                  preferences.interests.includes(label)
                    ? "border-accent bg-accent/25"
                    : "border-border bg-white"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <label className="mt-7 block text-xs font-semibold">
            Your ideal place to stay
            <select
              value={preferences.accommodation}
              onChange={(event) => update("accommodation", event.target.value)}
              className={inputClass}
            >
              {[
                "Boutique hotel",
                "Luxury resort",
                "Local homestay",
                "Budget-friendly stay",
              ].map((stay) => (
                <option key={stay}>{stay}</option>
              ))}
            </select>
          </label>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            We'll use your destination, trip length, interests, travel pace and
            accommodation choice to build a suggested day-by-day plan.
          </p>
        </>
      )}
      <div className="mt-8 flex items-center justify-between">
        {step === 1 ? (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">
            No bookings. No commitments.
          </span>
        )}
        <button
          type="submit"
          disabled={step === 0 && (!destination || !validDates)}
          className={goldButton}
        >
          {step === 0 ? "Make it mine" : "Create my itinerary"}
          <ArrowRight size={17} />
        </button>
      </div>
    </form>
  )
}

function PackageDetails({ trip, open }: PackageDetailsProps) {
  const destination = destinations.find(
    (place) => place.name === trip.destination,
  )!
  return (
    <div>
      <img
        src={imagePath(trip.image)}
        alt={trip.name}
        className="max-h-72 w-full rounded-2xl object-cover"
      />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} />
          {trip.route}
        </p>
        <span className="flex items-center gap-1 text-sm">
          <Star size={15} fill="currentColor" className="text-[#e8ab21]" />
          {trip.rating}{" "}
          <span className="text-xs text-muted-foreground">
            ({trip.reviews} reviews)
          </span>
        </span>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        {destination.description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          `${trip.days} Days · ${trip.days - 1} Nights`,
          "Handpicked stays",
          "Local experiences",
          "On-trip support",
        ].map((label) => (
          <span
            key={label}
            className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[11px]"
          >
            <CheckCircle2 size={14} className="text-[#619c75]" />
            {label}
          </span>
        ))}
      </div>
      <h3 className="mt-7 font-display text-2xl">A taste of your journey</h3>
      <div className="mt-4 space-y-3">
        {destination.highlights.slice(0, trip.days).map((highlight, index) => (
          <div
            key={highlight}
            className="flex items-center gap-4 rounded-xl border border-border bg-white px-4 py-3"
          >
            <span className="text-xs font-semibold text-[#a47832]">
              DAY {index + 1}
            </span>
            <span className="text-sm">{highlight}</span>
          </div>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-6">
        <div>
          <p className="text-xs text-muted-foreground">
            Starting from, per person
          </p>
          <p className="mt-1 text-3xl font-semibold">
            {formatPrice(trip.price)}
          </p>
        </div>
        <button
          className={goldButton}
          onClick={() =>
            open({
              type: "planner",
              destination: trip.destination,
              initial: { budget: String(trip.price) },
            })
          }
        >
          Personalize this trip <ArrowRight size={17} />
        </button>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        This is a sample curated package. Prices are indicative; live
        availability, payments, and booking are not connected. International
        flights are not included.
      </p>
    </div>
  )
}

function SearchResults({
  criteria,
  open,
}: {
  criteria: SearchCriteria
  open: OpenModal
}) {
  const query = criteria.destination.trim().toLowerCase()
  const matches = (destination: string, name = "") => {
    const place = destinations.find((item) => item.name === destination)
    return (
      !query ||
      `${destination} ${name} ${place?.region || ""}`
        .toLowerCase()
        .includes(query)
    )
  }
  const places = destinations.filter((place) => matches(place.name))
  const matchingHotels = hotels.filter((hotel) =>
    matches(hotel.destination, hotel.name),
  )
  const matchingExperiences = experiences.filter((experience) =>
    matches(experience.destination, experience.name),
  )
  const count =
    criteria.tab === "Places"
      ? places.length
      : criteria.tab === "Hotels"
        ? matchingHotels.length
        : matchingExperiences.length
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="rounded-full bg-white px-3 py-2">
          {count} {count === 1 ? "result" : "results"}
          {query ? ` for “${criteria.destination}”` : " to inspire you"}
        </span>
        <span className="flex items-center gap-1">
          <UsersRound size={14} />
          {criteria.travelers} travelers
        </span>
        {criteria.start && (
          <span className="flex items-center gap-1">
            <CalendarDays size={14} />
            {criteria.start} – {criteria.end}
          </span>
        )}
      </div>
      {count === 0 ? (
        <div className="py-12 text-center">
          <Compass
            className="mx-auto mb-5 text-primary"
            size={40}
            strokeWidth={1}
          />
          <h3 className="font-display text-2xl">
            A little further off the beaten path.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            We don't have {criteria.tab.toLowerCase()} for that destination yet.
            Try Bali, Switzerland, Kerala, Dubai, Thailand or Maldives.
          </p>
          <button
            onClick={() =>
              open({
                type: "search",
                criteria: { ...criteria, destination: "" },
              })
            }
            className={`${goldButton} mt-6`}
          >
            Explore all {criteria.tab.toLowerCase()} <ArrowRight size={17} />
          </button>
        </div>
      ) : criteria.tab === "Places" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {places.map((place) => (
            <DestinationCard
              key={place.name}
              destination={place}
              onClick={() =>
                open({
                  type: "planner",
                  destination: place.name,
                  initial: {
                    start: criteria.start,
                    end: criteria.end,
                    travelers: criteria.travelers,
                  },
                })
              }
            />
          ))}
        </div>
      ) : criteria.tab === "Hotels" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {matchingHotels.map((hotel) => (
              <article
                key={hotel.name}
                className="overflow-hidden rounded-2xl bg-white"
              >
                <img
                  src={imagePath(hotel.image)}
                  alt={`${hotel.name} in ${hotel.destination}`}
                  className="aspect-[1.7] w-full object-cover"
                />
                <div className="p-5">
                  <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    {hotel.destination}
                  </p>
                  <h3 className="text-base font-semibold">{hotel.name}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {hotel.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-lg font-semibold">
                      {formatPrice(hotel.price)}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        / night
                      </span>
                    </p>
                    <button
                      aria-label={`Plan a stay at ${hotel.name}`}
                      onClick={() =>
                        open({
                          type: "planner",
                          destination: hotel.destination,
                          initial: {
                            start: criteria.start,
                            end: criteria.end,
                            travelers: criteria.travelers,
                          },
                        })
                      }
                      className="rounded-full bg-accent p-2"
                    >
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Illustrative stays and nightly prices. Availability is not live;
            dates and travelers are planning preferences.
          </p>
        </>
      ) : (
        <ExperiencesContent open={open} items={matchingExperiences} />
      )}
    </>
  )
}

function ExperiencesContent({
  open,
  items = experiences,
}: {
  open: OpenModal
  items?: typeof experiences
}) {
  return (
    <>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        The stories you'll tell long after the suitcase is unpacked.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {items.map((experience) => (
          <article
            className="overflow-hidden rounded-2xl bg-white"
            key={experience.name}
          >
            <img
              src={imagePath(experience.image)}
              alt={`${experience.type} experience in ${experience.destination}`}
              loading="lazy"
              className="aspect-[1.7] w-full object-cover"
            />
            <div className="p-5">
              <p className="mb-2 text-[10px] font-semibold tracking-wider text-[#a5772d]">
                {experience.destination.toUpperCase()} ·{" "}
                {experience.type.toUpperCase()}
              </p>
              <h3 className="font-display text-xl">{experience.name}</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {experience.description}
              </p>
              <button
                className="mt-5 flex items-center gap-2 text-xs font-semibold text-primary"
                onClick={() =>
                  open({ type: "planner", destination: experience.destination })
                }
              >
                Add to my adventure <ArrowRight size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function OurStory() {
  const [slide, setSlide] = useState(0)
  const [playing, setPlaying] = useState(true)
  const moments = [
    {
      image: "planner",
      title: "It starts with a little curiosity.",
      description:
        "A map on the table. A place you've always dreamed of. The feeling that it's time to go.",
    },
    {
      image: "backpacker",
      title: "And becomes something bigger.",
      description:
        "We believe the best trips aren't measured in miles, but in the moments that make you feel alive.",
    },
    {
      image: "experience",
      title: "Bring home more than souvenirs.",
      description:
        "TripPlanners brings the places, people, and little details together — so you can be fully there.",
    },
  ]
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(
      () => setSlide((current) => (current + 1) % moments.length),
      5000,
    )
    return () => clearInterval(interval)
  }, [playing])
  return (
    <div>
      <div className="relative aspect-[1.65] overflow-hidden rounded-2xl">
        <img
          src={imagePath(moments[slide].image)}
          alt={moments[slide].title}
          className="size-full object-cover"
        />
        <button
          aria-label={playing ? "Pause story" : "Play story"}
          onClick={() => setPlaying(!playing)}
          className="absolute right-4 bottom-4 rounded-full bg-white p-3"
        >
          {playing ? <Pause size={17} /> : <Play size={17} />}
        </button>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {moments.map((moment, index) => (
          <button
            key={moment.title}
            aria-label={`Story moment ${index + 1}`}
            aria-pressed={index === slide}
            onClick={() => {
              setSlide(index)
              setPlaying(false)
            }}
            className={`h-1.5 w-9 rounded-full ${
              index === slide ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
      <h3 className="mt-6 font-display text-3xl">{moments[slide].title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {moments[slide].description}
      </p>
    </div>
  )
}

function TravelerProfile() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState("")
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("tripplanners-profile") || "null",
      )
      if (saved?.name) {
        setName(saved.name)
        setEmail(saved.email)
        setComplete(true)
      }
    } catch {
      setError("Your saved profile couldn't be read. You can create it again.")
    }
  }, [])
  return complete ? (
    <div className="py-5 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent font-display text-3xl">
        {name.slice(0, 1).toUpperCase()}
      </div>
      <h3 className="mt-5 font-display text-3xl">
        Adventure looks good on you, {name.split(" ")[0]}.
      </h3>
      <p className="mt-3 text-sm text-muted-foreground">{email}</p>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Your profile is saved on this device only. Cloud accounts and Firebase
        authentication are not connected.
      </p>
      <button
        onClick={() => {
          try {
            localStorage.removeItem("tripplanners-profile")
            setComplete(false)
            setName("")
            setEmail("")
          } catch {
            setError(
              "Couldn't clear this profile. Check your browser storage settings.",
            )
          }
        }}
        className={`${outlineButton} mt-6`}
      >
        Clear local profile
      </button>
      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  ) : (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        try {
          localStorage.setItem(
            "tripplanners-profile",
            JSON.stringify({ name: name.trim(), email: email.trim() }),
          )
          setComplete(true)
          setError("")
        } catch {
          setError(
            "Couldn't save your profile. Your browser may have storage disabled.",
          )
        }
      }}
    >
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Keep a little corner of your travels on this device. This is a local
        profile, not an authenticated account.
      </p>
      <label className="block text-xs font-semibold">
        Your name
        <input
          required
          minLength={2}
          maxLength={60}
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
          placeholder="What should we call you?"
        />
      </label>
      <label className="mt-5 block text-xs font-semibold">
        Email address
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
          placeholder="you@example.com"
        />
      </label>
      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}
      <button type="submit" className={`${goldButton} mt-7`}>
        Continue on this device <ArrowRight size={17} />
      </button>
    </form>
  )
}

function InfoContent({ title, open }: InfoContentProps) {
  if (title === "Your Traveler Profile") return <TravelerProfile />
  const articles = [
    {
      title: "A slower kind of Bali",
      image: "bali",
      body: "Start early in Ubud, before the heat and crowds arrive. Walk the rice terraces, stop for coffee at a family-run café, and leave an afternoon free for the unexpected. When you head to the coast, choose one beach and stay for sunset rather than trying to see them all. A local cooking class is a lovely way to understand the island beyond its postcard views.",
    },
    {
      title: "Your first Alpine adventure",
      image: "switzerland",
      body: "Pack layers, even in summer: mountain weather can change quickly. Base yourself near a rail connection and explore by train rather than trying to drive every mountain pass. Leave a flexible day for your high-altitude excursion, check weather and trail conditions locally, and take the scenic route when you can. The lakes are every bit as memorable as the peaks.",
    },
    {
      title: "The art of doing less in Kerala",
      image: "kerala",
      body: "A night on the backwaters is an invitation to slow down. Choose a responsible houseboat operator, ask about waste practices, and savor a freshly cooked meal onboard. Balance your time on the water with the cooler air of Munnar's tea country. A guided spice garden walk is a small experience that stays with you long after the trip.",
    },
  ]
  const article = articles.find((item) => item.title === title)
  if (article)
    return (
      <>
        <img
          src={imagePath(article.image)}
          alt={article.title}
          className="mb-6 aspect-[2] w-full rounded-2xl object-cover"
        />
        <p className="text-[15px] leading-8 text-[#606966]">{article.body}</p>
        <button
          className={`${goldButton} mt-7`}
          onClick={() =>
            open({
              type: "planner",
              destination:
                article.image === "bali"
                  ? "Bali"
                  : article.image === "kerala"
                    ? "Kerala"
                    : "Switzerland",
            })
          }
        >
          Turn inspiration into a plan <ArrowRight size={16} />
        </button>
      </>
    )
  if (title === "Travel Journal")
    return (
      <>
        <p className="mb-6 text-sm text-muted-foreground">
          Field notes, thoughtful advice, and reasons to take the scenic route.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          {articles.map((item) => (
            <button
              key={item.title}
              className="overflow-hidden rounded-xl bg-white text-left"
              onClick={() => open({ type: "info", title: item.title })}
            >
              <img
                src={imagePath(item.image)}
                alt={item.title}
                className="aspect-[1.3] w-full object-cover"
              />
              <div className="p-4">
                <p className="mb-2 text-[10px] tracking-wider text-muted-foreground">
                  THE TRAVEL JOURNAL
                </p>
                <h3 className="font-display text-xl">{item.title}</h3>
                <p className="mt-4 flex items-center gap-2 text-xs font-semibold">
                  Read the story <ArrowRight size={14} />
                </p>
              </div>
            </button>
          ))}
        </div>
      </>
    )
  if (title === "Contact")
    return (
      <div className="space-y-5 text-sm leading-relaxed">
        <p className="text-muted-foreground">
          Have a trip in mind? Begin with our planner and create a personalized
          itinerary you can save or download.
        </p>
        <button
          className={goldButton}
          onClick={() => open({ type: "planner" })}
        >
          <Compass size={17} />
          Start planning
        </button>
        <div className="rounded-xl border border-border bg-white p-5">
          <p className="font-semibold">Preview support information</p>
          <p className="mt-2 text-xs text-muted-foreground">
            A company support email and live support service have not been
            configured for this preview.
          </p>
        </div>
      </div>
    )
  if (title === "Privacy Policy")
    return (
      <div className="space-y-5 text-sm leading-7 text-muted-foreground">
        <p>
          This website is an interactive frontend preview. Your traveler
          profile, saved itinerary and newsletter preference are stored in your
          browser's local storage, not sent to a company database.
        </p>
        <h3 className="font-semibold text-foreground">Your control</h3>
        <p>
          You can clear your local profile from the profile dialog, or remove
          all saved data using your browser's site-data settings. This preview
          does not collect payment details or use an authentication service.
        </p>
        <h3 className="font-semibold text-foreground">External services</h3>
        <p>
          Google Fonts is used for typography. External social and OpenStreetMap
          links open third-party sites with their own privacy policies. A
          finalized legal policy is required before commercial launch.
        </p>
      </div>
    )
  if (title === "Terms & Conditions")
    return (
      <div className="space-y-5 text-sm leading-7 text-muted-foreground">
        <p>
          This is a travel-planning frontend preview, not a live booking
          service. Package prices, hotel names, traveler reviews and
          availability are illustrative content.
        </p>
        <p>
          Generated itineraries are suggestions based on your inputs and a
          curated destination catalog. Check local conditions, opening hours,
          visas, insurance and actual prices independently before traveling.
        </p>
        <p>
          No reservation or payment is made through this preview. A finalized
          set of commercial terms is required before accepting bookings.
        </p>
      </div>
    )
  return (
    <>
      <img
        src={imagePath("experience")}
        alt="A hiker finding a new perspective in the mountains"
        className="mb-6 aspect-[2] w-full rounded-2xl object-cover"
      />
      <h3 className="font-display text-3xl">Collect moments, not things.</h3>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        TripPlanners is built around a simple idea: a great trip should feel
        like you. We bring inspiring places, thoughtful itineraries and local
        discoveries together so the planning feels as good as the adventure.
      </p>
      <button
        className={`${goldButton} mt-6`}
        onClick={() => open({ type: "planner" })}
      >
        Find your next chapter <ArrowRight size={16} />
      </button>
    </>
  )
}
