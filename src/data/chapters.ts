// Alumni chapters that have an active WhatsApp group (verified by the client).
// This is the complete list — anything not here does not have a group yet.
//
// The India chapters (Bengaluru — the home/campus city — plus Mumbai, Delhi,
// Hyderabad, and Pune) are kept in addition to the verified list, confirmed
// with the client. Individual chapters have NO per-city join links:
// the single clickable action on the Chapters page is the global WhatsApp
// community link below. Do not add per-chapter links without real join URLs.
export const GLOBAL_WHATSAPP_URL =
  "https://chat.whatsapp.com/HO8HaY2wkgqH9nELKgJVY5";

export type Chapter = {
  name: string;
  // Representative city/region photo. These are freely-licensed images from
  // Wikimedia Commons (hotlinked). Region chapters use a representative city or
  // landmark. Swap any `image` for a curated/self-hosted URL later — the card
  // falls back to a brand-colored tile if the image ever fails to load.
  image: string;
};

export const chapters: Chapter[] = [
  { name: "Bengaluru", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/View_from_Visvesvaraya_Industrial_and_Technological_Museum_%282025%29_02.jpg/960px-View_from_Visvesvaraya_Industrial_and_Technological_Museum_%282025%29_02.jpg" },
  { name: "Mumbai", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Mumbai_Bandra-Worli_Sea_Link.jpg/960px-Mumbai_Bandra-Worli_Sea_Link.jpg" },
  { name: "Delhi", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Forecourt%2C_Rashtrapati_Bhavan_-_1.jpg/960px-Forecourt%2C_Rashtrapati_Bhavan_-_1.jpg" },
  { name: "Hyderabad", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Downtown_hyderabad_drone.png/960px-Downtown_hyderabad_drone.png" },
  { name: "Pune", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pune_West_skyline_-_March_2017.jpg/960px-Pune_West_skyline_-_March_2017.jpg" },
  { name: "Amsterdam", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png/960px-Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png" },
  { name: "Boston", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/ISH_WC_Boston4.jpg/960px-ISH_WC_Boston4.jpg" },
  { name: "Japan", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/960px-Skyscrapers_of_Shinjuku_2009_January.jpg" },
  { name: "Nepal", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Kathmandu-Durbar_Square-06-Mahavishnu-Kuh-Vishnu-Pratapamalla-Jagannath-2007-gje.jpg/960px-Kathmandu-Durbar_Square-06-Mahavishnu-Kuh-Vishnu-Pratapamalla-Jagannath-2007-gje.jpg" },
  { name: "Vancouver", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Skyline_of_Vancouver%2C_Canada.jpg/960px-Skyline_of_Vancouver%2C_Canada.jpg" },
  { name: "Arizona", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Canyon_River_Tree_%28165872763%29.jpeg/960px-Canyon_River_Tree_%28165872763%29.jpeg" },
  { name: "DC Tri-State", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/12-07-13-washington-by-RalfR-08.jpg/960px-12-07-13-washington-by-RalfR-08.jpg" },
  { name: "Nashville", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nashville%2C_TN_skyline.jpg/960px-Nashville%2C_TN_skyline.jpg" },
  { name: "Singapore", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Marina_Bay_Sands_%28I%29.jpg/960px-Marina_Bay_Sands_%28I%29.jpg" },
  { name: "Munich", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/960px-Stadtbild_M%C3%BCnchen.jpg" },
  { name: "Chicago", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Chicago_River_ferry_b.jpg/960px-Chicago_River_ferry_b.jpg" },
  { name: "Dubai", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Dubai_Marina_Skyline.jpg/960px-Dubai_Marina_Skyline.jpg" },
  { name: "SEA (Southeast Asia)", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/4Y1A1159_Bangkok_%2833536795515%29.jpg/960px-4Y1A1159_Bangkok_%2833536795515%29.jpg" },
  { name: "San Diego", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/La_Jolla_Shores_view_%28cropped%29.jpg/960px-La_Jolla_Shores_view_%28cropped%29.jpg" },
  { name: "Dublin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Dublin_-_aerial_-_2025-07-07_01.jpg/960px-Dublin_-_aerial_-_2025-07-07_01.jpg" },
  { name: "GCC", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/The_Pearl_Marina_in_Nov_2013.jpg/960px-The_Pearl_Marina_in_Nov_2013.jpg" },
  { name: "Portland, OR", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Portland_Oregon_Aerial%2C_June_2025.jpg/960px-Portland_Oregon_Aerial%2C_June_2025.jpg" },
  { name: "San Francisco", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/San_Francisco_Downtown_Aerial%2C_August_2025.jpg/960px-San_Francisco_Downtown_Aerial%2C_August_2025.jpg" },
  { name: "New York", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/960px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg" },
  { name: "Texas", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Skyline_of_Austin%2C_Texas_%28cropped%29.jpg/960px-Skyline_of_Austin%2C_Texas_%28cropped%29.jpg" },
  { name: "Europe", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/960px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg" },
  { name: "Oceania", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/960px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg" },
  { name: "Seattle", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Seattle_Center_as_night_falls.jpg/960px-Seattle_Center_as_night_falls.jpg" },
  { name: "London", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/960px-London_Skyline_%28125508655%29.jpeg" },
  { name: "Toronto", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg/960px-Toronto_Skyline_from_Olympic_Island%2C_June_20_2026_%285-3_cropped%29.jpg" },
  { name: "California", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Hollywood_sign_%288485145044%29.jpg/960px-Hollywood_sign_%288485145044%29.jpg" },
];
