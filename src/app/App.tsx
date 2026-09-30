import { createBrowserRouter, RouterProvider, Link } from "react-router"

function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">A SMALL DETOUR · 404</p>
      <h1 className="mt-5 font-display text-5xl">Let's find your way back.</h1>
      <p className="mt-5 text-sm text-muted-foreground">This trail doesn't lead to a page. Your next adventure is back home.</p>
      <Link to="/" className="mt-8 rounded-full bg-accent px-7 py-4 text-sm font-semibold">Back to TripPlanners</Link>
    </main>
  )
}

function LoadingPage() {
  return <main role="status" className="flex min-h-dvh items-center justify-center bg-primary text-white"><p className="font-display text-3xl">Your next adventure is loading…</p></main>
}

const router = createBrowserRouter([
  { path: "/", HydrateFallback: LoadingPage, lazy: async () => ({ Component: (await import("./Home")).default }) },
  { path: "*", Component: NotFound },
])

export default function App() {
  return <RouterProvider router={router} />
}
