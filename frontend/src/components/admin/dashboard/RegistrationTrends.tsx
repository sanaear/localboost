"use client";

export default function RegistrationTrends() {
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
      <div className="h-64 flex items-end gap-1 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0 200 Q 50 180, 100 190 T 200 150 T 300 120 T 400 140 T 500 80 T 600 90 T 700 40"
            fill="none"
            stroke="#EBA020"
            strokeLinecap="round"
            strokeWidth="4"
          ></path>
          <path
            d="M0 200 Q 50 180, 100 190 T 200 150 T 300 120 T 400 140 T 500 80 T 600 90 T 700 40 V 256 H 0 Z"
            fill="url(#gradient-primary)"
            opacity="0.1"
          ></path>
          <defs>
            <linearGradient id="gradient-primary" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#EBA020"></stop>
              <stop offset="100%" stopColor="#EBA020" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute bottom-0 w-full flex justify-between px-2 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
    </div>
  );
}
