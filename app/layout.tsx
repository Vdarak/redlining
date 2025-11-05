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
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.AdobeDC) {
                console.log('[ROOT LAYOUT] Adobe SDK already available');
                document.dispatchEvent(new Event('adobe_dc_view_sdk.ready'));
              }
              window.addEventListener('load', function() {
                if (window.AdobeDC) {
                  console.log('[ROOT LAYOUT] Adobe SDK loaded after page load');
                  document.dispatchEvent(new Event('adobe_dc_view_sdk.ready'));
                }
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
