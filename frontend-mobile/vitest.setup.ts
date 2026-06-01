import '@testing-library/jest-dom/vitest';
import React from 'react';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('next-intl', () => {
  const IntlContext = React.createContext<any>({});

  function getMessage(messages: any, path: string[]) {
    let current: any = messages;
    for (const key of path) {
      if (!current || typeof current !== 'object') return undefined;
      current = current[key];
    }
    return current;
  }

  function formatMessage(message: string, values?: Record<string, any>) {
    if (!values) return message;
    return Object.entries(values).reduce((result, [key, value]) => {
      return result.replaceAll(`{${key}}`, String(value));
    }, message);
  }

  return {
    NextIntlClientProvider: ({ messages, children }: any) =>
      React.createElement(IntlContext.Provider, { value: messages ?? {} }, children),
    useTranslations: (namespace?: string) => {
      const messages = React.useContext(IntlContext);
      return (key: string, values?: Record<string, any>) => {
        const fullPath = [...(namespace ? [namespace] : []), ...key.split('.')];
        const message = getMessage(messages, fullPath);
        if (typeof message === 'string') return formatMessage(message, values);
        return key;
      };
    },
  };
});

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => {
    const resolvedHref =
      typeof href === 'string' ? href : typeof href?.pathname === 'string' ? href.pathname : '';
    return React.createElement('a', { href: resolvedHref, ...props }, children);
  },
}));
