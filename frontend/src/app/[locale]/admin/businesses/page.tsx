"use client";

import Sidebar from "@/components/admin/Sidebar";
import BusinessesTable from "@/components/admin/businesses/BusinessesTable";
import PreviewPanel from "@/components/admin/businesses/PreviewPanel";

export default function BusinessesPage() {
  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex">
      <Sidebar />

      <main className="ml-64 flex-1 min-h-screen relative">
        <header className="sticky top-0 z-40 bg-[#F9F9F7] flex justify-between items-center px-10 py-4 w-full shadow-sm">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-outline"
                placeholder="Search businesses, owners, or IDs..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6 ml-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">
                notifications
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">
                settings
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-primary/20">
              <img
                alt="Admin Profile Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWSavXYMNDsrQMf6JlNymOvyzxnxQB-mUqjq8328u4jPes6Vmw7cKnMvjAUyjSkGM9Az39Fc7J_yJPJGl0p-13fN8HXbdxh62Ma0gz7pn-9JTzCt05kfgjoDu6A4I1i-URQGinvN1EtPh9mwR-sxHEsQQRUE_6b_P6kQeSWP_Y_nfY10yMTPMqz8ywatkRe82MU--N-5GfC5aTaCS_E2GafLg1ISouamz7yJkjejmuRtot73e0m5WiTmlbX0BnzseDauHngz8MvQ0"
              />
            </div>
          </div>
        </header>

        <section className="px-10 py-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">
                Business Moderation
              </h2>
              <p className="text-on-surface-variant mt-1">
                Review and manage local establishment listings
              </p>
            </div>
            <div className="flex gap-3">
              <select className="bg-surface-container-low border-none rounded-full px-6 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer">
                <option>All Statuses</option>
                <option selected>Pending Review</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Suspended</option>
              </select>
              <button className="bg-surface-container-highest flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Advanced Filter
              </button>
            </div>
          </div>

          <BusinessesTable />
        </section>

        <PreviewPanel />
      </main>
    </div>
  );
}
