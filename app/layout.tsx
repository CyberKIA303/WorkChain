import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WorkChain — Verified Work Experience',
  description: 'Blockchain-based work experience and credential verification prototype.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
