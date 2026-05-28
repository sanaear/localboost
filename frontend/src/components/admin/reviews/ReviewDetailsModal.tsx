"use client";

export default function ReviewDetailsModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1C1B]/60 backdrop-blur-sm">
      <div className="bg-surface rounded-lg shadow-2xl max-w-2xl w-full max-h-[921px] overflow-hidden flex flex-col border border-outline-variant/20">
        <div className="p-6 border-b border-surface-container-high flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-primary-container shadow-md">
              <img
                alt="Elena G. Detailed"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMHQoMbJd0vjdyzTUeWh_JzvoGi5Xk82yVtBa7WUxFHbcUArJaE9_W_toi3T8aVVXqQOQXbrYFbigw72zi57AdzmSDCketyZux8tL8HzAIkN8eI5TgRAZdAEk6t27ALZJQJCj_3l7OPPxp-jvMogtMRGkUujD2TqmhZW4JiU9DN8Nb4G4FIfpyK2fwkDnID7TGX7aXLMcCFmHh3u_qOhN-rQr1lUo0_PjtvpvuGdunKKNYqTgeG2Up0ZIxc8bv5eKJpbf76aaGftY"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold">Review by Elena G.</h3>
              <p className="text-on-surface-variant text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">calendar_today</span>
                Posted on Oct 24, 2023 • Le Jardin Bleu
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-label font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-base">translate</span>
                Original Review (French)
              </label>
              <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                VERIFIED
              </span>
            </div>
            <p className="text-lg italic font-body text-on-surface-variant leading-relaxed">
              "L'atmosphère était enchanteresse, comme un paradis caché dans un riad. Le tajine d'agneau aux pruneaux était exceptionnel. Le service est impeccable."
            </p>
            <div className="h-px bg-surface-container-high w-full"></div>
            <label className="font-label font-bold text-xs uppercase tracking-widest text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              AI English Translation
            </label>
            <p className="text-lg font-body text-on-surface leading-relaxed">
              "The atmosphere was enchanting, like a hidden riad paradise. The lamb tagine with prunes was exceptional. The service is impeccable."
            </p>
          </section>

          <section className="bg-surface-container-low rounded-lg p-6 grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">
                Sentiment Analysis
              </label>
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  mood
                </span>
                <span className="text-lg font-bold text-secondary">Positive</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-label font-bold text-[10px] uppercase tracking-widest text-on-surface-variant">
                Toxicity Level
              </label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
                <span className="text-lg font-bold text-secondary">Low (0.08)</span>
              </div>
            </div>
          </section>

          <div className="flex justify-center">
            <span className="bg-primary-fixed text-on-primary-fixed px-4 py-1 rounded-full text-sm font-bold border border-primary/20">
              Pending Moderation
            </span>
          </div>
        </div>

        <div className="p-6 bg-surface-container-low flex justify-between gap-4">
          <button className="px-6 py-2.5 bg-error text-on-error font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">delete</span>
            Reject Review
          </button>
          <button className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Approve Review
          </button>
        </div>
      </div>
    </div>
  );
}
