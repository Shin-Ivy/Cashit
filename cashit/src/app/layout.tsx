import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CashIt — Your Money, In Focus',
  description:
    'CashIt is a personal expense tracker that helps students and freelancers manage multiple wallets, track spending, and understand their financial habits in real time.',
  keywords: ['expense tracker', 'personal finance', 'wallet', 'budget', 'cashit'],
  authors: [{ name: 'CashIt Team' }],
  openGraph: {
    title: 'CashIt — Your Money, In Focus',
    description: 'Track your wallets and spending in real time.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-base text-on-base antialiased">
        {children}
      </body>
    </html>
  );
}
