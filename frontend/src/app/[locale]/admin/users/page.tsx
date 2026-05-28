"use client";

import Sidebar from "@/components/admin/Sidebar";
import UserTable from "@/components/admin/users/UserTable";
import UserProfileSidePanel from "@/components/admin/users/UserProfileSidePanel";

export default function UsersPage() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Sidebar />

      <main className="ml-64 min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 zellige-pattern pointer-events-none"></div>

        <header className="sticky top-0 z-40 bg-[#F9F9F7] flex justify-between items-center px-8 py-4 w-full shadow-sm border-b border-surface-container-low">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm w-80 focus:ring-2 focus:ring-primary-container transition-all"
                placeholder="Search users by name or email..."
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
            <div className="h-8 w-[1px] bg-surface-container-low mx-2"></div>
            <img
              alt="Admin Profile Avatar"
              className="h-9 w-9 rounded-full border-2 border-primary-container object-cover"
              data-alt="Professional portrait of a male administrative manager with dark hair and a confident smile in a modern office setting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH9AtTg--iBnZG2GJ6LQhhJrkHzZCsdIm4K-1UVgZq7XK3JhahtDidUq7xjLi8-fDiSktT44438IKHikg8MpfqJ0ywYA4KgMGiPK_UbGwE3zrWTLFHZucCjyPAkD9wZMzCeuEwk9_r45Rst_2lupGnna4DiFZCeV3YkYjQGG5jJQt_B383Odogodxh1FCCikQhToOnllSEbrA2VbNrwXJzY8BKDMm7W5LFxvoRkd422C5RJj0kLcaU0IN4eQf5KirYq4GdxfZ8twk"
            />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto flex gap-8">
          <UserTable />
          <UserProfileSidePanel />
        </div>
      </main>
    </div>
  );
}
