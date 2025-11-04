# PDF Redline Viewer - Deployment & Troubleshooting Guide

## Quick Start

### 1. Get Your Adobe Client ID

1. Visit [Adobe Developer Console](https://developer.adobe.com/console)
2. Sign in with your Adobe account (create one if needed)
3. Click **Create new project**
4. Add the **PDF Embed API**
5. Generate credentials (select "Server" or "Web")
6. Copy your **Client ID**

### 2. Configure Your Application

```bash
cd pdf-redline-viewer
```

Edit `.env.local`:
```env
NEXT_PUBLIC_ADOBE_CLIENT_ID=your_client_id_here
```

Replace `your_client_id_here` with your actual Client ID from step 1.

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Test the Application

1. Upload a PDF file (recommended: use a PDF with existing annotations)
2. Click "View PDF Document"
3. Wait for the PDF viewer to load (may take 5-10 seconds on first load)
4. Use the Adobe tools to add annotations
5. Click items in the left sidebar to navigate

---

## Troubleshooting

### Issue: "Loading PDF Viewer..." stuck indefinitely

**Cause:** Adobe SDK not loading or Client ID not valid

**Solutions:**
1. **Check Client ID:**
   - Verify your `.env.local` has `NEXT_PUBLIC_ADOBE_CLIENT_ID` set correctly
   - Restart the dev server after updating `.env.local`
   
2. **Check Browser Console:**
   - Open DevTools (F12 or Cmd+Option+I)
   - Go to Console tab
   - Look for error messages like "Adobe SDK not found"
   - If you see CORS errors, your Client ID might be invalid

3. **Clear Browser Cache:**
   ```bash
   # Stop the dev server
   # Delete .next folder
   rm -rf .next
   # Restart dev server
   npm run dev
   ```

4. **Verify Adobe Client ID:**
   - Go back to [Adobe Developer Console](https://developer.adobe.com/console)
   - Check that your project has PDF Embed API enabled
   - Verify the Client ID hasn't been revoked

### Issue: PDF loads but shows blank/gray screen

**Cause:** File upload issue or Adobe API configuration

**Solutions:**
1. **Try a different PDF:**
   - Use a standard PDF file
   - Avoid encrypted or protected PDFs
   - File size should be < 50MB

2. **Check Network Tab:**
   - Open DevTools → Network tab
   - Reload page
   - Look for failed requests to `acrobatservices.adobe.com`
   - If blocked, check CORS settings in Adobe Console

3. **Verify File Upload:**
   - Ensure PDF successfully uploaded
   - File size is under 50MB
   - PDF is not corrupted

### Issue: Annotations not appearing in sidebar

**Cause:** Adobe annotation APIs not enabled or PDF has no annotations

**Solutions:**
1. **Enable Annotations:**
   - Annotations are loaded automatically if they exist in the PDF
   - Try adding a new annotation using the toolbar
   - Wait a moment for sidebar to update

2. **Use Adobe Tools:**
   - Click the comment icon in the toolbar
   - Add a note/comment
   - The sidebar should update in real-time

3. **Check Console for Errors:**
   - Look for JavaScript errors in DevTools Console
   - Report any errors with full error message

### Issue: "Error: Adobe SDK failed to load"

**Cause:** Internet connectivity or CDN issues

**Solutions:**
1. **Check Internet Connection:**
   - Ensure you have stable internet
   - Try on a different network

2. **Try Incognito Mode:**
   ```
   - Open incognito/private window
   - Go to http://localhost:3000
   - Test again
   ```

3. **Check CDN Status:**
   - Visit https://acrobatservices.adobe.com/view-sdk/viewer.js
   - Should load successfully
   - If error page, Adobe CDN might be down

4. **Update Dependencies:**
   ```bash
   npm update
   npm run dev
   ```

### Issue: "Client ID invalid" or "Unauthorized" errors

**Cause:** Client ID not valid for this usage

**Solutions:**
1. **Regenerate Client ID:**
   - Go to Adobe Console
   - Delete old credentials
   - Create new ones
   - Copy new Client ID
   - Update `.env.local`

2. **Check API Enabled:**
   - In Adobe Console, go to your project
   - Verify **PDF Embed API** is listed
   - If missing, add it from the API list

3. **Verify Project Settings:**
   - OAuth2 Client ID should show your Client ID
   - Redirect URIs should include `http://localhost:3000` for development

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/pdf-redline-viewer.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable: `NEXT_PUBLIC_ADOBE_CLIENT_ID`
   - Click Deploy

3. **Update Adobe Console:**
   - Go to Adobe Console
   - Update **Redirect URIs** to include your Vercel domain
   - Example: `https://your-app.vercel.app`

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t pdf-redline-viewer .
docker run -p 3000:3000 -e NEXT_PUBLIC_ADOBE_CLIENT_ID=your_id pdf-redline-viewer
```

### Traditional Server (Ubuntu/Debian)

1. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Setup:**
   ```bash
   git clone <your-repo> pdf-redline-viewer
   cd pdf-redline-viewer
   npm install
   npm run build
   ```

3. **Create .env file:**
   ```bash
   echo "NEXT_PUBLIC_ADOBE_CLIENT_ID=your_id" > .env.local
   ```

4. **Run with PM2 (process manager):**
   ```bash
   npm install -g pm2
   pm2 start npm --name "pdf-viewer" -- start
   pm2 save
   ```

5. **Setup Nginx Reverse Proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Performance Optimization

### Reduce Loading Time

1. **Enable Compression:**
   - Nginx/Apache should automatically compress responses
   - Check with: `curl -H "Accept-Encoding: gzip" -v http://localhost:3000`

2. **Use CDN:**
   - Cloudflare, Akamai, or other CDN
   - Cache static assets

3. **Optimize PDF Files:**
   - Reduce PDF file size
   - Compress images in PDFs
   - Use online tools like Ghostscript

### Monitor Performance

Check DevTools Network tab for:
- Adobe SDK load time (should be < 2s)
- PDF load time (depends on file size)
- Annotation loading (should be < 1s)

---

## Security Notes

### Production Checklist

- [ ] Use HTTPS only (required by Adobe API)
- [ ] Don't commit `.env.local` with real credentials
- [ ] Add environment variables in hosting platform
- [ ] Enable CORS properly in Adobe Console
- [ ] Update redirect URIs for production domain
- [ ] Monitor Adobe API quota usage
- [ ] Implement user authentication if needed
- [ ] Add request rate limiting
- [ ] Keep dependencies updated

### Environment Variables

Never hardcode credentials. Always use `.env.local` for development:

```env
# .env.local (Development - NEVER commit this)
NEXT_PUBLIC_ADOBE_CLIENT_ID=8b41a9066c564a0ca11399e0216a1478
```

For production, set via hosting platform:
- Vercel: Project Settings → Environment Variables
- Heroku: Config Vars
- AWS: Environment Variables
- Docker: `docker run -e NEXT_PUBLIC_ADOBE_CLIENT_ID=...`

---

## Testing Checklist

### Feature Testing

- [ ] PDF upload works
- [ ] PDF viewer loads
- [ ] Can add annotations
- [ ] Sidebar updates with annotations
- [ ] Can click annotation to navigate
- [ ] Zoom controls work
- [ ] Print function works
- [ ] Download function works
- [ ] Dark mode works (if enabled)

### Browser Compatibility

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Edge Cases

- [ ] Large PDF files (40+ MB)
- [ ] PDFs with many annotations (100+)
- [ ] PDFs with images
- [ ] Encrypted PDFs (should fail gracefully)
- [ ] Very slow internet connection
- [ ] Offline then reconnect

---

## Support Resources

- [Adobe PDF Embed API Docs](https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/)
- [Adobe API Console](https://developer.adobe.com/console)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## FAQ

**Q: Can I use this without an Adobe account?**  
A: No, you need an Adobe Developer account to get the Client ID. It's free to create one.

**Q: Is there a limit on PDF file size?**  
A: Files up to 50MB are supported. Larger files may fail or timeout.

**Q: Can I add annotations programmatically?**  
A: Yes, through the Adobe API. See `useAnnotations.ts` hook for examples.

**Q: How do I export annotations?**  
A: Use the "Download" button in the PDF viewer, or implement custom export logic.

**Q: Can I customize the appearance?**  
A: Yes! Edit `tailwind.config.ts` for colors and typography. See the config file for the design system.

**Q: Is this production-ready?**  
A: Yes, but test thoroughly before deploying. Follow the security checklist above.

---

## Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `CLIENT_ID_NOT_FOUND` | Client ID not set | Add to `.env.local` |
| `INVALID_CLIENT_ID` | Client ID is wrong | Verify in Adobe Console |
| `CORS_ERROR` | Cross-origin blocked | Update Adobe Console settings |
| `PDF_LOAD_FAILED` | Can't download PDF | Check file URL is accessible |
| `SDK_FAILED_TO_LOAD` | Adobe script error | Check internet, refresh page |
| `ANNOTATION_API_ERROR` | Can't access annotations | Check Adobe API enabled |

---

**Last Updated:** November 4, 2025  
**Version:** 1.0.0
