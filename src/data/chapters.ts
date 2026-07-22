export type FeaturedChapter = {
  city: string;
  country: string;
  members: number;
  // Placeholder gradient stops — swap the card background for a real photo later.
  gradient: [string, string];
};

export type ChapterRegion = {
  region: string;
  cities: string[];
};

// Featured chapters — the main active hubs shown as photo cards.
export const featuredChapters: FeaturedChapter[] = [
  { city: "Bengaluru", country: "India", members: 4200, gradient: ["#7A1E2E", "#3a0d16"] },
  { city: "Mumbai", country: "India", members: 1850, gradient: ["#5B1220", "#2a0810"] },
  { city: "San Francisco", country: "USA", members: 960, gradient: ["#8a3d24", "#3a1810"] },
  { city: "London", country: "UK", members: 720, gradient: ["#3d4a3a", "#1a2016"] },
  { city: "Singapore", country: "Singapore", members: 540, gradient: ["#2f4858", "#141f26"] },
  { city: "Dubai", country: "UAE", members: 430, gradient: ["#8a6d24", "#3a2c10"] },
];

// All other chapter cities, grouped by region. Edit / expand freely.
export const chapterRegions: ChapterRegion[] = [
  {
    region: "India",
    cities: [
      "Bengaluru",
      "Mumbai",
      "Delhi",
      "Hyderabad",
      "Chennai",
      "Pune",
      "Kolkata",
      "Ahmedabad",
    ],
  },
  {
    region: "North America",
    cities: [
      "San Francisco",
      "New York",
      "Seattle",
      "Austin",
      "Boston",
      "Toronto",
      "Chicago",
    ],
  },
  {
    region: "Europe",
    cities: ["London", "Berlin", "Amsterdam", "Zurich", "Dublin", "Stuttgart"],
  },
  {
    region: "Asia-Pacific",
    cities: ["Singapore", "Sydney", "Tokyo", "Melbourne", "Hong Kong", "Bangkok"],
  },
  {
    region: "Middle East",
    cities: ["Dubai", "Abu Dhabi", "Doha", "Riyadh"],
  },
];
