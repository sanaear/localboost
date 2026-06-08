import { ReactNode } from 'react';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params?: Promise<{ locale?: string }> | { locale?: string };
}) {
  const resolvedParams = await Promise.resolve(params ?? {});
  const locale = resolvedParams?.locale && typeof resolvedParams.locale === 'string' ? resolvedParams.locale : 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
