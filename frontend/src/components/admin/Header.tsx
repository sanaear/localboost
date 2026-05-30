"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#F9F9F7] flex justify-between items-center px-10 py-4 w-full shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-64 focus:ring-2 focus:ring-primary/20 text-sm"
            placeholder="Search analytics..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <button className="p-2 text-slate-600 hover:bg-[#F4F4F2] transition-colors rounded-full relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full"></span>
          </button>
          <button className="p-2 text-slate-600 hover:bg-[#F4F4F2] transition-colors rounded-full">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-on-surface">Admin User</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">System Overseer</p>
          </div>
          <img
            alt="Admin Profile Avatar"
            className="w-10 h-10 rounded-full bg-primary-container"
            data-alt="close-up portrait of a professional male administrator with glasses and a warm smile in a high-tech office setting"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpg8vgPB6fx0tfD7BgexaFnC3L0LStwP1CArDW6IJ6mGgfsYk77s45A6Yv6VUZCX16P-6lKBq0KAKH-wiQxwbX2MMpqCmJVQELgzPyMJNFjJqv5n-IhCJIKlnCJVBG04-RT10eqZMOf2TwZ5rER-3-G8c96MNFOSI6Jod4cDeKbCRK7AaGwLGhA-RT7Zebht3zKSI-dGzchqhGxAgTfIpK2myIKl_LawRifr_ITvmYwgAq3aZBkBO5vmkG8Md0EB6U82pnE5bcO0E"
          />
        </div>
      </div>
    </header>
  );
}
