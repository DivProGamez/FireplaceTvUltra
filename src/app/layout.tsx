import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { PremiumProvider } from '@/context/premium-context';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Immersive Escapes',
  description: 'Find your focus and peace with immersive soundscapes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'font-body antialiased focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
        )}
      >
        <PremiumProvider>
          {children}
          <Toaster />
        </PremiumProvider>
      </body>
    </html>
  );
}
