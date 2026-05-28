"use client";

import Sidebar from "@/components/admin/Sidebar";
import CategoryCard from "@/components/admin/categories/CategoryCard";

const categories = [
  {
    id: "1",
    name: "Restaurants",
    icon: "restaurant",
    businessCount: 124,
    translations: {
      ar: "مطاعم",
      fr: "Restaurants",
      es: "Restaurantes",
    },
    color: "secondary" as const,
  },
  {
    id: "2",
    name: "Artisans",
    icon: "construction",
    businessCount: 86,
    translations: {
      ar: "حرفيون",
      fr: "Artisans",
      es: "Artesanos",
    },
    color: "primary" as const,
    isEditing: true,
  },
  {
    id: "3",
    name: "Cafés",
    icon: "local_cafe",
    businessCount: 52,
    translations: {
      ar: "مقاهي",
      fr: "Cafés",
      es: "Cafeterías",
    },
    color: "tertiary" as const,
  },
  {
    id: "4",
    name: "Boutiques",
    icon: "shopping_bag",
    businessCount: 210,
    translations: {
      ar: "متاجر",
      fr: "Boutiques",
      es: "Boutiques",
    },
    color: "secondary" as const,
  },
];

export default function CategoriesPage() {
  return (
    <div className="bg-surface font-body text-on-surface">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <header className="flex justify-between items-center px-8 py-6 sticky top-0 glass-panel z-30">
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-extrabold text-primary tracking-tight">
              Categories Manager
            </h2>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary-container transition-all"
                placeholder="Search categories..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
              <div className="text-right">
                <p className="text-xs font-bold">Admin User</p>
                <p className="text-[10px] text-slate-500">Super Admin</p>
              </div>
              <img
                className="w-10 h-10 rounded-full object-cover"
                data-alt="close-up portrait of professional male admin user with a friendly expression and sharp business attire"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeCr--go7OhsXJrS853NdQUTO3c7dXGYqu4I9Fu0enmvhakF_S7RIA3IppurEnKgVzKRpe3JgEk-SGruAQB_kGNTJJ1APqxEZOmWxFsmc1t2wrnj5P-fBQPSrb02MkwnchDVhB2_rkydAkBJuba81u1COlCmr_iw4HeAt00QPSNBiVrr82Ta25SeEcMoiwq_pqDoDJEIfPf3qWOQd1Vsjn5WGClk0vvBUhW5Oqn7FYqs8kMnKSBRd04taxNijxSVI3xwtdq-8XZ5Y"
              />
            </div>
          </div>
        </header>

        <div className="px-12 py-8">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-xl">
              <h3 className="text-3xl font-bold mb-2 text-on-surface">
                Digital Catalog Structure
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Organize your LocalBoost directory into meaningful clusters.
                Manage multi-language translations and visual identifiers for each business vertical.
              </p>
            </div>
            <button className="bg-primary hover:bg-primary-container text-on-primary px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-all">
              <span className="material-symbols-outlined">add</span>
              Add New Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A1C1B] text-white p-10 rounded-xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-tertiary font-black text-xs uppercase tracking-widest mb-4">
                  Total Reach
                </p>
                <h5 className="text-4xl font-extrabold mb-2">472</h5>
                <p className="text-slate-400 text-sm">
                  Active businesses across all categories.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-9xl">analytics</span>
              </div>
            </div>

            <div className="col-span-2 bg-surface-container-low p-10 rounded-xl flex items-center gap-12">
              <div className="w-1/3 h-48 rounded-lg overflow-hidden relative">
                <img
                  className="w-full h-full object-cover"
                  data-alt="vibrant Moroccan souk scene with colorful ceramics and traditional lanterns under warm atmospheric lighting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8w30TMFBePJE_udrEV09fMkJ5_dsqmooBhDPGbnQwh_OSwH9ZjgA9aEKdROKLIM4G2qcXomjCreSbI2n018L_HP4N2cVLYCSSj_BmuHy0dfx3IaY3hK0sNzlUkTo4K8s-O2JIoVCWLr7k1lGTTDGNQwpZ5pQU4Yspx5mGDmwHvxP9J1LllO-Ql25rkrosJXP3boLOdLU-6aSpO0EQ_QyQ_I7ditDZne1k5Y_y6-bRjcZHSdVF75cnTYqQ1UjVmTdsZXVwVZZme48"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
              </div>

              <div className="flex-1">
                <h5 className="text-2xl font-bold mb-4">Promote Local Culture</h5>
                <p className="text-on-surface-variant mb-6 text-sm leading-relaxed">
                  Each category you create helps tourists find authentic experiences.
                  LocalBoost's 2030 vision aims to digitize 1,000+ local artisans before the global festivities.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Artisans Growing
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Food Trends Up
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
