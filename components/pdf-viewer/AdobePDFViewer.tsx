'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface AdobePDFViewerProps {
  clientId: string;
  onSDKReady?: () => void;
}

export function AdobePDFViewer({ clientId, onSDKReady }: AdobePDFViewerProps) {
  useEffect(() => {
    console.log('[AdobePDFViewer] Component mounted');
    
    const handleSDKReady = () => {
      console.log('[AdobePDFViewer] Adobe DC View SDK is ready');
      // Initialize Adobe DC View with client ID
      if (window.AdobeDC) {
        console.log('[AdobePDFViewer] AdobeDC is available');
        onSDKReady?.();
      } else {
        console.warn('[AdobePDFViewer] AdobeDC is NOT available yet');
      }
    };

    document.addEventListener('adobe_dc_view_sdk.ready', handleSDKReady);
    
    // Also check if already loaded
    setTimeout(() => {
      if (window.AdobeDC) {
        console.log('[AdobePDFViewer] Adobe already loaded, firing ready event');
        handleSDKReady();
      }
    }, 500);

    return () => {
      document.removeEventListener('adobe_dc_view_sdk.ready', handleSDKReady);
    };
  }, [onSDKReady]);

  const handleScriptLoad = () => {
    console.log('[AdobePDFViewer] Script tag onLoad fired');
    if (window.AdobeDC) {
      console.log('[AdobePDFViewer] AdobeDC available after script load');
      document.dispatchEvent(new Event('adobe_dc_view_sdk.ready'));
    } else {
      console.warn('[AdobePDFViewer] AdobeDC NOT available after script load');
    }
  };

  const handleScriptError = () => {
    console.error('[AdobePDFViewer] Script failed to load from CDN');
  };

  return (
    <>
      <Script
        src="https://acrobatservices.adobe.com/view-sdk/viewer.js"
        strategy="beforeInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        crossOrigin="anonymous"
      />
      <div id="adobe-dc-view" className="w-full h-full" />
    </>
  );
}
