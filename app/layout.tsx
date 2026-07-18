import type { Metadata } from 'next'
import { Geist, Geist_Mono, Outfit, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-heading',
  weight: ['700', '800']
});
const syne = Syne({
  subsets: ["latin"],
  variable: '--font-display',
  weight: '700'
});
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Mentor Connect',
  description: 'Connect with mentors to elevate your career and skills.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${outfit.variable} ${syne.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased relative overflow-x-hidden">
        <div className="gradient-grid" />
        <div className="relative z-10">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
