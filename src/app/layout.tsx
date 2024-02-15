import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { Providers } from './Providers'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const metadata: Metadata = {
  title: 'brainBench',
  metadataBase: new URL(BASE_URL),
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      url: '/favicon-180-precomposed.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      url: '/favicon-32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/favicon-192.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      url: '/favicon-512.png',
    },
  ],
  description: 'Your benchmark for on-chain inference',
  applicationName: 'brainBench',
  keywords: 'brainBench, zkml, zkmlBench, zkmlBenchmarks',
  authors: [{ name: 'Inference Labs Inc.', url: 'https://inferencelabs.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'brainBench',
    images: [
      {
        url: `${BASE_URL}/OG.png`,
        width: 1200,
        height: 630,
        alt: 'brainBench',
      },
    ],
  },
  twitter: {
    creator: '@inference_labs',
    site: '@inferencelabs',
    card: 'summary_large_image',
    images: [
      {
        url: `${BASE_URL}/OG.png`,
        width: 1200,
        height: 630,
        alt: 'brainBench',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
