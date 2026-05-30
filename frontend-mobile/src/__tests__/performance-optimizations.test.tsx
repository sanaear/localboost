import React from "react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import OptimizedImage from "@/components/OptimizedImage";

describe("LB-73 performance optimizations", () => {
  it("renders optimized Cloudinary src/srcset with lazy loading", () => {
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = "demo";

    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Example"
        width={200}
        height={150}
        sizes="200px"
        widths={[200, 400]}
      />,
    );

    const img = screen.getByAltText("Example") as HTMLImageElement;
    expect(img.getAttribute("loading")).toBe("lazy");
    expect(img.getAttribute("decoding")).toBe("async");
    expect(img.getAttribute("src")).toContain("res.cloudinary.com/demo/image/fetch/");
    expect(img.getAttribute("src")).toContain("f_auto,q_auto,w_200");
    expect(img.getAttribute("srcset")).toContain("w_200");
    expect(img.getAttribute("srcset")).toContain("w_400");
  });

  it("falls back to original src when Cloudinary is not configured", () => {
    delete process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    render(
      <OptimizedImage
        src="https://example.com/plain.jpg"
        alt="Plain"
        width={200}
        height={150}
      />,
    );

    const img = screen.getByAltText("Plain") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("https://example.com/plain.jpg");
    expect(img.getAttribute("srcset")).toBeNull();
  });

  it("exposes Cache-Control headers configuration", async () => {
    const testFilePath = fileURLToPath(import.meta.url);
    const projectRoot = path.resolve(path.dirname(testFilePath), "../../");
    const configPath = path.join(projectRoot, "next.config.mjs");
    const content = fs.readFileSync(configPath, "utf-8");
    expect(content).toContain('source: "/_next/static/:path*"');
    expect(content).toContain('key: "Cache-Control"');
    expect(content).toContain("immutable");
  });

  it("lazy-loads the Leaflet map component via next/dynamic", async () => {
    const dynamicMock = vi.fn((_importer: any, options: any) => {
      (dynamicMock as any).options = options;
      return () => null;
    });

    vi.resetModules();
    vi.doMock("next/dynamic", () => ({ default: dynamicMock }));

    await import("@/app/[locale]/map/page");

    expect(dynamicMock).toHaveBeenCalled();
    expect((dynamicMock as any).options?.ssr).toBe(false);
  });
});
