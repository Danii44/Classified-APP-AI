'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect, useState } from 'react'
import { useBrandingStore } from '@/lib/stores'
import { ThemeProvider } from '@/components/theme-provider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
    },
  },
})

function BrandingProvider({ children }: { children: ReactNode }) {
  const { primaryColor, secondaryColor, accentColor } = useBrandingStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const root = document.documentElement
    if (primaryColor) root.style.setProperty('--brand-primary', primaryColor)
    if (secondaryColor) root.style.setProperty('--brand-secondary', secondaryColor)
    if (accentColor) root.style.setProperty('--brand-accent', accentColor)
  }, [primaryColor, secondaryColor, accentColor])

  if (!mounted) return children
  return children
}

export default function RootLayoutClient({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <BrandingProvider>
          {children}
        </BrandingProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
