import type { Metadata } from 'next'
import Head from 'next/head'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'chainBench',
  metadataBase: new URL('https://chainbench.dev'),
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
  applicationName: 'chainBench',
  keywords: 'chainBench, zkml, zkmlBench, zkmlBenchmarks',
  authors: [{ name: 'Inference Labs Inc.', url: 'https://inferencelabs.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chainbench.dev',
    siteName: 'chainBench',
    images: [
      {
        url: 'https://chainbench.dev/og.png',
        width: 512,
        height: 512,
        alt: 'chainBench',
      },
    ],
  },
  twitter: {
    creator: '@inference_labs',
    site: '@inferencelabs',
    card: 'summary_large_image',
    images: [
      {
        url: 'https://chainbench.dev/og.png',
        width: 512,
        height: 512,
        alt: 'chainBench',
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
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
