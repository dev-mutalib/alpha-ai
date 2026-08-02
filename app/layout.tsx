import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

// Using Inter as the humanist sans for body text as per DESIGN.md
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Alpha AI',
  description: 'A modern AI chat application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'antialiased',
        inter.variable,
        'font-sans'
      )}
    >
      <body className="h-dvh w-full overflow-hidden bg-background text-foreground flex flex-col">
        {children}
      </body>
    </html>
  );
}
