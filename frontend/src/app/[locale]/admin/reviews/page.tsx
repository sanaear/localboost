"use client";

import Sidebar from "@/components/admin/Sidebar";
import ReviewsTable from "@/components/admin/reviews/ReviewsTable";
import ReviewDetailsModal from "@/components/admin/reviews/ReviewDetailsModal";

export default function ReviewsPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex">
      <Sidebar />

      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-[#F9F9F7] shadow-sm flex justify-between items-center px-6 py-3 w-full">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary w-64 transition-all"
                placeholder="Search reviews..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-[#F4F4F2] rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-slate-600 hover:bg-[#F4F4F2] rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
              <img
                alt="Admin Profile Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTFBVSmxABf4X03HpO_mX55iitc4Kde5iR_LnC_xA7jRXjF0nLjOg1v_vYwvqRqNGS82HQUPhVAKC9vthsUTKnfsaIZ2qKTJgXySJmhruEf7UJMB3fGRKqvPxVTgtXOGmTvH9hRE5mg2AxpdYEdWEFZ8LHzE5Zj0KJY42FSaB38_ox_19IO0e6nqzbEzP4_B4_MuD_wmT81s1fMy8vJFgTokI8EVRKM2CPlhrEeF_4_Jk7wA67TiI3UqxwRltkdkvpiH7Vh1aysE4"
              />
            </div>
          </div>
        </header>

        <div className="p-8 flex-1">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-on-surface">
                Review Moderation
              </h2>
              <p className="text-on-surface-variant mt-1">
                Manage and moderate incoming business reviews with AI-powered safety checks.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-full border border-outline-variant text-primary font-semibold hover:bg-surface-container-low transition-colors">
                Filter by Score
              </button>
              <button className="px-6 py-2 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all">
                Bulk Approve
              </button>
            </div>
          </div>

          <ReviewsTable />
        </div>
      </main>

      <ReviewDetailsModal />
    </div>
  );
}
