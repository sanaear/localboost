import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: any) => {
    const resolvedHref =
      typeof href === "string"
        ? href
        : typeof href?.pathname === "string"
          ? href.pathname
          : "";
    return React.createElement("a", { href: resolvedHref, ...props }, children);
  },
}));
