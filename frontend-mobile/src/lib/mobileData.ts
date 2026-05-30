export type FeedCard = {
  id: string;
  name: string;
  subtitle: string;
  meta: string;
  rating: string;
  badge: string;
  badgeTone: "green" | "gold";
  image: string;
};

export type ResultCard = {
  id: string;
  name: string;
  category: string;
  rating: string;
  distance: string;
  area: string;
  price: string;
  status: string;
  statusTone: "green" | "amber" | "gray";
  image: string;
};

export const feedCards: FeedCard[] = [
  {
    id: "dar-hatim",
    name: "Dar Hatim",
    subtitle: "Restaurants",
    meta: "5 min walk from Grand Stade de Casablanca",
    rating: "4.9",
    badge: "Open now",
    badgeTone: "green",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=beautiful%20Moroccan%20riad%20restaurant%20interior%2C%20arched%20doorway%2C%20teal%20tiles%2C%20warm%20light%2C%20luxury%20travel%20editorial%20photo&image_size=portrait_4_3",
  },
  {
    id: "cafe-epices",
    name: "Cafe des Epices",
    subtitle: "Cafes",
    meta: "800 m",
    rating: "4.7",
    badge: "Closes 19:00",
    badgeTone: "gold",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=stylish%20Moroccan%20cafe%20signage%20with%20golden%20lettering%2C%20dark%20background%2C%20editorial%20street%20photo%2C%20warm%20night%20glow&image_size=portrait_4_3",
  },
];

export const resultCards: ResultCard[] = [
  {
    id: "al-fassia",
    name: "Al Fassia",
    category: "Museum",
    rating: "4.9",
    distance: "450 m",
    area: "Medina Centri",
    price: "$",
    status: "Open now",
    statusTone: "green",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Moroccan%20restaurant%20facade%20illustration%2C%20warm%20ochre%20building%2C%20travel%20app%20thumbnail%2C%20clean%20background&image_size=square",
  },
  {
    id: "nomad-rooftop",
    name: "Nomad Rooftop",
    category: "Cafe",
    rating: "4.7",
    distance: "1.2 km",
    area: "Place R'cif",
    price: "$$$",
    status: "Busy",
    statusTone: "amber",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=rooftop%20restaurant%20with%20Moroccan%20city%20view%2C%20modern%20travel%20app%20thumbnail%2C%20cinematic%20lighting&image_size=square",
  },
  {
    id: "dar-tajine",
    name: "Dar Tajine",
    category: "Restaurant",
    rating: "4.8",
    distance: "800 m",
    area: "Talaa Kebira Nord",
    price: "$$",
    status: "Open now",
    statusTone: "green",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traditional%20tajine%20dish%20on%20warm%20background%2C%20luxury%20food%20app%20thumbnail%2C%20rich%20terracotta%20tones&image_size=square",
  },
  {
    id: "artisan-tanner",
    name: "Artisan Tanner",
    category: "Artisan",
    rating: "4.5",
    distance: "300 m",
    area: "Chouara Tannery",
    price: "$",
    status: "Closes 19:00",
    statusTone: "gray",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=artisan%20workshop%20in%20Moroccan%20medina%2C%20handmade%20leather%20goods%2C%20dark%20moody%20travel%20thumbnail&image_size=square",
  },
];

export const mapCards = [
  {
    id: "lantiquaire",
    name: "Dar L'Antiquaire",
    icon: "person",
    markerTop: "30%",
    markerLeft: "33%",
  },
];

export const detailGallery = [
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=artisan%20hands%20crafting%20ceramic%20pottery%2C%20teal%20background%2C%20warm%20studio%20light%2C%20travel%20app%20gallery&image_size=square",
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=stacked%20handmade%20ceramic%20plates%20and%20bowls%2C%20earthy%20tones%2C%20beautiful%20soft%20light%2C%20travel%20app%20gallery&image_size=square",
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=arched%20Moroccan%20atelier%20interior%20with%20craftsmanship%20details%2C%20warm%20sunlight%2C%20premium%20travel%20photography&image_size=square",
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cinematic%20close-up%20of%20artisan%20tools%20and%20pottery%20shelves%2C%20dark%20moody%20workshop%20photo%2C%20travel%20app%20gallery&image_size=square",
];

