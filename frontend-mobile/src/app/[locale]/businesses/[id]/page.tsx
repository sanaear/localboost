"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useBusinessAverageRating, useBusinessDetail, useBusinessReviews } from "@/lib/queries";

export default function BusinessDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const businessId = Number(params.id);
  const [saved, setSaved] = useState(false);

  const businessQuery = useBusinessDetail(businessId);
  const ratingQuery = useBusinessAverageRating(businessId);
  const reviewsQuery = useBusinessReviews(businessId);

  const primaryImage = useMemo(() => businessQuery.data?.images?.[0], [businessQuery.data?.images]);

  if (!Number.isFinite(businessId)) {
    return (
      <main className="mobile-app-shell">
        <section className="mobile-phone overflow-hidden bg-[#faf8f2]">
          <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col p-6 text-[14px] font-bold text-[#7f7669]">
            Invalid business id
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone overflow-hidden bg-[#faf8f2]">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col">
          <div className="relative h-[310px]">
            {primaryImage ? (
              <img src={primaryImage} alt={businessQuery.data?.name ?? "Business"} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[#efece6]" />
            )}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
              <Link href={`/${params.locale}/discover`} className="grid h-9 w-9 place-items-center rounded-full bg-white/86 text-[#70685c] shadow-sm">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </Link>
              <button
                type="button"
                onClick={() => setSaved((current) => !current)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/86 text-[#70685c] shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {saved ? "favorite" : "favorite_border"}
                </span>
              </button>
            </div>
          </div>

          <div className="-mt-8 flex-1 rounded-t-[34px] bg-[#faf8f2] px-5 pb-6 pt-6">
            {businessQuery.isLoading ? (
              <div className="rounded-[26px] border border-[#ece2d3] bg-white px-4 py-4 text-[14px] font-bold text-[#7f7669] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                Loading…
              </div>
            ) : businessQuery.isError || !businessQuery.data ? (
              <div className="rounded-[26px] border border-[#f1d0d0] bg-white px-4 py-4 text-[14px] font-bold text-[#9b3e3e] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
                Unable to load business
              </div>
            ) : (
              <>
                <h1 className="text-[2.15rem] font-extrabold leading-[0.95] tracking-[-0.07em] text-[#23212c]">
                  {businessQuery.data.name}
                </h1>
                <p className="mt-2 text-[15px] text-[#70685d]">
                  {[businessQuery.data.city, businessQuery.data.user?.address].filter(Boolean).join(" · ")}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#7c7367]">
                  {ratingQuery.data ? (
                    <span className="flex items-center gap-1 font-extrabold text-[#a36e00]">
                      <span className="material-symbols-outlined text-[16px]">star</span>
                      {ratingQuery.data.average.toFixed(1)}{" "}
                      <span className="font-semibold text-[#8d8476]">({ratingQuery.data.count} reviews)</span>
                    </span>
                  ) : null}
                  {businessQuery.data.category?.name_en ? (
                    <span className="rounded-full bg-[#ebf8ef] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#178f60]">
                      {businessQuery.data.category.name_en}
                    </span>
                  ) : null}
                </div>

                {businessQuery.data.description ? (
                  <div className="mt-5 rounded-[26px] border border-[#eadfce] bg-white px-4 py-4 text-[13px] leading-6 text-[#7a7266] shadow-[0_10px_25px_rgba(31,26,10,0.05)]">
                    {businessQuery.data.description}
                  </div>
                ) : null}

                <div className="mt-7">
                  <h2 className="text-[1.45rem] font-extrabold tracking-[-0.05em] text-[#23212c]">
                    Reviews
                  </h2>

                  {reviewsQuery.isLoading ? (
                    <div className="mt-3 rounded-[20px] border border-[#ece2d3] bg-white px-4 py-4 text-[13px] font-bold text-[#7f7669] shadow-[0_8px_24px_rgba(31,26,10,0.04)]">
                      Loading reviews…
                    </div>
                  ) : reviewsQuery.isError ? (
                    <div className="mt-3 rounded-[20px] border border-[#f1d0d0] bg-white px-4 py-4 text-[13px] font-bold text-[#9b3e3e] shadow-[0_8px_24px_rgba(31,26,10,0.04)]">
                      Unable to load reviews
                    </div>
                  ) : (reviewsQuery.data ?? []).length === 0 ? (
                    <div className="mt-3 rounded-[20px] border border-[#ece2d3] bg-white px-4 py-4 text-[13px] font-bold text-[#7f7669] shadow-[0_8px_24px_rgba(31,26,10,0.04)]">
                      No reviews yet
                    </div>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {(reviewsQuery.data ?? []).slice(0, 6).map((review) => (
                        <div key={review.id} className="rounded-[20px] border border-[#ece2d3] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(31,26,10,0.04)]">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[13px] font-extrabold text-[#2a2730]">
                              {[review.user?.first_name, review.user?.last_name].filter(Boolean).join(" ") || "Anonymous"}
                            </span>
                            <span className="flex items-center gap-1 text-[12px] font-extrabold text-[#a36e00]">
                              <span className="material-symbols-outlined text-[14px]">star</span>
                              {review.rating}
                            </span>
                          </div>
                          {review.content ? (
                            <p className="mt-2 text-[12px] leading-5 text-[#7a7266]">
                              {review.content}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

