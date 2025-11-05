import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PDF Redline Viewer | Professional Document Review',
  description: 'Professional PDF redline document viewer with Adobe Embed API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://acrobatservices.adobe.com/view-sdk/viewer.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
          onLoad={() => {
            console.log('[ROOT LAYOUT] Adobe SDK script loaded successfully');
            if ((window as any).AdobeDC) {
              console.log('[ROOT LAYOUT] AdobeDC is available immediately');
              document.dispatchEvent(new Event('adobe_dc_view_sdk.ready'));
            }
          }}
          onError={() => {
            console.error('[ROOT LAYOUT] Adobe SDK script failed to load');
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
