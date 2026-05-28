"use client";

interface City {
  name: string;
  count: number;
  percentage: number;
}

const cities: City[] = [
  { name: "Casablanca", count: 452, percentage: 85 },
  { name: "Marrakech", count: 312, percentage: 65 },
  { name: "Fès", count: 218, percentage: 45 },
  { name: "Rabat", count: 156, percentage: 32 },
  { name: "Tanger", count: 89, percentage: 18 },
];

export default function BusinessesByCity() {
  return (
    <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/5">
      <h3 className="text-xl font-bold font-headline mb-8">Businesses by City</h3>
      <div className="space-y-6">
        {cities.map((city) => (
          <div key={city.name} className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span>{city.name}</span>
              <span className="text-primary">{city.count}</span>
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${city.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
