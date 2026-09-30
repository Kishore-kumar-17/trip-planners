import { lazy, Suspense, useRef, useState } from "react"
import { Navbar, Hero, PopularDestinations, SmartTripPlanner, TrendingTrips, ExperienceBanner, Testimonials, Footer } from "./components/Sections"
import type { ModalState } from "./data"

const Dialog = lazy(() => import("./components/Dialogs").then(module => ({ default: module.Dialog })))

export default function Home() {
  const [modal, setModal] = useState<ModalState>(null)
  const [modalKey, setModalKey] = useState(0)
  const triggerRef = useRef<HTMLElement | null>(null)
  const open = (next: ModalState) => {
    if (!modal) triggerRef.current = document.activeElement as HTMLElement
    setModal(next)
    setModalKey(key => key + 1)
  }
  const close = () => {
    setModal(null)
    requestAnimationFrame(() => { if (triggerRef.current?.isConnected) triggerRef.current.focus() })
  }
  return (
    <>
      <a href="#destinations" className="sr-only fixed top-3 left-3 z-50 rounded-full bg-white px-5 py-3 text-sm text-primary focus:not-sr-only">Skip to content</a>
      <Navbar open={open} />
      <main>
        <Hero open={open} onSearch={criteria => open({ type: "search", criteria })} />
        <PopularDestinations open={open} />
        <SmartTripPlanner open={open} />
        <TrendingTrips open={open} />
        <ExperienceBanner open={open} />
        <Testimonials />
      </main>
      <Footer open={open} />
      {modal && <Suspense fallback={<div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-6 py-3 text-sm shadow-lg">Preparing your adventure…</div>}><Dialog key={modalKey} modal={modal} open={open} close={close} /></Suspense>}
    </>
  )
}