export const aiRecommendations = [
  {
    id: "cafe-clock",
    name: "Cafe Clock",
    rating: "4.8",
    walk: "450m away",
    price: "95 MAD",
    badge: "Veggie friendly",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=warm%20Moroccan%20restaurant%20interior%20with%20lanterns%2C%20cozy%20tables%2C%20travel%20editorial%20photo&image_size=portrait_4_3",
  },
  {
    id: "the-ruined",
    name: "The Ruined",
    rating: "4.7",
    walk: "1.2 km",
    price: "130 MAD",
    badge: "Rooftop view",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=stylish%20rooftop%20restaurant%20overlooking%20Moroccan%20city%2C%20bright%20daylight%2C%20travel%20app%20card&image_size=portrait_4_3",
  },
];

export const savedPlaces = [
  {
    id: "riad-jasmine",
    name: "Riad Jasmine",
    location: "Marrakech, Medina",
    rating: "4.9",
    tag: "Authentic Stay",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=beautiful%20Moroccan%20riad%20entrance%20with%20ornate%20door%2C%20sunny%20courtyard%2C%20premium%20travel%20photo&image_size=portrait_4_3",
  },
  {
    id: "chouara-tannery",
    name: "Chouara Tannery",
    location: "Fes, Old City",
    rating: "4.7",
    tag: "Craft District",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=panoramic%20view%20of%20Moroccan%20medina%20rooftops%2C%20earthy%20tones%2C%20historic%20travel%20photo&image_size=portrait_4_3",
  },
  {
    id: "hassan-mosque",
    name: "Hassan II Mosque",
    location: "Casablanca, Coast",
    rating: "5.0",
    tag: "Gold Hour Visit",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hassan%20II%20Mosque%20in%20Casablanca%20at%20clear%20blue%20sky%2C%20iconic%20architecture%2C%20travel%20photo&image_size=portrait_4_3",
  },
  {
    id: "spice-souk",
    name: "Spice Souk",
    location: "Marrakech, Medina",
    rating: "4.8",
    tag: "Night Market",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=golden%20spice%20market%20stall%20in%20Morocco%2C%20warm%20lights%2C%20rich%20textures%2C%20travel%20photo&image_size=portrait_4_3",
  },
];

export const merchantUploads = [
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=stylish%20Moroccan%20boutique%20interior%20with%20warm%20wood%20and%20lanterns%2C%20retail%20photo&image_size=portrait_4_3",
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=close-up%20of%20handmade%20leather%20bags%20displayed%20in%20boutique%2C%20premium%20product%20photo&image_size=portrait_4_3",
];

export const merchantStats = [
  { label: "Views this week", value: "1.2k", icon: "visibility" },
  { label: "Profile clicks", value: "430", icon: "ads_click" },
  { label: "Total saves", value: "85", icon: "star" },
  { label: "Saved by tourists", value: "210", icon: "favorite" },
];

export const merchantReviews = [
  {
    id: "review-1",
    rating: "★★★★★",
    age: "2h ago",
    text: "\"The quality of the hand-woven rugs here is incredible. Ahmed was so patient with us...\"",
  },
  {
    id: "review-2",
    rating: "★★★★★",
    age: "Yesterday",
    text: "\"Beautiful shop and authentic crafts. A must-visit in the Medina. Highly recommend...\"",
  },
];

export const merchantEditGallery = [
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=arched%20Moroccan%20hotel%20room%20interior%2C%20warm%20sunlight%2C%20luxury%20boutique%20stay%20photo&image_size=square",
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cozy%20Moroccan%20riad%20bedroom%20with%20lanterns%20and%20wooden%20details%2C%20premium%20travel%20photo&image_size=square",
];

