export type Destination = {
  name: string
  region: string
  image: string
  description: string
  highlights: string[]
}

export type TripPackage = {
  id: string
  name: string
  destination: string
  route: string
  days: number
  rating: string
  reviews: string
  price: number
  image: string
}

export const destinations: Destination[] = [
  {
    name: "Bali",
    region: "Indonesia",
    image: "bali",
    description:
      "Where emerald rice terraces meet turquoise coves. Slow down, find your favorite beach, and discover the island of the gods.",
    highlights: [
      "Ubud rice terraces",
      "Nusa Penida island escape",
      "Uluwatu sunset & temple",
      "Balinese cooking class",
      "Kuta beach & coastal cafés",
      "Waterfalls of northern Bali",
    ],
  },
  {
    name: "Switzerland",
    region: "Europe",
    image: "switzerland",
    description:
      "Alpine air, storybook villages, and impossibly beautiful lakes. Your front-row seat to the great outdoors.",
    highlights: [
      "Zurich old town & lake",
      "Interlaken mountain trails",
      "Lucerne & Chapel Bridge",
      "Jungfraujoch alpine railway",
      "Lake Brienz boat journey",
      "Swiss chocolate workshop",
    ],
  },
  {
    name: "Kerala",
    region: "India",
    image: "kerala",
    description:
      "Drift through palm-fringed backwaters, wander misty tea plantations, and let God's own country set the pace.",
    highlights: [
      "Munnar tea plantations",
      "Alleppey houseboat cruise",
      "Thekkady spice gardens",
      "Fort Kochi heritage walk",
      "Kumarakom bird sanctuary",
      "Traditional Kerala cooking",
    ],
  },
  {
    name: "Dubai",
    region: "UAE",
    image: "dubai",
    description:
      "Old-world souks and a skyline that touches the clouds. Find adventure between the city lights and golden desert.",
    highlights: [
      "Burj Khalifa observation deck",
      "Desert safari & dinner",
      "Al Fahidi heritage quarter",
      "Dubai Marina sunset cruise",
      "Jumeirah beach day",
      "Spice souk & creek crossing",
    ],
  },
  {
    name: "Thailand",
    region: "Asia",
    image: "thailand",
    description:
      "Longtail boats, limestone cliffs, and a warm welcome. Discover a little paradise, one island at a time.",
    highlights: [
      "Bangkok temples & street food",
      "Railay beach & limestone cliffs",
      "Phi Phi island boat trip",
      "Chiang Mai old city",
      "Thai cooking workshop",
      "Krabi sunset kayaking",
    ],
  },
  {
    name: "Maldives",
    region: "Indian Ocean",
    image: "maldives",
    description:
      "Barefoot mornings and endless blue. Escape to an island where the only itinerary is your own.",
    highlights: [
      "Malé city & local markets",
      "Overwater villa check-in",
      "Coral reef snorkeling",
      "Sunset dolphin cruise",
      "Sandbank picnic",
      "Island spa & lagoon kayaking",
    ],
  },
]

export const packages: TripPackage[] = [
  {
    id: "swiss-alps",
    name: "Swiss Alps Explorer",
    destination: "Switzerland",
    route: "Zurich · Interlaken · Lucerne",
    days: 5,
    rating: "4.8",
    reviews: "1.2K",
    price: 89999,
    image: "swiss-trip",
  },
  {
    id: "maldives",
    name: "Maldives Getaway",
    destination: "Maldives",
    route: "Malé · Hulhumale · Resort Stay",
    days: 4,
    rating: "4.7",
    reviews: "980",
    price: 79999,
    image: "maldives",
  },
  {
    id: "bali-bliss",
    name: "Bali Bliss",
    destination: "Bali",
    route: "Ubud · Kuta · Nusa Penida",
    days: 6,
    rating: "4.9",
    reviews: "1.1K",
    price: 69999,
    image: "bali-trip",
  },
  {
    id: "kerala",
    name: "Kerala Backwaters",
    destination: "Kerala",
    route: "Munnar · Alleppey · Thekkady",
    days: 4,
    rating: "4.8",
    reviews: "860",
    price: 49999,
    image: "kerala-trip",
  },
]

export const testimonials = [
  {
    name: "Ananya S.",
    location: "Chennai, India",
    image: "ananya",
    quote:
      "TripPlanners made our Bali trip so easy! Everything was well planned and the local recommendations were amazing.",
  },
  {
    name: "Rohit K.",
    location: "Bangalore, India",
    image: "rohit",
    quote:
      "Best travel experience ever! The itinerary was perfect and their support team was always available.",
  },
  {
    name: "Meera N.",
    location: "Coimbatore, India",
    image: "meera",
    quote:
      "Loved the personalized suggestions and hidden gems. Truly a hassle-free travel experience!",
  },
]

export const experiences = [
  {
    name: "A sunrise above the clouds",
    destination: "Switzerland",
    type: "Adventure",
    image: "swiss-trip",
    description:
      "Follow an alpine trail into the first light, with a local guide and a mountain breakfast.",
  },
  {
    name: "Cook, taste, connect",
    destination: "Bali",
    type: "Food & culture",
    image: "bali-trip",
    description:
      "Visit a neighborhood market, then share the secrets of a family kitchen in Ubud.",
  },
  {
    name: "Life in the slow lane",
    destination: "Kerala",
    type: "Nature",
    image: "kerala",
    description:
      "Spend a quiet afternoon on the backwaters, stopping at the villages along the way.",
  },
  {
    name: "Chase the island sunset",
    destination: "Maldives",
    type: "Relaxation",
    image: "maldives",
    description:
      "Sail across a turquoise lagoon as the sun drops into the Indian Ocean.",
  },
]

export const hotels = [
  {
    name: "The Ubud Hideaway",
    destination: "Bali",
    image: "bali-trip",
    price: 6500,
    description: "Boutique garden retreat · Breakfast included",
  },
  {
    name: "Alpine Lake Lodge",
    destination: "Switzerland",
    image: "swiss-trip",
    price: 14500,
    description: "Mountain-view lodge · Breakfast included",
  },
  {
    name: "Palm & Water Retreat",
    destination: "Kerala",
    image: "kerala",
    price: 4800,
    description: "Waterfront boutique stay · Breakfast included",
  },
  {
    name: "Lagoon Island Villas",
    destination: "Maldives",
    image: "maldives",
    price: 19500,
    description: "Beachfront villa · Breakfast included",
  },
  {
    name: "Marina City Stay",
    destination: "Dubai",
    image: "dubai",
    price: 9500,
    description: "City-view hotel · Near Dubai Marina",
  },
  {
    name: "Railay Cove Resort",
    destination: "Thailand",
    image: "thailand",
    price: 5800,
    description: "Beachfront resort · Breakfast included",
  },
]

export type SearchCriteria = {
  destination: string
  start: string
  end: string
  travelers: number
  tab: "Places" | "Hotels" | "Experiences"
}
export type PlannerPreferences = {
  destination: string
  start: string
  end: string
  travelers: number
  budget: string
  style: string
  interests: string[]
  accommodation: string
}
export type ModalState = {
  type: "planner"
  destination?: string
  initial?: Partial<PlannerPreferences>
} | {
  type: "destinations"
} | { type: "packages" } | {
  type: "package"
  trip: TripPackage
} | {
  type: "experiences"
} | {
  type: "search"
  criteria: SearchCriteria
} | { type: "story" } | {
  type: "info"
  title: string
} | null

export const imagePath = (image: string) => `${import.meta.env.BASE_URL}images/${image}.webp`
export const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN")}`
export const today = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
