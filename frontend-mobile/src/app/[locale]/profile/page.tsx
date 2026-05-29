"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import MobileBottomNav from "@/components/MobileBottomNav";
import { applyTheme, readStoredTheme, setTheme, type Theme } from "@/lib/theme";

const languages = [
  { country: "MA", code: "AR", locale: "ar" },
  { country: "FR", code: "FR", locale: "fr" },
  { country: "GB", code: "EN", locale: "en" },
  { country: "ES", code: "ES", locale: "es" },
];

export default function ProfilePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [theme, setThemeState] = useState<Theme>("light");
  const [avatarUpdated, setAvatarUpdated] = useState(false);

  const activeLanguage = languages.find((item) => item.locale === params.locale);
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const stored = readStoredTheme();
    const current = stored ?? (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    setThemeState(current);
    applyTheme(current);
  }, []);

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
                <h1 className="text-[1.9rem] font-extrabold tracking-[-0.05em] text-[#a36e00]">{tCommon("brand")}</h1>
              </div>
              <div className="rounded-full bg-white px-3 py-2 text-[12px] font-bold text-[#7f7669] mobile-search-shadow">
                {activeLanguage ? `${activeLanguage.country} ${activeLanguage.code}` : params.locale.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-5 pb-5">
            <div className="mobile-fade-up mt-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="grid h-[124px] w-[124px] place-items-center rounded-[36px] bg-[#215d6a] shadow-[0_18px_30px_rgba(32,87,99,0.22)]">
                  <img
                    src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=clean%20avatar%20portrait%20for%20mobile%20profile%2C%20male%20traveler%2C%20simple%20graphic%20style%2C%20teal%20background&image_size=square"
                    alt={t("profileAlt")}
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
                  {t("profilePhotoUpdated")}
                </p>
              ) : null}
            </div>

            <div className="mobile-fade-up mt-8 rounded-[30px] bg-[#d7f2df] px-5 py-5 shadow-[0_14px_24px_rgba(52,154,95,0.08)]" style={{ animationDelay: "90ms" }}>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#61a47c]">{t("fanPassportStatus")}</p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h3 className="text-[1.6rem] font-extrabold tracking-[-0.05em] text-[#138055]">{t("verifiedFanId")}</h3>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#17965f] text-white">
                  <span className="material-symbols-outlined text-[18px]">shield</span>
                </span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b8af9f]">{t("languageSelection")}</p>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {languages.map((item) => {
                  const active = params.locale === item.locale;
                  const targetPath = (() => {
                    if (!pathname) return `/${item.locale}/profile`;
                    const segments = pathname.split("/");
                    if (segments.length < 2) return `/${item.locale}/profile`;
                    segments[1] = item.locale;
                    return segments.join("/");
                  })();

                  return (
                    <button
                      key={item.country}
                      type="button"
                      onClick={() => {
                        window.location.assign(targetPath);
                      }}
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
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b8af9f]">{t("preferences")}</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-[30px] bg-[#f3f1ec] px-4 py-5">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ebe6da] text-[#b08b3b]">
                      <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </span>
                    <div className="flex-1">
                      <h3 className="text-[1.4rem] font-extrabold leading-tight tracking-[-0.05em] text-[#23212c]">{t("pushNotifications")}</h3>
                      <p className="text-[13px] text-[#8d8476]">{t("pushDescription")}</p>
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
                      <h3 className="text-[1.4rem] font-extrabold leading-tight tracking-[-0.05em] text-[#23212c]">{t("appearance")}</h3>
                      <p className="text-[13px] text-[#8d8476]">{isDarkMode ? t("appearanceDark") : t("appearanceLight")}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = isDarkMode ? "light" : "dark";
                        setThemeState(next);
                        setTheme(next);
                      }}
                      className={`relative h-8 w-14 rounded-full transition ${isDarkMode ? "bg-[#a36e00]" : "bg-[#d8d1c5]"}`}
                    >
                      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${isDarkMode ? "left-7" : "left-1"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b8af9f]">{tCommon("brand")}</p>
              <div className="mt-4 divide-y divide-[#eee7dc] rounded-[30px] bg-white/88 px-4 shadow-[0_10px_24px_rgba(31,26,10,0.04)]">
                <Link href={`/${params.locale}/about`} className="flex items-center justify-between py-5">
                  <span className="flex items-center gap-3 text-[15px] font-semibold text-[#60584d]">
                    <span className="material-symbols-outlined text-[18px] text-[#a39a8b]">info</span>
                    {t("about")}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#a39a8b]">chevron_right</span>
                </Link>
                <Link href={`/${params.locale}/rate`} className="flex items-center justify-between py-5">
                  <span className="flex items-center gap-3 text-[15px] font-semibold text-[#60584d]">
                    <span className="material-symbols-outlined text-[18px] text-[#a39a8b]">star</span>
                    {t("rate")}
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
