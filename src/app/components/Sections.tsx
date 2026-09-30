import { useEffect, useState } from "react"
import {
  ArrowRight,
  Mountain,
  Search,
  Menu,
  X,
  Send,
  Play,
  Star,
  Map,
  Headset,
  ShoppingBag,
  ClipboardCheck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook,
  Linkedin,
  Flame,
  Check,
  Plane,
  Heart,
} from "lucide-react"
import {
  destinations,
  packages,
  testimonials,
  imagePath,
  formatPrice,
  type Destination,
  type TripPackage,
  type ModalState,
  type SearchCriteria,
} from "../data"
import TravelSearch from "./TravelSearch"

type OpenModal = (modal: ModalState) => void
export const container =
  "mx-auto w-[calc(100%-40px)] max-w-[1250px] sm:w-[calc(100%-80px)] lg:w-[calc(100%-144px)]"
export const outlineButton =
  "group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#ccc9c2] px-5 py-3 text-xs font-semibold transition-colors hover:border-primary hover:bg-primary hover:text-white sm:px-6"
export const goldButton =
  "group inline-flex items-center justify-center gap-3 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-[#f4bb46] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="#home"
      aria-label="TripPlanners home"
      className={`inline-flex shrink-0 items-center gap-1 text-[15px] font-bold sm:gap-1.5 sm:text-[19px] ${
        dark ? "text-foreground" : "text-white"
      }`}
    >
      <Mountain size={32} strokeWidth={2.4} className="size-6 sm:size-8" />
      <span>TripPlanners</span>
    </a>
  )
}

export function Navbar({ open }: { open: OpenModal }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  const links = [
    { label: "Destinations", href: "#destinations" },
    { label: "Trip Planner", href: "#planner" },
    { label: "Packages", href: "#packages" },
    { label: "Experiences", href: "#experiences" },
  ]
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "bg-background/97 text-foreground shadow-sm backdrop-blur-md"
          : "bg-transparent text-white"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className={`${container} flex h-20 items-center justify-between gap-5 lg:h-[90px]`}
      >
        <Logo dark={scrolled || menuOpen} />
        <div className="hidden items-center gap-6 text-xs font-medium lg:flex xl:gap-7">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative py-2 after:absolute after:right-full after:bottom-0 after:left-0 after:h-px after:bg-current after:transition-all hover:after:right-0"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => open({ type: "info", title: "Travel Journal" })}
            className="transition-opacity hover:opacity-70"
          >
            Blogs
          </button>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            aria-label="Search destinations"
            onClick={() => {
              document.getElementById("home")?.scrollIntoView()
              window.setTimeout(
                () => document.getElementById("destination-search")?.focus(),
                400,
              )
            }}
            className="hidden size-10 items-center justify-center rounded-full border border-current/30 transition-colors hover:bg-white/15 md:flex"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button
            onClick={() =>
              open({ type: "info", title: "Your Traveler Profile" })
            }
            className="hidden rounded-full bg-white px-5 py-3 text-xs font-semibold text-foreground md:block"
          >
            Sign In
          </button>
          <button
            onClick={() => open({ type: "planner" })}
            className="rounded-full bg-accent px-4 py-3 text-xs font-semibold text-accent-foreground transition-colors hover:bg-[#f4b73a] sm:px-5"
          >
            Plan My Trip
          </button>
          <button
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 lg:hidden"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 lg:hidden">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-border py-4 text-sm"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false)
              open({ type: "info", title: "Travel Journal" })
            }}
            className="block py-4 text-sm"
          >
            Blogs
          </button>
          <button
            onClick={() => {
              setMenuOpen(false)
              open({ type: "info", title: "Your Traveler Profile" })
            }}
            className="text-sm font-semibold"
          >
            Sign In
          </button>
        </div>
      )}
    </header>
  )
}

