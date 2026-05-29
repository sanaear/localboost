"use client";

import Link from "next/link";
import { useState } from "react";

const roles = ["Tourist", "Shop Owner", "Admin"] as const;

function getSignupDestination(locale: string, role: (typeof roles)[number]) {
  if (role === "Shop Owner") {
    return `/${locale}/merchant/setup/business`;
  }

  return `/${locale}/onboarding/discover`;
}

export default function SignupPage({
  params,
}: {
  params: { locale: string };
}) {
  const [selectedRole, setSelectedRole] = useState<(typeof roles)[number]>("Tourist");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsWarning, setTermsWarning] = useState(false);
  const createAccountHref = acceptedTerms
    ? getSignupDestination(params.locale, selectedRole)
    : `/${params.locale}/signup`;
  const googleSignupHref = getSignupDestination(params.locale, selectedRole);

  return (
    <main className="mobile-app-shell">
      <section className="mobile-phone mobile-light mobile-pattern-light">
        <div className="mobile-content flex min-h-[calc(100vh-32px)] flex-col px-4 py-6">
          <div className="mobile-card mx-auto mt-2 flex w-full max-w-[360px] flex-1 flex-col items-center px-6 pb-8 pt-7">
            <div className="mobile-fade-up flex h-16 w-16 items-center justify-center rounded-full bg-[#a87500] text-white shadow-[0_12px_28px_rgba(168,117,0,0.24)]">
              <span className="material-symbols-outlined text-[30px]">confirmation_number</span>
            </div>

            <div className="mt-5 text-center mobile-fade-up" style={{ animationDelay: "80ms" }}>
              <h1 className="text-[2rem] font-extrabold tracking-[-0.05em] text-[#24222f]">LocalBoost</h1>
              <p className="mt-2 text-[1.65rem] font-semibold tracking-[-0.05em] text-[#5f554a]">
                Create Your Account
              </p>
            </div>

            <div className="mt-7 w-full rounded-[30px] bg-[#fbfaf7] px-5 py-6 shadow-[inset_0_0_0_1px_rgba(235,228,216,0.9)] mobile-fade-up" style={{ animationDelay: "140ms" }}>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9a907d]">
                Select your role
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {roles.slice(0, 2).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`mobile-pill h-12 px-4 text-[15px] font-extrabold ${
                      selectedRole === role
                        ? "mobile-button-gold"
                        : "bg-[#e3e2e1] text-[#69625d]"
                    }`}
                  >
                    {role}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedRole("Admin")}
                  className={`mobile-pill col-span-2 h-11 text-[15px] font-extrabold ${
                    selectedRole === "Admin"
                      ? "mobile-button-gold"
                      : "bg-[#e3e2e1] text-[#69625d]"
                  }`}
                >
                  Admin
                </button>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mobile-label">Full Name</label>
                  <div className="relative">
                    <input className="mobile-input pl-12" defaultValue="Anouar El Ghazi" />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c1ad8c]">
                      person
                    </span>
                  </div>
                </div>
                <div>
                  <label className="mobile-label">Email Address</label>
                  <div className="relative">
                    <input className="mobile-input pl-12" defaultValue="anouar@localboost.ma" />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c1ad8c]">
                      mail
                    </span>
                  </div>
                </div>
                <div>
                  <label className="mobile-label">Password</label>
                  <div className="relative">
                    <input
                      className="mobile-input pl-12 pr-12"
                      type={showPassword ? "text" : "password"}
                      defaultValue="password123"
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c1ad8c]">
                      lock
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bba98f]"
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#8b816f]">
                <button
                  type="button"
                  onClick={() => setAcceptedTerms((current) => !current)}
                  className={`mt-1 h-5 w-5 rounded-full border transition ${
                    acceptedTerms
                      ? "border-[#b27a00] bg-[#b27a00]"
                      : "border-[#dfd4c4] bg-white"
                  }`}
                />
                <span>
                  I agree to the <span className="font-extrabold text-[#b27a00]">Terms &amp; Conditions</span> and
                  <span className="font-extrabold text-[#b27a00]"> Privacy Policy</span> of LocalBoost.
                </span>
              </label>

              <Link
                href={createAccountHref}
                onClick={() => setTermsWarning(!acceptedTerms)}
                className="mobile-pill mobile-button-gold mt-7 flex h-14 w-full items-center justify-center gap-2 text-base font-extrabold"
              >
                Create Account
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
              {termsWarning && !acceptedTerms ? (
                <p className="mt-3 text-center text-[12px] font-semibold text-[#b15f36]">
                  Accept the terms to continue.
                </p>
              ) : null}

              <div className="mobile-divider mt-7">OR</div>

              <Link
                href={googleSignupHref}
                className="mobile-pill mobile-button-secondary mt-6 flex h-14 w-full items-center justify-center gap-3 text-[15px] font-bold"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-sm shadow-sm">G</span>
                Continue with Google
              </Link>
            </div>

            <Link href={`/${params.locale}`} className="mt-6 text-sm font-bold text-[#8b816f]">
              Already have an account? <span className="text-[#b27a00]">Sign in</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
