"use client";

interface Review {
  id: string;
  business: string;
  businessType: string;
  location: string;
  reviewer: string;
  reviewerAvatar: string;
  rating: number;
  excerpt: string;
  toxicity: {
    level: "Safe" | "Warning" | "Toxic";
    score: number;
    color: string;
  };
  isSelected: boolean;
}

const reviews: Review[] = [
  {
    id: "1",
    business: "Le Jardin Bleu",
    businessType: "Restaurant",
    location: "Marrakech",
    reviewer: "Elena G.",
    reviewerAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAToVks8uAp3ASxvSKsw-bNQraU9ighvjdVWATEy4yY5cgtrLG36GCAHH9_A8cxEmmjda2_bggxqrrqXSlgmiYihTguJa99uwV87MfuL8jSCw-tirE0PkV3b3pgJlwGSW0KLDCyuJ0CCiN03WOiuv_uVOP_R_3daFusB4RQqHAZ-AQp1bHno-scudbP2aHw9OIeoFzps7GIKtxTVCuNZBhZCyJldbipPVhd-8ZhyM8h7qeL6DwpzLvoPv7lkZpEQxerXHqoJAWdMlc",
    rating: 5,
    excerpt: '"The atmosphere was enchanting, like a hidden riad paradise. The tajine was..."',
    toxicity: {
      level: "Safe",
      score: 0.08,
      color: "bg-secondary",
    },
    isSelected: true,
  },
  {
    id: "2",
    business: "Atlas Trekking Co.",
    businessType: "Adventure",
    location: "Imlil",
    reviewer: "Marcus K.",
    reviewerAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA28d5T4lE6t-s8MNbbBoSvahpDRi7UTDHAIWYed4FIPYZ7c-V6xE5XvsikcbgbOHY_sGRw7WpuvywpE5bICgAMLoVuJj5din_YitGaVLOjrvipVHljMoj0wlMu1TRGyhcbe36ZTg-ESbavnL_njf3lTXoim56rMJOZQhJLRn87440qhLUj0gNgNvskhgmk3uKWa4DhGbfHuhZnAmnM5Z0U3L0Xn-pMVBu13fPjyS0JFFJtuzKY8oDORETzvl58vNY0hGXlkCqJvtw",
    rating: 2,
    excerpt: '"The guide was late and the equipment looked old. Not worth the high price..."',
    toxicity: {
      level: "Warning",
      score: 0.45,
      color: "bg-primary-container",
    },
    isSelected: false,
  },
  {
    id: "3",
    business: "Desert Nights Camp",
    businessType: "Lodging",
    location: "Merzouga",
    reviewer: "Anonymous",
    reviewerAvatar: "",
    rating: 1,
    excerpt: '"This place is a scam. I hate everything about it, worst service ever!!!"',
    toxicity: {
      level: "Toxic",
      score: 0.82,
      color: "bg-error",
    },
    isSelected: false,
  },
];

export default function ReviewsTable() {
  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low text-on-surface-variant text-sm font-label uppercase tracking-wider">
            <th className="p-4 w-12">
              <input
                className="rounded border-outline-variant text-primary focus:ring-primary"
                type="checkbox"
              />
            </th>
            <th className="p-4 font-semibold">Business</th>
            <th className="p-4 font-semibold">Reviewer</th>
            <th className="p-4 font-semibold">Rating</th>
            <th className="p-4 font-semibold w-1/3">Excerpt</th>
            <th className="p-4 font-semibold">AI Toxicity</th>
            <th className="p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container-high">
          {reviews.map((review) => (
            <tr
              key={review.id}
              className={`hover:bg-surface-container-low/50 transition-colors cursor-pointer ${review.isSelected ? "bg-primary-fixed/5" : ""}`}
            >
              <td className="p-4">
                <input
                  checked={review.isSelected}
                  className="rounded border-outline-variant text-primary focus:ring-primary"
                  type="checkbox"
                />
              </td>
              <td className="p-4">
                <span className="font-bold text-on-surface">{review.business}</span>
                <p className="text-xs text-on-surface-variant">
                  {review.businessType} • {review.location}
                </p>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full ${
                      review.reviewer === "Anonymous"
                        ? "bg-error-container"
                        : "bg-secondary-container"
                    } flex-shrink-0`}
                  >
                    {review.reviewerAvatar && (
                      <img
                        alt={review.reviewer}
                        className="w-full h-full object-cover rounded-full"
                        src={review.reviewerAvatar}
                      />
                    )}
                  </div>
                  <span className="font-medium">{review.reviewer}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-4 text-sm text-on-surface-variant">
                {review.excerpt}
              </td>
              <td className="p-4">
                <div className="flex flex-col gap-1">
                  <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full ${review.toxicity.color}`}
                      style={{ width: `${review.toxicity.score * 100}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-tighter ${
                      review.toxicity.level === "Safe"
                        ? "text-secondary"
                        : review.toxicity.level === "Warning"
                        ? "text-on-primary-container"
                        : "text-error"
                    }`}
                  >
                    {review.toxicity.level} ({review.toxicity.score.toFixed(2)})
                  </span>
                </div>
              </td>
              <td className="p-4 text-center">
                <button className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 bg-surface-container-low flex justify-between items-center text-sm text-on-surface-variant">
        <span>Showing 3 of 124 reviews</span>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-surface-container-high rounded transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="p-1 hover:bg-surface-container-high rounded transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
