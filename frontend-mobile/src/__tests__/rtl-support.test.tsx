import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

describe('LB-73 RTL support', () => {
  it('sets dir=rtl when locale is ar', async () => {
    vi.resetModules();
    vi.doMock('next/headers', () => ({
      headers: async () => ({
        get: (key: string) => (key === 'x-next-intl-locale' ? 'ar' : null),
      }),
    }));

    const layoutModule = await import('@/app/layout');
    const RootLayout = layoutModule.default as any;
    const element = await RootLayout({ children: React.createElement('div', null, 'ok') });

    expect(element.type).toBe('html');
    expect(element.props.lang).toBe('ar');
    expect(element.props.dir).toBe('rtl');
  });

  it('sets dir=ltr when locale is en', async () => {
    vi.resetModules();
    vi.doMock('next/headers', () => ({
      headers: async () => ({
        get: (key: string) => (key === 'x-next-intl-locale' ? 'en' : null),
      }),
    }));

    const layoutModule = await import('@/app/layout');
    const RootLayout = layoutModule.default as any;
    const element = await RootLayout({ children: React.createElement('div', null, 'ok') });

    expect(element.props.lang).toBe('en');
    expect(element.props.dir).toBe('ltr');
  });

  it('includes Noto Sans Arabic and RTL mirroring rules in globals.css', () => {
    const cssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const css = fs.readFileSync(cssPath, 'utf-8');

    expect(css).toContain('family=Noto+Sans+Arabic');
    expect(css).toMatch(/html\[dir=["']rtl["']\] body/);
    expect(css).toMatch(/html\[dir=["']rtl["']\] \.mr-2/);
    expect(css).toMatch(/html\[dir=["']rtl["']\] \.left-3/);
  });
});
