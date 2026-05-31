import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { metadata, viewport } from "@/app/layout";

describe("LB-73 PWA offline", () => {
  it("exposes manifest metadata", () => {
    expect(metadata.manifest).toBe("/manifest.json");
    expect((viewport as any).themeColor).toBeTruthy();
  });

  it("has a valid manifest.json in public", () => {
    const testFilePath = fileURLToPath(import.meta.url);
    const projectRoot = path.resolve(path.dirname(testFilePath), "../../");
    const manifestPath = path.join(projectRoot, "public", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    expect(manifest.name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons[0]?.src).toBe("/icon.svg");
  });

  it("configures next-pwa with runtime caching for API + pages", () => {
    const testFilePath = fileURLToPath(import.meta.url);
    const projectRoot = path.resolve(path.dirname(testFilePath), "../../");
    const configPath = path.join(projectRoot, "next.config.mjs");
    const content = fs.readFileSync(configPath, "utf-8");

    expect(content).toContain('import nextPWA from "next-pwa"');
    expect(content).toContain("runtimeCaching");
    expect(content).toContain("/api\\/v1\\/businesses");
    expect(content).toContain("(en|fr|es|ar)\\/");
    expect(content).toContain('dest: "public"');
  });
});
