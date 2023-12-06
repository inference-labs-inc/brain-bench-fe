'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { theme } from './theme'

const {
  NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST,
} = process?.env ?? {}

export function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CacheProvider>
      <PostHogProvider client={posthog}>
        <ColorModeScript initialColorMode='system' />
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </PostHogProvider>
    </CacheProvider>
  )
}
