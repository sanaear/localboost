"use client";

interface BusinessRow {
  rank: number;
  initials: string;
  name: string;
  rating: number;
  growth: number;
  bgColor: string;
  textColor: string;
}

export default function TopBusinessesRanking() {
  const businesses: BusinessRow[] = [
    {
      rank: 1,
      initials: "RK",
      name: "Riad Kniza Gastronomy",
      rating: 4.9,
      growth: 18.2,
      bgColor: "bg-primary-fixed",
      textColor: "text-primary",
    },
    {
      rank: 2,
      initials: "BA",
      name: "Blue Alley Textiles",
      rating: 4.8,
      growth: 12.5,
      bgColor: "bg-secondary-fixed",
      textColor: "text-secondary",
    },
    {
      rank: 3,
      initials: "MJ",
      name: "Majorelle Jewelry",
      rating: 4.8,
      growth: 9.1,
      bgColor: "bg-tertiary-fixed",
      textColor: "text-tertiary",
    },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-headline font-bold text-on-surface">Top Businesses</h3>
        <button className="text-xs font-bold text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-label text-slate-400 uppercase tracking-widest border-b border-surface-container">
          <div className="col-span-1">#</div>
          <div className="col-span-7">Business Name</div>
          <div className="col-span-2 text-right">Rating</div>
          <div className="col-span-2 text-right">Growth</div>
        </div>

        {businesses.map((business) => (
          <div
            key={business.rank}
            className="grid grid-cols-12 px-4 py-3 text-sm items-center hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer group"
          >
            <div className="col-span-1 font-bold text-slate-400">
              {business.rank.toString().padStart(2, "0")}
            </div>
            <div className="col-span-7 flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full ${business.bgColor} flex items-center justify-center ${business.textColor} font-bold text-xs`}
              >
                {business.initials}
              </div>
              <span className="font-bold text-on-surface">{business.name}</span>
            </div>
            <div className="col-span-2 text-right flex items-center justify-end gap-1">
              <span className="text-primary font-bold">{business.rating}</span>
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
            <div className="col-span-2 text-right text-secondary font-bold">
              +{business.growth}%
            </div>
          </div>
        ))}

        <div className="py-2 text-center">
          <span className="text-[10px] font-label text-slate-300 uppercase tracking-widest">
            Showing Top 3 of 842 Entities
          </span>
        </div>
      </div>
    </div>
  );
}
