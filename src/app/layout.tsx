import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { RootProvider } from '@/infrastructure/providers/root-provider';

import './globals.css';

import 'katex/dist/katex.min.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gravo IA Frontend',
  description: 'Aplicación frontend con Clean Architecture',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="es">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <RootProvider>
        {children}
      </RootProvider>
    </body>
  </html>
);

export default RootLayout;
