import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider';
import './globals.css';

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
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
