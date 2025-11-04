'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface AdobePDFViewerProps {
  clientId: string;
  onSDKReady?: () => void;
}

export function AdobePDFViewer({ clientId, onSDKReady }: AdobePDFViewerProps) {
  useEffect(() => {
    const handleSDKReady = () => {
      console.log('Adobe DC View SDK is ready');
      // Initialize Adobe DC View with client ID
      if (window.AdobeDC) {
        console.log('AdobeDC is available');
        onSDKReady?.();
      }
    };

    document.addEventListener('adobe_dc_view_sdk.ready', handleSDKReady);

    return () => {
      document.removeEventListener('adobe_dc_view_sdk.ready', handleSDKReady);
    };
  }, [onSDKReady]);

  return (
    <>
      <Script
        src="https://acrobatservices.adobe.com/view-sdk/viewer.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Adobe viewer script loaded');
          // Manually trigger ready event if not already triggered
          setTimeout(() => {
            if (window.AdobeDC) {
              document.dispatchEvent(new Event('adobe_dc_view_sdk.ready'));
            }
          }, 100);
        }}
      />
      <div id="adobe-dc-view" className="w-full h-full" />
    </>
  );
}
