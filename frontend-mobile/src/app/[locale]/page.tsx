"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

const perspectives = ["tourist", "shopOwner", "admin"] as const;

function getDestination(locale: string, perspective: (typeof perspectives)[number]) {
  if (perspective === "shopOwner") {
    return `/${locale}/merchant/dashboard`;
  }

  return `/${locale}/home`;
}

export default function SignInPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [selectedPerspective, setSelectedPerspective] = useState<(typeof perspectives)[number]>("tourist");
  const [email, setEmail] = useState("jamal@maghrib.com");
  const [password, setPassword] = useState("••••••••");
  const [resetSent, setResetSent] = useState(false);
  const destination = getDestination(params.locale, selectedPerspective);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col px-4 py-6">
          <div className="mobile-card mx-auto mt-4 flex w-full max-w-[360px] flex-1 flex-col items-center px-6 pb-8 pt-7">
            <div className="mobile-fade-up flex h-16 w-16 items-center justify-center rounded-full bg-[#c58a12] text-white shadow-[0_12px_28px_rgba(197,138,18,0.22)]">
              <span className="material-symbols-outlined text-[30px]">confirmation_number</span>
            </div>

            <div className="mt-5 text-center mobile-fade-up" style={{ animationDelay: "80ms" }}>
              <h1 className="text-[2rem] font-extrabold tracking-[-0.05em] text-[#24222f]">{tCommon("brand")}</h1>
              <p className="mt-2 text-sm font-medium text-[#8f8577]">{t("welcomeBack")}</p>
            </div>

            <div className="mt-8 w-full mobile-fade-up" style={{ animationDelay: "140ms" }}>
              <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a907d]">
                {t("selectPerspective")}
              </p>
              <div className="mt-4 flex rounded-full bg-[#f0ede6] p-1.5">
                {perspectives.map((perspective) => (
                  <button
                    key={perspective}
                    type="button"
                    onClick={() => setSelectedPerspective(perspective)}
                    className={`mobile-pill h-11 flex-1 text-[13px] font-extrabold transition-all ${
                      selectedPerspective === perspective
                        ? "mobile-button-gold"
                        : "text-[#66605a]"
                    }`}
                  >
                    {t(`perspectives.${perspective}`)}
                  </button>
                ))}
              </div>
            </div>

            <form className="mt-8 w-full space-y-5 mobile-fade-up" style={{ animationDelay: "220ms" }}>
              <div>
                <label className="mobile-label">{t("email")}</label>
                <input
                  className="mobile-input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div>
                <label className="mobile-label">{t("password")}</label>
                <input
                  className="mobile-input"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </form>

            <button
              type="button"
              onClick={() => setResetSent(true)}
              className="mt-5 text-sm font-extrabold text-[#b27a00] transition hover:text-[#8d6300] mobile-fade-up"
              style={{ animationDelay: "280ms" }}
            >
              {t("forgotPassword")}
            </button>
            {resetSent ? (
              <p className="mt-2 text-center text-[12px] font-semibold text-[#5f8e70] mobile-fade-up">
                {t("resetSent")}
              </p>
            ) : null}

            <Link
              href={destination}
              className="mobile-pill mobile-button-gold mobile-fade-up mt-7 h-14 w-full text-base font-extrabold"
              style={{ animationDelay: "340ms" }}
            >
              {t("signIn")}
            </Link>

            <div className="mobile-divider mt-8 w-full mobile-fade-up" style={{ animationDelay: "400ms" }}>
              {t("or")}
            </div>

            <Link
              href={destination}
              className="mobile-pill mobile-button-secondary mobile-fade-up mt-6 flex h-14 w-full items-center justify-center gap-3 text-[15px] font-bold"
              style={{ animationDelay: "460ms" }}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-sm shadow-sm">G</span>
              {t("continueWithGoogle")}
            </Link>

            <p className="mt-8 text-center text-sm text-[#837966] mobile-fade-up" style={{ animationDelay: "520ms" }}>
              {t("newTo")}{" "}
              <Link href={`/${params.locale}/signup`} className="font-extrabold text-[#b27a00]">
                {t("createAccount")}
              </Link>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-10 pb-2">
            <span className="h-1 w-9 rounded-full bg-[#d3b57d]" />
            <span className="h-1 w-5 rounded-full bg-[#7cbcaa]" />
          </div>
        </div>
      </section>
    </main>
  );
}
