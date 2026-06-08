import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { metadata } from '@/app/layout';

describe('LB-73 PWA offline', () => {
  it('exposes manifest metadata', () => {
    expect(metadata.manifest).toBe('/manifest.json');
    expect((metadata as any).themeColor).toBeTruthy();
  });

  it('has a valid manifest.json in public', () => {
    const testFilePath = fileURLToPath(import.meta.url);
    const projectRoot = path.resolve(path.dirname(testFilePath), '../../');
    const manifestPath = path.join(projectRoot, 'public', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    expect(manifest.name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons[0]?.src).toBe('/icon.svg');
  });

  it('configures Serwist with runtime caching for API + pages', () => {
    const testFilePath = fileURLToPath(import.meta.url);
    const projectRoot = path.resolve(path.dirname(testFilePath), '../../');
    const configPath = path.join(projectRoot, 'next.config.mjs');
    const serviceWorkerPath = path.join(projectRoot, 'src', 'app', 'sw.ts');
    const content = fs.readFileSync(configPath, 'utf-8');
    const serviceWorker = fs.readFileSync(serviceWorkerPath, 'utf-8');

    expect(content).toContain("import withSerwistInit from '@serwist/next'");
    expect(content).toContain("swSrc: 'src/app/sw.ts'");
    expect(content).toContain("swDest: 'public/sw.js'");
    expect(serviceWorker).toContain('runtimeCaching');
    expect(serviceWorker).toContain('/api\\/v1\\/businesses');
    expect(serviceWorker).toContain('(en|fr|es|ar)\\/');
  });
});
