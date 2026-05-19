'use client';

import { IntlProvider } from 'react-intl';

export default function ParagonIntlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  );
}
