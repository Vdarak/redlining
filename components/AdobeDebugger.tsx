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

    // Check 0: Look for script tag in DOM
    setTimeout(() => {
      const scripts = document.querySelectorAll('script[src*="adobe"]');
      addLog(`[DOM CHECK] Found ${scripts.length} Adobe script tags`);
      if (scripts.length > 0) {
        scripts.forEach((script, i) => {
          addLog(`  └─ Script ${i}: src=${(script as HTMLScriptElement).src.substring(0, 50)}...`);
        });
      }
    }, 200);

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
      if ((window as any).AdobeDC) {
        addLog(`[MONITOR] window.AdobeDC found! ✓`);
        if ((window as any).AdobeDC.View) {
          addLog(`[MONITOR] window.AdobeDC.View is available ✓`);
        } else {
          addLog(`[MONITOR] window.AdobeDC exists but no .View property ✗`);
        }
        clearInterval(checkAdobeInterval);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkAdobeInterval);
      if (!(window as any).AdobeDC) {
        addLog(`[MONITOR] window.AdobeDC NOT loaded after 5 seconds ✗`);
        addLog(`[DEBUG] Checking typeof window.AdobeDC: ${typeof (window as any).AdobeDC}`);
      }
    }, 5000);

    // Check 3: Listen for ready event
    const handleReady = () => {
      addLog(`[EVENT] adobe_dc_view_sdk.ready fired ✓`);
    };

    document.addEventListener('adobe_dc_view_sdk.ready', handleReady);

    // Check 4: Inspect window object keys related to adobe
    setTimeout(() => {
      const adobeKeys = Object.keys(window).filter(k => k.toLowerCase().includes('adobe'));
      if (adobeKeys.length > 0) {
        addLog(`[WINDOW] Adobe-related keys: ${adobeKeys.join(', ')}`);
      } else {
        addLog(`[WINDOW] No Adobe-related keys found in window object`);
      }
    }, 1000);

    return () => {
      document.removeEventListener('adobe_dc_view_sdk.ready', handleReady);
      clearInterval(checkAdobeInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-green-400 text-xs p-2 max-h-32 overflow-y-auto font-mono z-50 border-t border-green-400">
      {status.map((log, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">{log}</div>
      ))}
    </div>
  );
}
