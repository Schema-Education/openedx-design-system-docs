import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider';
import '@openedx/paragon/dist/core.min.css';
import '@openedx/paragon/dist/light.min.css';
import './globals.css';
import ParagonIntlProvider from './intl-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Open edX Design System',
    template: '%s | Open edX Design System',
  },
  description:
    'Atoms through pages across every Open edX MFE — a unified design system registry and documentation hub.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased text-gray-600 bg-white">
        <RootProvider>
            <ParagonIntlProvider>{children}</ParagonIntlProvider>
          </RootProvider>
      </body>
    </html>
  );
}