export const merchantPhotoManagerShots = [
  {
    id: "main",
    label: "Main photo",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=moody%20artisan%20studio%20interior%20with%20dramatic%20light%20through%20window%2C%20editorial%20product%20showroom%2C%20premium%20mobile%20app%20hero&image_size=landscape_16_9",
  },
  {
    id: "detail-lens",
    label: "Lens detail",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=close-up%20of%20camera%20lens%20and%20artisan%20product%20photography%20setup%2C%20dark%20premium%20editorial%20shot&image_size=square",
  },
  {
    id: "corridor",
    label: "Corridor",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cinematic%20hallway%20with%20warm%20golden%20lights%20for%20boutique%20hotel%20or%20shop%2C%20premium%20travel%20photo&image_size=square",
  },
  {
    id: "logo-card",
    label: "Brand card",
    image:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=minimal%20red%20brand%20card%20with%20gold%20ornamental%20symbol%2C%20luxury%20identity%20mockup%2C%20clean%20product%20shot&image_size=square",
  },
];

export const merchantReviewInsights = [
  {
    label: "Response rate",
    value: "94%",
    tone: "green" as const,
  },
  {
    label: "Avg. time",
    value: "2.4h",
    tone: "amber" as const,
  },
];

export const merchantDetailedReviews = [
  {
    id: "jean-pierre",
    name: "Jean-Pierre L.",
    avatar:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=portrait%20of%20middle-aged%20French%20traveler%2C%20friendly%20expression%2C%20clean%20background%2C%20avatar%20photo&image_size=square",
    date: "Oct 15, 2023",
    rating: 5,
    status: "APPROVED",
    statusTone: "green" as const,
    text:
      "\"The handmade ceramics are breathtaking. Ibrahim was very kind and explained the history behind each pattern. A must visit in the Medina!\"",
    replyPlaceholder: "Write your reply to Jean-Pierre...",
  },
  {
    id: "sarah",
    name: "Sarah Jenkins",
    avatar:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=portrait%20of%20young%20female%20traveler%20smiling%2C%20soft%20studio%20light%2C%20clean%20avatar&image_size=square",
    date: "Oct 22, 2023",
    rating: 5,
    status: "PENDING",
    statusTone: "amber" as const,
    text:
      "\"Beautiful scarves, but the shop was a bit crowded when I visited. Great quality though!\"",
    replyPlaceholder: "Respond to Sarah",
  },
  {
    id: "mark",
    name: "Mark Wilson",
    avatar:
      "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=portrait%20of%20older%20male%20tourist%20with%20beard%2C%20neutral%20gray%20background%2C%20avatar%20shot&image_size=square",
    date: "Oct 28, 2023",
    rating: 5,
    status: "REPLIED",
    statusTone: "gray" as const,
    text:
      "\"Fast shipping to the US. The leather smell is authentic and the quality is excellent.\"",
    replyPlaceholder: "Reply sent",
  },
];

export const merchantVisibilityRanges = ["7d", "30d", "90d", "Custom"];

export const merchantViewsActivity = [36, 54, 49, 72, 68, 94, 81, 96];

export const merchantClicksByDay = [28, 44, 33, 61, 38, 57, 46];

export const merchantDiscoveryKeywords = [
  { label: "Handmade rugs Marrakech", value: "1.2k" },
  { label: "Authentic Souk spices", value: "842" },
  { label: "Shops near Jemaa el-Fnaa", value: "612" },
  { label: "Best leather workshops", value: "298" },
];

export const merchantUpdates = {
  latest: [
    {
      id: "review-approved",
      title: "New 5-star review from Emma G.",
      time: "2 minutes ago",
      excerpt: "\"Absolutely loved the argan saffron!\"",
      accent: "gold" as const,
    },
    {
      id: "profile-approved",
      title: "Your business profile has been approved",
      time: "1 hour ago",
      excerpt: "Your shop is now visible to all tourists.",
      accent: "green" as const,
    },
    {
      id: "views-spike",
      title: "Your profile was viewed 47 times this week",
      time: "Yesterday, 10:15 AM",
      excerpt: "View full report",
      accent: "gray" as const,
    },
  ],
  older: [
    {
      id: "weekend-rush",
      title: "Prepare for the weekend rush!",
      time: "Oct 24",
      accent: "peach" as const,
    },
  ],
};
