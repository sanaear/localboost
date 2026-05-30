"use client";

export default function PreviewPanel() {
  return (
    <div className="fixed top-0 right-0 h-screen w-1/2 shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-50 border-l border-surface-variant/30 flex flex-col overflow-hidden" style={{ background: "rgba(249, 249, 247, 0.8)", backdropFilter: "blur(24px)" }}>
      <div className="px-8 py-6 border-b border-surface-variant/20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h3 className="text-xl font-headline font-bold">Review Submission</h3>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-error text-on-error font-bold text-sm shadow-md shadow-error/20">
            <span className="material-symbols-outlined text-sm">block</span>
            Reject
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-on-secondary font-bold text-sm shadow-md shadow-secondary/20">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            Approve
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">
            Tourist Preview
          </h4>
          <div className="w-full max-w-sm mx-auto bg-surface-container-lowest rounded-lg shadow-xl overflow-hidden ring-1 ring-black/5 transform rotate-1">
            <div className="h-56 relative overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVM5ZSghCEE-DZj5MRr2O8e8ltVHmFEaXCnms7_QR3EV1R94QpP6xQ5Amg8r8kmgNqyecV-DT3egJLPLiuEJ-N1Lau9JHp1exwsDvRj0OxKVMLR8hhvkzCVWgfzMF4L9k6RbuiG9mcaKEn-FIQ-Jes3SamDWn3YCCLmL2JzgBvBXw1BMe4VLo2KSPGrzrshWQyGvFaSe3kISvcH6ulD0DMJYhalFyN4LSaVP8tu8HFu-IQyNp4BUaD3qLnKlX4SBweOMf-j8qKbzA"
              />
              <div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                New Spot
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-2xl font-headline font-extrabold text-[#1A1C1B]">
                  Café des Épices
                </h5>
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold text-sm">4.9</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
                <span className="material-symbols-outlined text-xs">location_on</span>
                <span>Medina, Marrakech</span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Traditional Moroccan coffee house serving authentic mint tea and spice-infused pastries in the heart of the Souk.
              </p>
              <button className="w-full py-3 rounded-full bg-[#1A1C1B] text-white font-bold text-sm tracking-wide">
                View Profile
              </button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">
            Admin Internal Notes
          </h4>
          <textarea
            className="w-full h-32 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:ring-0 rounded-t-lg p-4 text-sm transition-all"
            placeholder="Add private notes for the moderation team..."
          ></textarea>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-outline mb-4">
            Status History
          </h4>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-on-primary-fixed">
                    edit
                  </span>
                </div>
                <div className="w-px h-full bg-surface-container-high mt-1"></div>
              </div>
              <div>
                <p className="text-sm font-bold">Submitted for Review</p>
                <p className="text-xs text-on-surface-variant">
                  Oct 24, 2023 • 14:32 by Yassine Amrani
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-outline">
                    person
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-outline">Assigned to Admin</p>
                <p className="text-xs text-outline">Oct 24, 2023 • 15:45 by System</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
