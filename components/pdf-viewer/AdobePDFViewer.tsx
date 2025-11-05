'use client';

import { useEffect } from 'react';

interface AdobePDFViewerProps {
  clientId: string;
  onSDKReady?: () => void;
}

export function AdobePDFViewer({ clientId, onSDKReady }: AdobePDFViewerProps) {
  useEffect(() => {
    console.log('[AdobePDFViewer] Component mounted, clientId:', clientId);
    
    const handleSDKReady = () => {
      console.log('[AdobePDFViewer] Adobe SDK is ready');
      if ((window as any).AdobeDC) {
        console.log('[AdobePDFViewer] AdobeDC is available');
        onSDKReady?.();
      }
    };

    // Check if already loaded (from root layout script)
    if ((window as any).AdobeDC && (window as any).AdobeDC.View) {
      console.log('[AdobePDFViewer] Adobe SDK already loaded');
      handleSDKReady();
    } else {
      console.log('[AdobePDFViewer] Waiting for adobe_dc_view_sdk.ready event');
      document.addEventListener('adobe_dc_view_sdk.ready', handleSDKReady);
    }

    return () => {
      document.removeEventListener('adobe_dc_view_sdk.ready', handleSDKReady);
    };
  }, [clientId, onSDKReady]);

  return (
    <div id="adobe-dc-view" className="w-full h-full" />
  );
}
