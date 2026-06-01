'use client';

interface TrendPoint {
  label: string;
  count: number;
}

const fallbackTrends: TrendPoint[] = [
  { label: 'Mon', count: 0 },
  { label: 'Tue', count: 0 },
  { label: 'Wed', count: 0 },
  { label: 'Thu', count: 0 },
  { label: 'Fri', count: 0 },
  { label: 'Sat', count: 0 },
  { label: 'Sun', count: 0 },
];

interface RegistrationTrendsProps {
  trends?: TrendPoint[] | null;
}

export default function RegistrationTrends({ trends }: RegistrationTrendsProps) {
  const points = trends && trends.length > 0 ? trends : fallbackTrends;
  const max = Math.max(...points.map((point) => point.count), 1);

  return (
    <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/5">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-xl font-bold font-headline">Registration Trends</h3>
          <p className="text-on-surface-variant text-sm">Growth over the last 30 days</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-surface-container-lowest rounded-full text-xs font-bold border border-outline-variant/20">
            Daily
          </span>
          <span className="px-3 py-1 text-xs font-bold text-on-surface-variant">Weekly</span>
        </div>
      </div>
      <div className="h-64 grid grid-cols-7 items-end gap-3 border-b border-outline-variant/20 pb-8">
        {points.map((point) => {
          const height = Math.max(8, Math.round((point.count / max) * 100));
          return (
            <div key={point.label} className="h-full flex flex-col justify-end gap-3">
              <div className="text-center text-xs font-bold text-primary">{point.count}</div>
              <div
                className="w-full rounded-t-lg bg-primary/90 shadow-sm transition-all"
                style={{ height: `${height}%` }}
                title={`${point.label}: ${point.count}`}
              ></div>
              <div className="text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                {point.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
