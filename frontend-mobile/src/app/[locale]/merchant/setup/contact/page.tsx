"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import MerchantBottomNav from "@/components/MerchantBottomNav";
import { ErrorState } from "@/components/UiState";
import { API_BASE_URL } from "@/lib/api";
import { clearMerchantSetupDraft, readMerchantSetupStep1, readMerchantSetupStep2, writeMerchantSetupStep3 } from "@/lib/merchantSetup";

const days = [
  { name: "Monday", start: "09:00 AM", end: "07:00 PM", enabled: true },
  { name: "Tuesday", start: "09:00 AM", end: "07:00 PM", enabled: true },
  { name: "Wednesday", start: "09:00 AM", end: "07:00 PM", enabled: true },
  { name: "Thursday", start: "09:00 AM", end: "07:00 PM", enabled: true },
  { name: "Friday", start: "09:00 AM", end: "01:00 PM", enabled: true },
  { name: "Saturday", start: "10:00 AM", end: "08:00 PM", enabled: true },
  { name: "Sunday", start: "--:--", end: "--:--", enabled: false },
];

export default function MerchantContactSetupPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("merchantSetup");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [enabledDays, setEnabledDays] = useState<Record<string, boolean>>(
    Object.fromEntries(days.map((day) => [day.name, day.enabled])),
  );
  const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openingHours = useMemo(() => {
    return Object.fromEntries(
      days.map((day) => [
        day.name.toLowerCase(),
        { start: day.start, end: day.end, enabled: Boolean(enabledDays[day.name]) },
      ]),
    );
  }, [enabledDays]);

  useEffect(() => {
    writeMerchantSetupStep3({
      openingHours,
      whatsapp: whatsapp.trim() || undefined,
      phone: phone.trim() || undefined,
    });
  }, [openingHours, phone, whatsapp]);

  async function handleFinish() {
    setSubmitError(false);
    setIsSubmitting(true);

    const step1 = readMerchantSetupStep1();
    const step2 = readMerchantSetupStep2();
    if (!step1 || !step2) {
      setSubmitError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ai2/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step1: {
            businessName: step1.businessName,
            category: step1.category,
          },
          step2: {
            logo: step2.logo,
            photos: step2.photos,
          },
          step3: {
            openingHours,
            whatsapp: whatsapp.trim() || undefined,
            phoneNumber: phone.trim() || undefined,
          },
        }),
      });

      if (!response.ok) throw new Error("Request failed");
      clearMerchantSetupDraft();
      router.replace(`/${params.locale}/merchant/submitted`);
    } catch {
      setSubmitError(true);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col overflow-hidden bg-[#fbfaf6]">
          <div className="px-4 pb-3 pt-4 mobile-fade-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={`/${params.locale}/merchant/setup/business`} className="text-[#866840]">
                  <span className="material-symbols-outlined text-[20px]">menu</span>
                </Link>
                <div>
                  <p className="text-[1rem] font-extrabold leading-tight tracking-[-0.04em] text-[#9c6a00]">
                    {t("headerLine1")}
                    <br />
                    {t("headerLine2")}
                  </p>
                </div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm">
                <span className="material-symbols-outlined text-[18px] text-[#1f3d4a]">person</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#9e9281]">{t("finalStep")}</p>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#c08a12]">{t("ready")}</p>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#ebe5da]">
              <div className="h-full w-full rounded-full bg-[#eba521]" />
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            {submitError ? (
              <div className="mt-5">
                <ErrorState
                  title={tCommon("errorTitle")}
                  description={tCommon("errorDescription")}
                  onRetry={() => void handleFinish()}
                  retryLabel={tCommon("retry")}
                />
              </div>
            ) : null}
            <div className="mobile-fade-up mt-4" style={{ animationDelay: "60ms" }}>
              <h1 className="text-[2.5rem] font-extrabold leading-[0.93] tracking-[-0.07em] text-[#23212c]">
                {t("contactTitleLine1")}
                <br />
                {t("contactTitleLine2")}
              </h1>
              <p className="mt-4 max-w-[315px] text-[15px] leading-7 text-[#7d7468]">
                {t("contactDescription")}
              </p>
            </div>

            <div className="mobile-fade-up mt-7" style={{ animationDelay: "120ms" }}>
              <div className="flex items-center gap-2 text-[1rem] font-extrabold text-[#4f6f5e]">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                {t("weeklySchedule")}
              </div>

              <div className="mt-4 rounded-[30px] bg-[#f4f1eb] px-4 py-3">
                {days.map((day, index) => {
                  const enabled = enabledDays[day.name];

                  return (
                    <div
                      key={day.name}
                      className={`${index !== days.length - 1 ? "border-b border-[#e7e1d6]" : ""} py-3`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setEnabledDays((current) => ({
                              ...current,
                              [day.name]: !current[day.name],
                            }))
                          }
                          className={`relative h-7 w-12 rounded-full transition ${
                            enabled ? "bg-[#a36e00]" : "bg-[#ddd7cd]"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${
                              enabled ? "left-[22px]" : "left-0.5"
                            }`}
                          />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-bold text-[#38332d]">{t(`days.${day.name.toLowerCase()}`)}</div>
                          <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-[#9a9082]">
                            <span className="rounded-full bg-white px-2 py-1">{day.start}</span>
                            <span>{t("to")}</span>
                            <span className="rounded-full bg-white px-2 py-1">{day.end}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mobile-fade-up mt-7" style={{ animationDelay: "180ms" }}>
              <div className="flex items-center gap-2 text-[1rem] font-extrabold text-[#4f6f5e]">
                <span className="material-symbols-outlined text-[18px]">contact_phone</span>
                {t("contactChannels")}
              </div>
              <div className="mt-4 space-y-3">
                <input
                  className="mobile-input"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                  placeholder="WhatsApp"
                />
                <input
                  className="mobile-input"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+212 ..."
                />
              </div>
            </div>

            <div className="mobile-fade-up mt-7 flex gap-3" style={{ animationDelay: "240ms" }}>
              <Link
                href={`/${params.locale}/merchant/setup/photos`}
                className="mobile-pill h-12 flex-1 border border-[#e4d9ca] bg-white text-[13px] font-bold text-[#6f675b]"
              >
                <span className="material-symbols-outlined mr-2 text-[18px]">arrow_back</span>
                {t("previousStep")}
              </Link>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void handleFinish()}
              className="mobile-pill mobile-button-gold mobile-fade-up mt-4 h-14 w-full text-[1.1rem] font-extrabold disabled:opacity-60"
              style={{ animationDelay: "300ms" }}
            >
              {t("finish")}
            </button>
          </div>

          <MerchantBottomNav activeIndex={3} locale={params.locale} />
        </div>
      </section>
    </main>
  );
}
