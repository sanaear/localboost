"use client";

export default function UserProfileSidePanel() {
  return (
    <aside className="w-96 bg-surface-container-lowest rounded-lg shadow-xl flex flex-col overflow-hidden border border-outline-variant/10">
      <div className="p-6 bg-primary-container/10 border-b border-outline-variant/10">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
            Member Since 2023
          </span>
          <button className="p-1 hover:bg-primary/10 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="text-center">
          <img
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md"
            data-alt="Detailed portrait of Amine Alami, a middle-aged Moroccan male business owner with a sophisticated look"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5h2jwTdKvlv7rwV-QKptkAuYJywZEFY2OlYE8VapPNzwZUzbQpanMbaXOmgQe6MSDQIpfVeR-1oGgrnE-rIVg4dIQFgzFs3vUAj86glcweYp8EeSVexciJW322pwQVhZG5sV29peo6JMujMuW-K78ACJv2XGOY9h3vlreiCwEv6Nik0nGH2vtoWfDdSg7_TF-l3IOoSFV6vf6H0YSfoL4sL-LdcOLpyItlyrcOin2HtWtfiX0WV_iU5RE8Z0GZMgZmJjUR90-ah8"
          />
          <h3 className="mt-4 text-xl font-headline font-extrabold text-on-surface">
            Amine Alami
          </h3>
          <p className="text-on-surface-variant text-sm">amine.alami@example.ma</p>
          <div className="mt-4 flex justify-center gap-2">
            <button className="px-4 py-2 bg-inverse-surface text-inverse-on-surface rounded-full text-xs font-bold hover:opacity-90 transition-opacity">
              Suspend User
            </button>
            <button className="px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold hover:shadow-lg transition-all">
              Promote Admin
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-surface-container rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
              Reviews
            </p>
            <p className="text-2xl font-black text-primary">124</p>
          </div>
          <div className="p-4 bg-surface-container rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-1">
              Businesses
            </p>
            <p className="text-2xl font-black text-secondary">3</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">storefront</span>
            Business Ownership
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-outline-variant/10">
              <div className="w-10 h-10 rounded bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <div>
                <p className="text-sm font-bold">Le Palais d'Amine</p>
                <p className="text-[10px] text-on-surface-variant">
                  Restaurant • Marrakech Medina
                </p>
              </div>
              <span className="ml-auto text-[10px] font-bold text-secondary">
                Active
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-outline-variant/10">
              <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined">local_mall</span>
              </div>
              <div>
                <p className="text-sm font-bold">Alami Carpets</p>
                <p className="text-[10px] text-on-surface-variant">
                  Handicrafts • Souq Quarter
                </p>
              </div>
              <span className="ml-auto text-[10px] font-bold text-on-surface-variant">
                Sold
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">rate_review</span>
            Recent Activity
          </h4>
          <div className="space-y-4">
            <div className="relative pl-4 border-l-2 border-primary/20">
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-xs font-bold">Left a 5-star review</p>
              <p className="text-[10px] text-on-surface-variant italic">
                "Best tour of the Medina I've ever had. Very professional!"
              </p>
              <p className="text-[9px] text-on-surface-variant mt-1">2 hours ago</p>
            </div>
            <div className="relative pl-4 border-l-2 border-primary/20">
              <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary/40"></div>
              <p className="text-xs font-bold">Updated business details</p>
              <p className="text-[10px] text-on-surface-variant">
                Le Palais d'Amine - Opening Hours
              </p>
              <p className="text-[9px] text-on-surface-variant mt-1">Yesterday</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 text-center">
        <button className="text-primary text-xs font-bold flex items-center justify-center gap-1 mx-auto hover:underline">
          View Full System Audit Log
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </aside>
  );
}
