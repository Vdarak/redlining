'use client';

import { useEffect, useState } from 'react';

export function AdobeDebugger() {
  const [status, setStatus] = useState<string[]>([]);

  useEffect(() => {
    const logs: string[] = [];

    const addLog = (msg: string) => {
      console.log(msg);
      logs.push(msg);
      setStatus([...logs]);
    };

    addLog('[DEBUG] Starting Adobe SDK check...');
    addLog(`[DEBUG] Time: ${new Date().toISOString()}`);
    addLog(`[DEBUG] URL: ${typeof window !== 'undefined' ? window.location.href : 'N/A'}`);
    addLog(`[DEBUG] Client ID: ${process.env.NEXT_PUBLIC_ADOBE_CLIENT_ID ? 'SET' : 'NOT SET'}`);

    // Check 1: Is Adobe CDN accessible?
    fetch('https://acrobatservices.adobe.com/view-sdk/viewer.js', {
      method: 'HEAD',
    })
      .then(r => {
        addLog(`[CDN CHECK] Status: ${r.status} ${r.ok ? '✓' : '✗'}`);
        if (r.ok) {
          addLog(`[CDN CHECK] Adobe CDN is accessible ✓`);
        } else {
          addLog(`[CDN CHECK] Adobe CDN returned error status`);
        }
      })
      .catch(err => {
        addLog(`[CDN CHECK] FAILED: ${err.message}`);
      });

    // Check 2: Monitor Adobe SDK loading
    const checkAdobeInterval = setInterval(() => {
      if (window.AdobeDC) {
        addLog(`[MONITOR] AdobeDC found! ✓`);
        clearInterval(checkAdobeInterval);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkAdobeInterval);
      if (!window.AdobeDC) {
        addLog(`[MONITOR] AdobeDC NOT loaded after 5 seconds ✗`);
      }
    }, 5000);

    // Check 3: Listen for ready event
    const handleReady = () => {
      addLog(`[EVENT] adobe_dc_view_sdk.ready fired ✓`);
    };

    document.addEventListener('adobe_dc_view_sdk.ready', handleReady);

    return () => {
      document.removeEventListener('adobe_dc_view_sdk.ready', handleReady);
      clearInterval(checkAdobeInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-green-400 text-xs p-2 max-h-32 overflow-y-auto font-mono">
      {status.map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  );
}
