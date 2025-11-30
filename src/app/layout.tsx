import './globals.css';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  verification: {
    google: '0s706fwe8pqZQt5Ugk7vjz4hAmGWzn9tWOcIuaKMaKk',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased font-body")}>
        {children}
      </body>
    </html>
  );
}
