import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'chainBench',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      url: '/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'manifest',
      url: '/site.webmanifest',
    },
    {
      rel: 'mask-icon',
      url: '/safari-pinned-tab.svg',
      color: '#000000',
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
        width: 1200,
        height: 630,
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
        width: 1200,
        height: 630,
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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
