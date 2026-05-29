"use client";

import Link from "next/link";
import { useState } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";

const languages = [
  { country: "MA", code: "AR" },
  { country: "FR", code: "FR" },
  { country: "GB", code: "EN" },
  { country: "ES", code: "ES" },
];

export default function ProfilePage({
  params,
}: {
  params: { locale: string };
}) {
  const [language, setLanguage] = useState("MA");
  const [pushEnabled, setPushEnabled] = useState(true);
  const [lightMode, setLightMode] = useState(false);
  const [avatarUpdated, setAvatarUpdated] = useState(false);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-2 pt-5">
            <div className="mobile-fade-up flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c54b23] text-white shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                <h1 className="text-[1.9rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">LocalBoost</h1>
              </div>
              <div className="rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                GB EN
              </div>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-5 pb-5">
            <div className="mobile-fade-up mt-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="grid h-[124px] w-[124px] place-items-center rounded-[36px] bg-[#215d6a] shadow-[0_18px_30px_rgba(32,87,99,0.22)]">
                  <img
                    src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=clean%20avatar%20portrait%20for%20mobile%20profile%2C%20male%20traveler%2C%20simple%20graphic%20style%2C%20teal%20background&image_size=square"
                    alt="Profile"
                    className="h-[96px] w-[96px] rounded-[28px] object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setAvatarUpdated((current) => !current)}
                  className="absolute bottom-1 right-1 grid h-10 w-10 place-items-center rounded-full bg-[#a36e00] text-white shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <h2 className="mt-6 text-[2.25rem] font-extrabold leading-[0.95] tracking-[-0.07em] text-[#23212c]">
                Amine Alami
              </h2>
              <p className="mt-1 text-[15px] text-[#787064]">amine.alami@worldcup2030.ma</p>
              {avatarUpdated ? (
                <p className="mt-3 text-[12px] font-semibold text-[#5f8e70]">
                  Profile photo updated.
                </p>
              ) : null}
            </div>

            <div className="mobile-fade-up mt-8 rounded-[30px] bg-[#d7f2df] px-5 py-5 shadow-[0_14px_24px_rgba(52,154,95,0.08)]" style={{ animationDelay: "90ms" }}>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#61a47c]">Fan passport status</p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h3 className="text-[1.6rem] font-extrabold tracking-[-0.05em] text-[#138055]">Verified Fan ID</h3>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#17965f] text-white">
                  <span className="material-symbols-outlined text-[18px]">shield</span>
                </span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b8af9f]">Language selection</p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {languages.map((item) => {
                  const active = language === item.country;

                  return (
                    <button
                      key={item.country}
                      type="button"
                      onClick={() => setLanguage(item.country)}
                      className={`rounded-[24px] px-2 py-4 text-center transition ${
                        active ? "bg-[#eba521] text-white shadow-[0_14px_24px_rgba(235,165,33,0.22)]" : "bg-[#f1efea] text-[#696259]"
                      }`}
                    >
                      <div className="text-[1.3rem] font-extrabold">{item.country}</div>
                      <div className={`mt-1 text-[10px] font-extrabold uppercase tracking-[0.16em] ${active ? "text-white/80" : "text-[#978f85]"}`}>
                        {item.code}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b8af9f]">Preferences</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-[30px] bg-[#f3f1ec] px-4 py-5">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ebe6da] text-[#b08b3b]">
                      <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </span>
                    <div className="flex-1">
                      <h3 className="text-[1.4rem] font-extrabold leading-tight tracking-[-0.05em] text-[#23212c]">Push Notifications</h3>
                      <p className="text-[13px] text-[#8d8476]">Match alerts &amp; local offers</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPushEnabled((current) => !current)}
                      className={`relative h-8 w-14 rounded-full transition ${pushEnabled ? "bg-[#a36e00]" : "bg-[#d8d1c5]"}`}
                    >
                      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${pushEnabled ? "left-7" : "left-1"}`} />
                    </button>
                  </div>
                </div>

                <div className="rounded-[30px] bg-[#f3f1ec] px-4 py-5">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#dbece4] text-[#3e8e67]">
                      <span className="material-symbols-outlined text-[20px]">dark_mode</span>
                    </span>
                    <div className="flex-1">
                      <h3 className="text-[1.4rem] font-extrabold leading-tight tracking-[-0.05em] text-[#23212c]">Appearance</h3>
                      <p className="text-[13px] text-[#8d8476]">Currently in Light Mode</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLightMode((current) => !current)}
                      className={`relative h-8 w-14 rounded-full transition ${lightMode ? "bg-[#a36e00]" : "bg-[#d8d1c5]"}`}
                    >
                      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${lightMode ? "left-7" : "left-1"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b8af9f]">LocalBoost</p>
              <div className="mt-4 divide-y divide-[#eee7dc] rounded-[30px] bg-white/88 px-4 shadow-[0_10px_24px_rgba(31,26,10,0.04)]">
                <Link href={`/${params.locale}/about`} className="flex items-center justify-between py-5">
                  <span className="flex items-center gap-3 text-[15px] font-semibold text-[#60584d]">
                    <span className="material-symbols-outlined text-[18px] text-[#a39a8b]">info</span>
                    About LocalBoost
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#a39a8b]">chevron_right</span>
                </Link>
                <Link href={`/${params.locale}/rate`} className="flex items-center justify-between py-5">
                  <span className="flex items-center gap-3 text-[15px] font-semibold text-[#60584d]">
                    <span className="material-symbols-outlined text-[18px] text-[#a39a8b]">star</span>
                    Rate the app
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#a39a8b]">chevron_right</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 pt-2">
            <MobileBottomNav locale={params.locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
