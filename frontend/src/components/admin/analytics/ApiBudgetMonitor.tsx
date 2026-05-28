"use client";

export default function ApiBudgetMonitor() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-tertiary/20 flex flex-col items-center justify-center text-center">
      <h3 className="text-sm font-label font-bold text-on-surface uppercase tracking-widest mb-8">
        API Budget Monitor
      </h3>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            className="text-surface-container-high"
            cx="96"
            cy="96"
            fill="transparent"
            r="80"
            stroke="currentColor"
            strokeWidth="12"
          ></circle>
          <circle
            className="text-tertiary"
            cx="96"
            cy="96"
            fill="transparent"
            r="80"
            stroke="currentColor"
            strokeDasharray="502"
            strokeDashoffset="100"
            strokeLinecap="round"
            strokeWidth="12"
          ></circle>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black font-headline text-tertiary">$240</span>
          <span className="text-xs font-label text-on-surface-variant">of $300 limit</span>
        </div>
      </div>

      <div className="mt-8 bg-tertiary-container/30 px-4 py-2 rounded-full border border-tertiary/20 flex items-center gap-2">
        <span className="material-symbols-outlined text-tertiary animate-pulse text-lg">warning</span>
        <span className="text-xs font-bold text-on-tertiary-container">Vertex AI Credit Warning</span>
      </div>

      <p className="mt-4 text-[11px] text-on-surface-variant leading-relaxed">
        System will auto-throttle low-priority embeddings if threshold reaches 90%.
      </p>
    </div>
  );
}
