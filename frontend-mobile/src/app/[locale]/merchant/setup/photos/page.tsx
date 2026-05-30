"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import MerchantBottomNav from "@/components/MerchantBottomNav";
import { readMerchantSetupStep2, writeMerchantSetupStep2 } from "@/lib/merchantSetup";

export default function MerchantPhotosSetupPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = useTranslations("merchantSetup");
  const [uploads, setUploads] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const saved = readMerchantSetupStep2();
    if (!saved) return;
    setUploads(saved.photos ?? []);
  }, []);

  useEffect(() => {
    writeMerchantSetupStep2({ photos: uploads, logo: null });
  }, [uploads]);

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files).slice(0, 10);
    const dataUrls = await Promise.all(incoming.map((file) => readFileAsDataUrl(file)));
    setUploads((current) => [...current, ...dataUrls].slice(0, 10));
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
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#9e9281]">{t("step", { current: 2, total: 3 })}</p>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#c08a12]">{t("progress", { percent: 66 })}</p>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#ebe5da]">
              <div className="h-full w-2/3 rounded-full bg-[#eba521]" />
            </div>
          </div>

          <div className="mobile-scrollbar-hidden flex-1 overflow-y-auto px-4 pb-5">
            <div className="mobile-fade-up mt-6 text-center" style={{ animationDelay: "80ms" }}>
              <h1 className="text-[2.95rem] font-extrabold leading-[0.92] tracking-[-0.08em] text-[#23212c]">
                {t("photosTitleLine1")}
                <br />
                {t("photosTitleLine2")}
              </h1>
              <p className="mx-auto mt-4 max-w-[300px] text-[17px] leading-7 text-[#7d7468]">
                {t("photosDescription")}
              </p>
            </div>

            <div className="mobile-fade-up mt-8 rounded-[34px] border border-dashed border-[#e2d5c3] bg-[#faf7f2] px-5 py-8 text-center" style={{ animationDelay: "150ms" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => void handleFiles(event.target.files)}
              />
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#efe7db] text-[#ab853b]">
                <span className="material-symbols-outlined text-[26px]">imagesmode</span>
              </div>
              <p className="mt-5 text-[1.6rem] font-extrabold leading-tight tracking-[-0.05em] text-[#b57d09]">
                {t("photosUploadCta")}
              </p>
              <p className="mt-3 text-[12px] text-[#9b9181]">{t("photosSupport")}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mobile-pill mobile-button-gold mx-auto mt-6 h-12 px-6 text-[13px] font-extrabold"
              >
                {t("addMore")}
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {uploads.map((image, index) => (
                <div
                  key={image}
                  className="mobile-fade-up relative overflow-hidden rounded-[28px]"
                  style={{ animationDelay: `${220 + index * 70}ms` }}
                >
                  <img src={image} alt={t("uploadAlt", { index: index + 1 })} className="h-[155px] w-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setUploads((current) => current.filter((item) => item !== image))
                    }
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/88 text-[#8a8174] shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="mobile-fade-up mt-6 flex gap-3" style={{ animationDelay: "420ms" }}>
              <Link
                href={`/${params.locale}/merchant/setup/business`}
                className="mobile-pill h-12 flex-1 border border-[#e4d9ca] bg-white text-[13px] font-bold text-[#6f675b]"
              >
                {t("back")}
              </Link>
              <Link
                href={`/${params.locale}/merchant/setup/contact`}
                className="mobile-pill mobile-button-gold h-12 flex-1 text-[13px] font-extrabold"
              >
                {t("continue")}
              </Link>
            </div>
          </div>

          <MerchantBottomNav activeIndex={2} locale={params.locale} />
        </div>
      </section>
    </main>
  );
}