export function Stats() {
  return (
    <div className="flex gap-6 sm:gap-12">
      {[
        { value: "500+", label: "Destinations" },
        { value: "50K+", label: "Happy Travelers" },
        { value: "4.8", label: "Average Rating" },
      ].map((stat) => (
        <div key={stat.label}>
          <div className="flex items-center gap-1 text-xl font-semibold text-accent sm:text-[23px]">
            {stat.value}
            {stat.value === "4.8" && (
              <Star size={17} fill="currentColor" strokeWidth={0} />
            )}
          </div>
          <p className="mt-0.5 text-[10px] text-white/85 sm:text-xs">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export function Hero({
  open,
  onSearch,
}: {
  open: OpenModal
  onSearch: (criteria: SearchCriteria) => void
}) {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[780px] flex-col bg-[#173b40] text-white sm:min-h-[660px] lg:min-h-[min(55vw,790px)]"
    >
      <img
        src={imagePath("backpacker")}
        srcSet={`${imagePath("backpacker-small")} 900w, ${imagePath("backpacker")} 1672w`}
        sizes="100vw"
        alt="Traveler wearing a hat and backpack overlooking coastal cliffs and the ocean at sunset"
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover object-[68%_center] sm:object-center"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#05272da8] via-[#072a2e33] to-transparent" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-[#0719178c] via-transparent to-[#071e2220]" />
      <div
        className={`${container} relative flex flex-1 flex-col pt-[125px] pb-8 sm:pt-[135px] lg:pt-[clamp(130px,9.4vw,154px)] lg:pb-11`}
      >
        <p className="mb-5 text-[10px] font-semibold tracking-[0.24em] text-[#f3e6c8] sm:text-xs">
          PLAN · EXPLORE · EXPERIENCE
        </p>
        <h1 className="font-display text-[clamp(52px,6.35vw,91px)] leading-[1.035] font-medium tracking-[-0.025em]">
          Your Next
          <br />
          Adventure
          <br />
          <span className="text-accent">Starts Here</span>
        </h1>
        <p className="mt-5 max-w-[455px] text-sm leading-[1.7] text-white/95 sm:mt-4 sm:text-[16px]">
          Personalized itineraries, handpicked stays, and unique
          <br className="hidden sm:block" /> experiences — all in one place.
        </p>
        <TravelSearch onSearch={onSearch} />
        <div className="mt-7 flex items-end justify-between gap-4 sm:mt-8 lg:mt-9">
          <Stats />
          <button
            onClick={() => open({ type: "story" })}
            className="group hidden items-center gap-3 pb-1 text-xs font-medium sm:flex"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-white text-foreground transition-transform group-hover:scale-110">
              <Play size={14} fill="currentColor" />
            </span>
            Watch Our Story
          </button>
        </div>
        <div
          aria-hidden="true"
          className="absolute top-[230px] right-0 hidden -rotate-6 font-handwritten text-[39px] leading-[0.9] text-white/95 lg:block xl:top-[245px]"
        >
          <span className="mb-3 block text-xl text-accent">✧</span>Collect
          <br />
          Moments,
          <br />
          Not Things
          <span className="mt-3 block text-center text-3xl text-accent">
            ⌁ ♡
          </span>
        </div>
      </div>
    </section>
  )
}

function SectionHeading({
  title,
  description,
  icon,
  action,
  actionLabel,
}: {
  title: string
  description: string
  icon?: "plane" | "fire" | "message"
  action?: () => void
  actionLabel?: string
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 sm:mb-7">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-[29px] leading-tight font-medium tracking-[-0.025em] sm:text-[35px] lg:text-[39px]">
            {icon === "fire" && (
              <Flame
                className="mr-2 inline-block text-[#f16848]"
                size={31}
                strokeWidth={1.7}
              />
            )}
            {title}
          </h2>
          {icon === "plane" && (
            <Send
              size={36}
              strokeWidth={1.1}
              className="hidden -rotate-6 sm:block"
            />
          )}
          {icon === "message" && (
            <MessageCircle
              size={32}
              strokeWidth={1.3}
              className="hidden sm:block"
            />
          )}
        </div>
        <p className="mt-2 text-xs text-[#626767] sm:text-sm">{description}</p>
      </div>
      {action && (
        <div className="hidden sm:block">
          <button onClick={action} className={outlineButton}>
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export function DestinationCard({
  destination,
  onClick,
}: {
  destination: Destination
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[0.72] w-full overflow-hidden rounded-[13px] text-left text-white sm:aspect-[0.73]"
    >
      <img
        src={imagePath(destination.image)}
        alt={`${destination.name}: ${destination.description.split(".")[0]}`}
        loading="lazy"
        width={400}
        height={560}
        className="size-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4 lg:p-5">
        <span>
          <span className="block text-[17px] font-semibold lg:text-xl">
            {destination.name}
          </span>
          <span className="mt-1 block text-[11px] text-white/90 lg:text-xs">
            {destination.region}
          </span>
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-foreground transition-colors group-hover:bg-accent lg:size-9">
          <ArrowRight size={18} strokeWidth={1.8} />
        </span>
      </span>
    </button>
  )
}

export function PopularDestinations({ open }: { open: OpenModal }) {
  return (
    <section
      id="destinations"
      className={`${container} py-11 lg:pt-12 lg:pb-12`}
    >
      <SectionHeading
        title="Popular Destinations"
        description="Handpicked places that travelers love"
        icon="plane"
        action={() => open({ type: "destinations" })}
        actionLabel="View All"
      />
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible lg:grid-cols-5 lg:gap-5">
        {destinations.slice(0, 5).map((destination) => (
          <div
            key={destination.name}
            className="w-[47%] flex-none snap-start sm:w-auto"
          >
            <DestinationCard
              destination={destination}
              onClick={() =>
                open({ type: "planner", destination: destination.name })
              }
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => open({ type: "destinations" })}
        className={`${outlineButton} mt-5 sm:hidden`}
      >
        View All Destinations <ArrowRight size={15} />
      </button>
    </section>
  )
}

function TravelCollage() {
  return (
    <div className="relative mx-auto h-[340px] w-full max-w-[515px] overflow-clip sm:h-[380px] lg:h-[365px]">
      <svg
        aria-hidden="true"
        viewBox="0 0 450 340"
        className="absolute inset-0 size-full -rotate-12 text-[#d9d7cd] opacity-45"
      >
        <path
          fill="currentColor"
          d="m112 22 43 17 21-14 25 38 36-11 26 24 37-9 12 19 40 2-13 25-39 19-17 32 24 31-7 22-33-6-21 17-16 26-15-11-15 34-18-4-19-39-31-16-21-40-32-12 9-19-23-18 14-23-15-23 31-12Z"
        />
        <path
          d="m85 85 310 76M120 230l240-125M144 44l70 255M289 43l-71 260"
          stroke="#faf8f4"
          strokeWidth="9"
        />
      </svg>
      <p
        aria-hidden="true"
        className="absolute top-6 left-0 z-10 -rotate-9 border-b-2 border-dashed border-accent pb-2 font-handwritten text-[27px] leading-[0.85] sm:text-[31px]"
      >
        Make it
        <br />
        Happen<span className="absolute -top-5 -left-3 text-accent">✧</span>
      </p>
      <div className="absolute top-2 left-[25%] h-[165px] w-[170px] rotate-6 rounded-xl border-[7px] border-white bg-white shadow-lg sm:h-[185px] sm:w-[200px]">
        <img
          src={imagePath("planner-small")}
          alt="Travel memories captured on a camera beside a map"
          loading="lazy"
          className="size-full rounded-md object-cover"
        />
      </div>
      <div className="absolute bottom-4 left-[8%] h-[225px] w-[220px] -rotate-7 rounded-xl border-[8px] border-white bg-white shadow-xl sm:bottom-2 sm:h-[255px] sm:w-[260px]">
        <img
          src={imagePath("planner")}
          alt="Backpackers setting off on a mountain trail"
          loading="lazy"
          className="size-full rounded-md object-cover object-[65%_center]"
        />
      </div>
      <div className="absolute top-11 right-[1%] z-10 w-[180px] -rotate-7 rounded-xl bg-white px-4 py-5 shadow-[0_10px_25px_#1c28251a] sm:top-9 sm:right-[3%] sm:w-[210px] sm:px-5 sm:py-6">
        <p className="mb-4 flex justify-between text-sm font-bold">
          My Trip Plan
          <Plane size={14} strokeWidth={1.3} />
        </p>
        {[
          "Arrival & City Tour",
          "Island Hopping",
          "Local Experiences",
          "Departure",
        ].map((item, index) => (
          <div
            key={item}
            className="flex items-center gap-2 border-b border-border/50 py-2.5 text-[9px] sm:text-[10px]"
          >
            <span
              className={`size-2 rounded-full ${
                index < 2 ? "bg-[#e59875]" : "bg-[#73a48c]"
              }`}
            />
            <span className="text-muted-foreground">Day {index + 1}</span>
            <span className="ml-1 font-medium">{item}</span>
          </div>
        ))}
      </div>
      <div className="absolute right-[5%] bottom-1 z-20 size-[83px] overflow-hidden rounded-full border-4 border-white shadow-sm sm:size-[100px]">
        <img
          src={imagePath("backpacker")}
          alt="Traveler taking a moment by the ocean"
          loading="lazy"
          className="size-full object-cover object-[80%_center]"
        />
      </div>
      <div className="absolute bottom-[83px] left-0 z-20 size-[70px] overflow-hidden rounded-full border-4 border-white shadow-sm">
        <img
          src={imagePath("bali")}
          alt="Turquoise waves below Bali's coastal cliffs"
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
    </div>
  )
}

export function FeatureItem({
  title,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string
  subtitle: string
  icon: typeof Map
  color: string
}) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto mb-3 flex size-[54px] items-center justify-center rounded-full border-[5px] border-white/20 text-white ${color}`}
      >
        <Icon size={25} strokeWidth={1.3} />
      </div>
      <h3 className="text-[11px] font-bold lg:text-xs">{title}</h3>
      <p className="mt-1 text-[9px] leading-4 text-muted-foreground lg:text-[10px]">
        {subtitle}
      </p>
    </div>
  )
}

export function SmartTripPlanner({ open }: { open: OpenModal }) {
  return (
    <section
      id="planner"
      className="relative bg-[#f4f0e9]/60 py-7 sm:py-9 lg:py-8"
    >
      <div
        className={`${container} grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14`}
      >
        <TravelCollage />
        <div className="relative pb-4">
          <button
            onClick={() => open({ type: "planner" })}
            className="text-left"
          >
            <h2 className="font-display text-[37px] leading-[1.07] font-medium tracking-[-0.025em] sm:text-[43px] lg:text-[47px]">
              Plan Your Trip
              <br />
              <span className="relative z-0 after:absolute after:-right-2 after:bottom-0 after:-left-1 after:-z-10 after:h-[9px] after:-rotate-1 after:rounded-[50%] after:bg-accent/80">
                The Smart Way
              </span>
            </h2>
          </button>
          <p className="mt-6 max-w-[440px] text-sm leading-[1.65]">
            Get personalized itineraries, budget estimates and
            <br className="hidden xl:block" /> local recommendations powered by
            real travelers.
          </p>
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 hidden h-[135px] w-[130px] xl:block"
          >
            <Plane
              className="absolute top-0 right-2 -rotate-12 text-[#93632f]"
              size={34}
              fill="currentColor"
              strokeWidth={1}
            />
            <svg viewBox="0 0 130 140" className="size-full text-[#ce9651]">
              <path
                d="M111 31C73 119 20 83 37 41S114 49 66 102L28 125"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="5 5"
                fill="none"
              />
            </svg>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
            <FeatureItem
              title="Custom Itineraries"
              subtitle="Trips tailored to your style"
              icon={ClipboardCheck}
              color="bg-[#74ad7b]"
            />
            <FeatureItem
              title="Best Deals"
              subtitle="Save more on stays & travel"
              icon={ShoppingBag}
              color="bg-[#ee8590]"
            />
            <FeatureItem
              title="Local Experiences"
              subtitle="Discover hidden gems"
              icon={Map}
              color="bg-[#66bbef]"
            />
            <FeatureItem
              title="24/7 Support"
              subtitle="We're here, always"
              icon={Headset}
              color="bg-[#f3be58]"
            />
          </div>
          <button
            onClick={() => open({ type: "planner" })}
            className="group mt-6 inline-flex items-center gap-2 text-xs font-semibold text-primary"
          >
            Let's plan your adventure{" "}
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  )
}

export function TripPackageCard({
  trip,
  onClick,
}: {
  trip: TripPackage
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full overflow-hidden rounded-[14px] bg-white text-left shadow-[0_3px_18px_#29353105] transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_12px_30px_#29353115]"
    >
      <div className="relative aspect-[1.43] overflow-hidden">
        <img
          src={imagePath(trip.image)}
          alt={`${trip.name} — ${trip.route}`}
          loading="lazy"
          width={500}
          height={350}
          className="size-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
        />
        <span className="absolute bottom-0 left-3 rounded-t-lg bg-white px-3 py-2 text-[10px] font-medium lg:text-[11px]">
          {trip.days} Days · {trip.days - 1} Nights
        </span>
      </div>
      <div className="px-4 pt-4 pb-4 lg:px-5">
        <h3 className="text-[15px] font-semibold lg:text-[17px]">
          {trip.name}
        </h3>
        <p className="mt-1.5 text-[10px] text-[#737776] lg:text-[11px]">
          {trip.route}
        </p>
        <p className="mt-3 flex items-center gap-1 text-[10px] lg:text-[11px]">
          <Star
            size={14}
            className="text-[#f2b831]"
            fill="currentColor"
            strokeWidth={0}
          />
          <span className="font-semibold">{trip.rating}</span>
          <span className="text-muted-foreground">
            ({trip.reviews} reviews)
          </span>
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[17px] font-bold lg:text-lg">
            {formatPrice(trip.price)}
          </p>
          <span className="flex size-8 items-center justify-center rounded-full bg-[#535754] text-white transition-colors group-hover:bg-primary">
            <ArrowRight size={17} strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </button>
  )
}

export function TrendingTrips({ open }: { open: OpenModal }) {
  return (
    <section id="packages" className={`${container} py-10 lg:py-12`}>
      <SectionHeading
        title="Trending Trips"
        description="Curated travel packages for your next getaway"
        icon="fire"
        action={() => open({ type: "packages" })}
        actionLabel="View All Packages"
      />
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 lg:gap-5">
        {packages.map((trip) => (
          <div key={trip.id} className="min-w-[79%] snap-start sm:min-w-0">
            <TripPackageCard
              trip={trip}
              onClick={() => open({ type: "package", trip })}
            />
          </div>
        ))}
      </div>
      <button
        className={`${outlineButton} mt-5 sm:hidden`}
        onClick={() => open({ type: "packages" })}
      >
        View All Packages <ArrowRight size={15} />
      </button>
    </section>
  )
}

export function ExperienceBanner({ open }: { open: OpenModal }) {
  return (
    <section
      id="experiences"
      className="relative isolate overflow-hidden text-white"
    >
      <img
        src={imagePath("experience")}
        srcSet={`${imagePath("experience-small")} 900w, ${imagePath("experience")} 1800w`}
        sizes="100vw"
        alt="Traveler sitting on a mountain summit with arms outstretched above a valley in golden sunset light"
        loading="lazy"
        className="absolute inset-0 -z-20 size-full object-cover object-[68%_center] sm:object-[center_58%]"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#102022bd] via-[#10202233] to-transparent" />
      <div className={`${container} relative py-12 sm:py-14 lg:py-[55px]`}>
        <h2 className="font-display text-[47px] leading-[1.04] tracking-[-0.02em] sm:text-[54px] lg:text-[62px]">
          More Than
          <br />
          Just a Trip
        </h2>
        <p className="mt-5 text-sm sm:text-base">
          We create experiences that stay with you forever.
        </p>
        <button
          onClick={() => open({ type: "experiences" })}
          className="group mt-6 inline-flex items-center gap-6 rounded-full bg-white px-6 py-4 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
        >
          Explore Experiences{" "}
          <ArrowRight
            size={19}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
        <p
          aria-hidden="true"
          className="absolute right-3 bottom-10 hidden -rotate-9 font-handwritten text-[35px] leading-[0.87] text-white/90 sm:block lg:right-5"
        >
          Good
          <br />
          Travels
          <br />
          Brighter
          <br />
          <span className="pl-5">You</span>
          <Heart
            className="absolute -right-5 bottom-1 rotate-12 text-accent"
            size={20}
            strokeWidth={1.2}
          />
          <span className="mt-3 block text-center text-accent">⌁</span>
        </p>
      </div>
    </section>
  )
}

export function TestimonialCard({
  testimonial,
}: {
  testimonial: typeof testimonials[number]
}) {
  return (
    <article className="h-full rounded-[15px] bg-white/85 p-5 shadow-[0_5px_25px_#252e2805] sm:p-6">
      <div className="flex items-center gap-3">
        <img
          src={imagePath(testimonial.image)}
          alt={testimonial.name}
          width={48}
          height={48}
          loading="lazy"
          className="size-12 rounded-full object-cover object-top"
        />
        <div>
          <h3 className="text-sm font-semibold">{testimonial.name}</h3>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {testimonial.location}
          </p>
          <div
            aria-label="5 out of 5 stars"
            className="mt-1.5 flex gap-0.5 text-[#f6b921]"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={15} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
        </div>
      </div>
      <blockquote className="mt-4 text-[13px] leading-[1.7] text-[#515652]">
        “{testimonial.quote}”
      </blockquote>
    </article>
  )
}

export function Testimonials() {
  const [offset, setOffset] = useState(0)
  return (
    <section className={`${container} py-10 lg:py-11`}>
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          title="What Travelers Say"
          description="Real stories from real explorers"
          icon="message"
        />
        <div className="mt-1 flex gap-2">
          <button
            aria-label="Previous testimonial"
            onClick={() => setOffset((offset + 2) % 3)}
            className="flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-white"
          >
            <ChevronLeft size={19} strokeWidth={1.5} />
          </button>
          <button
            aria-label="Next testimonial"
            onClick={() => setOffset((offset + 1) % 3)}
            className="flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-white"
          >
            <ChevronRight size={19} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div aria-live="polite" className="grid gap-4 sm:grid-cols-3 lg:gap-5">
        {testimonials.map((_, index) => (
          <div key={index} className={index > 0 ? "hidden sm:block" : ""}>
            <TestimonialCard testimonial={testimonials[(index + offset) % 3]} />
          </div>
        ))}
      </div>
    </section>
  )
}

export function NewsletterCTA() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")
  return (
    <div className="relative py-10 text-center lg:pt-11 lg:pb-10">
      <div
        aria-hidden="true"
        className="absolute top-14 left-2 hidden sm:block lg:left-[12%]"
      >
        <Send size={37} strokeWidth={1} className="-rotate-12" />
        <svg viewBox="0 0 80 90" className="h-24 w-20">
          <path
            d="M19 8C-20 80 28 73 61 85"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        </svg>
      </div>
      <h2 className="mx-auto max-w-[570px] font-display text-[32px] leading-tight font-medium tracking-[-0.025em] sm:max-w-none sm:text-[39px] lg:text-[43px]">
        Ready for Your Next Adventure?
      </h2>
      <p className="mx-auto mt-3 max-w-[480px] text-xs leading-relaxed text-white/90 sm:max-w-none sm:text-sm">
        Get travel inspiration, exclusive deals and expert tips straight to your
        inbox.
      </p>
      <form
        className="relative mx-auto mt-6 flex max-w-[445px] rounded-full bg-white p-1.5 text-foreground"
        onSubmit={(event) => {
          event.preventDefault()
          try {
            const saved: string[] = JSON.parse(
              localStorage.getItem("tripplanners-newsletter") || "[]",
            )
            localStorage.setItem(
              "tripplanners-newsletter",
              JSON.stringify([
                ...new Set([...saved, email.trim().toLowerCase()]),
              ]),
            )
            setSubscribed(true)
            setError("")
          } catch {
            setError(
              "Your browser couldn't save this subscription. Please try again.",
            )
          }
        }}
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          required
          id="newsletter-email"
          type="email"
          value={email}
          disabled={subscribed}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className="min-w-0 flex-1 rounded-full bg-transparent px-4 text-xs placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="submit"
          disabled={subscribed}
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-semibold hover:bg-[#f3bb45] disabled:cursor-default"
        >
          {subscribed ? (
            <>
              <Check size={15} /> Saved
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
      {subscribed && (
        <p role="status" className="mt-3 text-xs text-accent">
          You're on the list on this device. Email delivery is not connected
          yet.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-xs text-accent">
          {error}
        </p>
      )}
      <p
        aria-hidden="true"
        className="absolute right-0 -bottom-4 hidden -rotate-8 font-handwritten text-[30px] leading-[0.85] text-white/90 xl:block"
      >
        Explore
        <br />
        <span className="pl-4">More</span>
        <br />
        Live Better
        <span className="mt-2 block text-right text-[#dd945f]">♡</span>
      </p>
    </div>
  )
}

export function Footer({ open }: { open: OpenModal }) {
  return (
    <footer
      id="contact"
      className="relative isolate overflow-hidden bg-[#062c34] text-white"
    >
      <img
        src={imagePath("forest")}
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-20 size-full object-cover object-[center_32%] opacity-35"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-[#073a4260] via-[#04252be6] to-[#03191dfc]" />
      <div className={container}>
        <NewsletterCTA />
        <div className="mt-7 flex flex-col items-center justify-between gap-7 border-t border-white/10 pt-7 sm:flex-row lg:mt-5 lg:border-0 lg:pt-4">
          <Logo />
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-center gap-x-6 gap-y-4 text-xs"
          >
            <a href="#destinations" className="hover:text-accent">
              Destinations
            </a>
            <a href="#packages" className="hover:text-accent">
              Packages
            </a>
            <a href="#experiences" className="hover:text-accent">
              Experiences
            </a>
            {["Blogs", "About", "Contact"].map((label) => (
              <button
                key={label}
                onClick={() =>
                  open({
                    type: "info",
                    title: label === "Blogs" ? "Travel Journal" : label,
                  })
                }
                className="hover:text-accent"
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-accent"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-accent"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="text-sm font-semibold hover:text-accent"
            >
              𝕏
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-accent"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 pt-7 pb-7 text-[10px] text-white/65 sm:flex-row">
          <p>© {new Date().getFullYear()} TripPlanners. All rights reserved.</p>
          <div className="flex gap-5">
            <button
              onClick={() => open({ type: "info", title: "Privacy Policy" })}
              className="hover:text-white"
            >
              Privacy Policy
            </button>
            <button
              onClick={() =>
                open({ type: "info", title: "Terms & Conditions" })
              }
              className="hover:text-white"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
