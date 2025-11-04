# PDF Redline Viewer - Debugging Guide

## Browser Console Debugging

When stuck at "Loading PDF Viewer...", use the browser console to diagnose:

### 1. Open Developer Tools
- **Chrome/Edge:** `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox:** `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Safari:** `Cmd+Option+I` (first enable in Preferences)

### 2. Go to Console Tab

Click the **Console** tab in Developer Tools

### 3. Check for These Messages

Look for log messages that indicate the loading status:

```javascript
// These are GOOD signs:
"Adobe SDK found!"
"Adobe DC View SDK is ready"
"Adobe viewer script loaded"
"Adobe View created"
"Loading PDF file: your-file.pdf"
"PDF loaded successfully"
"Annotation manager loaded"
"Viewer APIs loaded"

// These are BAD signs:
"Adobe SDK failed to load"
"Cannot find name 'AdobeDC'"
"Client ID not found"
"CORS error"
"Failed to initialize PDF viewer"
```

### 4. Test Adobe SDK Directly

In the console, type:
```javascript
// Check if Adobe is loaded
console.log('Adobe SDK:', window.AdobeDC ? 'LOADED' : 'NOT LOADED');

// Check Client ID in environment
console.log('App running on:', window.location.origin);
```

---

## Common Console Errors & Fixes

### Error: "Cannot find module '@/types'"

**Cause:** Import path issue

**Fix:**
- Restart dev server: `npm run dev`
- Clear cache: `rm -rf .next && npm run dev`

### Error: "AdobeDC is not defined"

**Cause:** Adobe SDK script didn't load

**Fix:**
```javascript
// In console, check if script loaded:
fetch('https://acrobatservices.adobe.com/view-sdk/viewer.js')
  .then(r => r.ok ? 'Script accessible' : 'Script blocked')
  .then(console.log)
  .catch(err => console.error('Network error:', err));
```

### Error: "CORS policy blocked"

**Cause:** Cross-origin request blocked

**Fix:**
1. Check Adobe Client ID is correct
2. Verify redirect URI in Adobe Console includes `localhost:3000`
3. Try different browser/incognito mode

### Error: "Client ID Invalid"

**Cause:** Wrong or expired Client ID

**Fix:**
```javascript
// Check what Client ID is being used:
console.log(process.env.NEXT_PUBLIC_ADOBE_CLIENT_ID);
```

Then:
1. Go to Adobe Console
2. Regenerate Client ID
3. Update `.env.local`
4. Restart dev server

---

## Network Tab Debugging

### 1. Open Network Tab

In Developer Tools, click **Network** tab

### 2. Reload Page

Press `Ctrl+R` or `Cmd+R` to refresh

### 3. Look for These Requests

| Resource | Expected Status | Action |
|----------|-----------------|--------|
| `viewer.js` | 200 | Should load Adobe SDK |
| `page.tsx` | 200 | Your page |
| Network requests to Adobe | 200 or 304 | Should succeed |

### 4. Check Failed Requests

If any request shows **red** or error status:
- Click on it
- Go to **Response** tab
- Read the error message
- Report with full error text

---

## Performance Debugging

### Measure Load Times

In console, type:
```javascript
// Check when Adobe SDK loaded
performance.getEntriesByName('https://acrobatservices.adobe.com/view-sdk/viewer.js');

// Check overall page performance
performance.timing;

// Time since page load
console.log('Time since load:', performance.now(), 'ms');
```

### Check Memory Usage

In console (Chrome):
```javascript
// Get memory info
performance.memory;
// Output: {
//   jsHeapSizeLimit: ...,
//   totalJSHeapSize: ...,
//   usedJSHeapSize: ...
// }
```

---

## Step-by-Step Debugging Checklist

When PDF won't load, check in order:

- [ ] **Client ID Set**
  ```javascript
  process.env.NEXT_PUBLIC_ADOBE_CLIENT_ID
  // Should show your ID, not "YOUR_CLIENT_ID_HERE"
  ```

- [ ] **Adobe Script Loaded**
  ```javascript
  window.AdobeDC ? 'Loaded' : 'Not loaded'
  ```

- [ ] **SDK Ready Event Fired**
  - Check console for: "Adobe SDK ready event fired"
  - Check for: "Adobe View created"

- [ ] **PDF File Available**
  ```javascript
  // Check if file uploaded
  console.log('File URL exists:', !!window.uploadedFileUrl);
  ```

- [ ] **Viewer Initialized**
  - Check console for: "Initializing Adobe PDF viewer..."
  - Check for: "PDF loaded successfully"

- [ ] **Annotations Loaded**
  - Check console for: "Annotation manager loaded"

---

## Debug Mode

To enable more verbose logging, edit `hooks/useAdobePDF.ts` and add:

```typescript
// Around line 35, after "console.log("Checking for Adobe SDK...")"
if (process.env.NODE_ENV === 'development') {
  console.debug('[AdobePDF] Detailed debug info:', {
    attempts,
    isWindowValid: typeof window !== 'undefined',
    hasAdobeDC: !!window.AdobeDC,
    clientId: clientId?.substring(0, 5) + '...',
  });
}
```

---

## Remote Debugging (Production)

If issue only happens in production:

### 1. Check Browser Console on Live Site
- Go to production URL
- Open DevTools
- Look for same error messages
- Check Network tab

### 2. Enable Remote Debugging

For Vercel deployments:
- Go to Vercel dashboard
- View deployment logs
- Check for errors

For Docker/custom server:
- SSH into server
- Check application logs
- Look for error messages

### 3. Useful Console Commands

```javascript
// Check all loaded scripts
document.querySelectorAll('script')
  .map(s => s.src)
  .filter(s => s)
  .forEach(s => console.log(s));

// Check all console errors
// (requires setup before errors occur)
const errors = [];
window.addEventListener('error', (e) => errors.push(e));
// Then check: console.log(errors);

// Test PDF URL accessibility
fetch(YOUR_PDF_URL, { mode: 'no-cors' })
  .then(r => r.ok ? 'OK' : 'Failed')
  .then(console.log);
```

---

## Reporting Issues

When reporting a bug, include:

1. **Screenshot of Console Errors**
   - Capture full error message
   - Include stack trace if available

2. **Network Tab Data**
   - Failed requests
   - Timing information
   - Response headers

3. **Environment Info**
   - Browser and version
   - Operating system
   - Node.js version (if running locally)
   - npm version

4. **Steps to Reproduce**
   - Exact actions to trigger bug
   - PDF file used (if possible to share)
   - Client ID settings (sanitized)

5. **Console Output**
   ```bash
   # Save console to file
   # Copy all console messages including timestamps
   ```

---

## Useful Links

- [Adobe PDF Embed API Docs](https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/)
- [MDN - Using Browser DevTools](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools)
- [Chrome DevTools Guide](https://developer.chrome.com/docs/devtools/)
- [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools)

---

## Still Stuck?

Try these final steps:

1. **Completely Clear Cache:**
   ```bash
   # Stop dev server
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

2. **Test in Incognito/Private Mode:**
   - Opens fresh with no cache
   - No browser extensions

3. **Try Different Network:**
   - Mobile hotspot
   - Different WiFi
   - Different ISP

4. **Check Adobe Status:**
   - Go to [adobe.com](https://status.adobe.com) status page
   - Check if services are operational

5. **Contact Support:**
   - Gather all debug info from above
   - Include Console screenshots
   - Include Network tab export

---

**Remember:** The Console Tab is your best friend! 🔍
