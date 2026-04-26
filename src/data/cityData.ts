import restaurantImg from "@/assets/listing-restaurant.jpg";
import gymImg from "@/assets/listing-gym.jpg";
import serviceImg from "@/assets/listing-service.jpg";
import jobImg from "@/assets/listing-job.jpg";
import eventImg from "@/assets/listing-event.jpg";
import cafeImg from "@/assets/listing-cafe.jpg";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";

export const AREAS = [
  "All Areas",
  "Vidyagiri",
  "Navanagar",
  "Old Bagalkot",
  "Mahakuta Road",
  "Ilkal Road",
  "Sector 25",
  "Bagalkot Town",
] as const;

export type Area = (typeof AREAS)[number];

export const CATEGORIES = [
  { id: "restaurants", name: "Restaurants", count: "120+ places", icon: "UtensilsCrossed" },
  { id: "gyms", name: "Gyms", count: "35+ studios", icon: "Dumbbell" },
  { id: "services", name: "Services", count: "200+ pros", icon: "Wrench" },
  { id: "jobs", name: "Jobs", count: "80+ openings", icon: "Briefcase" },
  { id: "events", name: "Events", count: "20+ this month", icon: "CalendarDays" },
] as const;

export type Listing = {
  id: string;
  name: string;
  category: string;
  area: Area;
  rating: number;
  reviews: number;
  tagline: string;
  image: string;
};

export const FEATURED_LISTINGS: Listing[] = [
  {
    id: "1",
    name: "Saraswati Family Restaurant",
    category: "Restaurants",
    area: "Vidyagiri",
    rating: 4.8,
    reviews: 412,
    tagline: "Authentic North Karnataka thali, served daily.",
    image: restaurantImg,
  },
  {
    id: "2",
    name: "Iron Forge Gym",
    category: "Gyms",
    area: "Navanagar",
    rating: 4.7,
    reviews: 198,
    tagline: "Premium equipment, certified personal trainers.",
    image: gymImg,
  },
  {
    id: "3",
    name: "QuickFix Home Services",
    category: "Services",
    area: "Sector 25",
    rating: 4.6,
    reviews: 287,
    tagline: "Plumbing, electrical & AC repair on-demand.",
    image: serviceImg,
  },
  {
    id: "4",
    name: "Bagalkot Co-Work Hub",
    category: "Jobs",
    area: "Navanagar",
    rating: 4.9,
    reviews: 64,
    tagline: "Coworking, careers, and weekly hiring meets.",
    image: jobImg,
  },
  {
    id: "5",
    name: "Mahakuta Heritage Festival",
    category: "Events",
    area: "Mahakuta Road",
    rating: 4.9,
    reviews: 1240,
    tagline: "Annual cultural celebration. Music, food, lights.",
    image: eventImg,
  },
  {
    id: "6",
    name: "Sunset Terrace Cafe",
    category: "Restaurants",
    area: "Old Bagalkot",
    rating: 4.7,
    reviews: 356,
    tagline: "Hilltop coffee with the best sunset in town.",
    image: cafeImg,
  },
];

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
};

export const NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Navanagar Flyover Phase 2 Opens to Public",
    excerpt: "The new flyover cuts commute times across central Bagalkot by an estimated 18 minutes during peak hours.",
    date: "Apr 22, 2026",
    category: "Civic",
    image: news1,
  },
  {
    id: "n2",
    title: "Heera Tech Jewellers Launches Flagship Store",
    excerpt: "The 4,500 sq ft showroom opens on Station Road, marking the brand's largest outlet in North Karnataka.",
    date: "Apr 18, 2026",
    category: "Business",
    image: news2,
  },
  {
    id: "n3",
    title: "Bagalkot Cultural Week Returns This May",
    excerpt: "Seven days of classical dance, folk performances and regional cuisine across three city venues.",
    date: "Apr 12, 2026",
    category: "Events",
    image: news3,
  },
];
