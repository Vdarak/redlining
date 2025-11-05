'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface AdobePDFViewerProps {
  clientId: string;
  onSDKReady?: () => void;
}

export function AdobePDFViewer({ clientId, onSDKReady }: AdobePDFViewerProps) {
  const handleScriptLoad = () => {
    console.log('[AdobePDFViewer] Script tag onLoad fired');
    // Force check multiple times since script execution timing is unpredictable
    let attempts = 0;
    const checkAdobeDC = setInterval(() => {
      attempts++;
      console.log(`[AdobePDFViewer] Checking AdobeDC availability (attempt ${attempts})`);
      
      if ((window as any).AdobeDC && (window as any).AdobeDC.View) {
        console.log('[AdobePDFViewer] ✓ AdobeDC and AdobeDC.View found!');
        clearInterval(checkAdobeDC);
        document.dispatchEvent(new Event('adobe_dc_view_sdk.ready'));
      } else if (attempts > 10) {
        clearInterval(checkAdobeDC);
        console.warn('[AdobePDFViewer] ✗ AdobeDC.View not found after 10 checks');
      }
    }, 100);
  };

  const handleScriptError = () => {
    console.error('[AdobePDFViewer] Script failed to load from CDN');
  };

  useEffect(() => {
    console.log('[AdobePDFViewer] Component mounted, clientId:', clientId);
    
    const handleSDKReady = () => {
      console.log('[AdobePDFViewer] Adobe DC View SDK is ready');
      if ((window as any).AdobeDC) {
        console.log('[AdobePDFViewer] AdobeDC is available, initializing with clientId');
        try {
          const clientConfig = {
            clientId: clientId,
          };
          (window as any).AdobeDC.View.setClientId(clientConfig);
          console.log('[AdobePDFViewer] AdobeDC setClientId called successfully');
          onSDKReady?.();
        } catch (error) {
          console.error('[AdobePDFViewer] Error setting client ID:', error);
        }
      } else {
        console.warn('[AdobePDFViewer] AdobeDC is NOT available yet');
      }
    };

    document.addEventListener('adobe_dc_view_sdk.ready', handleSDKReady);
    
    // Check if already loaded before script tag even runs
    setTimeout(() => {
      if ((window as any).AdobeDC && (window as any).AdobeDC.View) {
        console.log('[AdobePDFViewer] Adobe already loaded before script tag, firing ready event');
        handleSDKReady();
      }
    }, 100);

    return () => {
      document.removeEventListener('adobe_dc_view_sdk.ready', handleSDKReady);
    };
  }, [clientId, onSDKReady]);

  return (
    <>
      <Script
        src="https://acrobatservices.adobe.com/view-sdk/viewer.js"
        strategy="beforeInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        crossOrigin="anonymous"
        nonce="adobe-sdk"
      />
      <div id="adobe-dc-view" className="w-full h-full" />
    </>
  );
}
