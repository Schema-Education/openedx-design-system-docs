import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider';
import {
  PrototypeConfigProvider,
  PrototypeDevBar,
  getGitInfo,
} from '@sdaitzman/prototype-devbar';
import '@openedx/paragon/dist/core.min.css';
import '@openedx/paragon/dist/light.min.css';
import './globals.css';
import ParagonIntlProvider from './intl-provider';
import pkg from '../package.json';
import devbarSnapshot from '../prototype-devbar.snapshot.json';

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
        <PrototypeConfigProvider
          version={pkg.version}
          owner="Schema Education"
          coverageScope="Open edX Design System documentation hub — vision, proposals, docs, and the component registry."
          fidelity="ui-mock"
          dataSource="synthetic"
        >
          <RootProvider>
            <ParagonIntlProvider>{children}</ParagonIntlProvider>
          </RootProvider>
          <PrototypeDevBar
            enabled="on"
            git={getGitInfo(devbarSnapshot)}
            appName={pkg.name}
            version={pkg.version}
          />
        </PrototypeConfigProvider>
      </body>
    </html>
  );
}
