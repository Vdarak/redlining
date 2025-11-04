# PDF Redline Document Viewer

A professional PDF redline document viewer application built with Next.js 14, React, TypeScript, Tailwind CSS, and Adobe PDF Embed API.

## Features

✨ **Full Annotation Support** - View, add, and edit highlights, comments, and markup
🧭 **Smart Navigation** - Click any redlined item to jump directly to that location
🛠️ **Professional Tools** - Access print, download, search, and zoom controls
📑 **Split-Screen Interface** - Left sidebar for annotations, right panel for PDF
🎨 **Professional Design** - Legal/lawyer-themed color scheme with golden ratio typography
⚡ **Real-Time Updates** - See annotations update in real-time as you edit

## Tech Stack

- **Framework:** Next.js 14.x (App Router)
- **Language:** TypeScript 5.x
- **UI Library:** React 18.x
- **Styling:** Tailwind CSS 3.x + shadcn/ui
- **PDF Viewer:** Adobe PDF Embed API
- **Icons:** lucide-react
- **Utilities:** clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Adobe Client ID (get one from [Adobe Developer Console](https://developer.adobe.com/console))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Adobe Client ID:**
   - Go to [Adobe Developer Console](https://developer.adobe.com/console)
   - Create a new project
   - Add Adobe PDF Embed API
   - Copy your Client ID

3. **Configure environment variables:**
   ```bash
   # Update .env.local with your Adobe Client ID
   NEXT_PUBLIC_ADOBE_CLIENT_ID=your_client_id_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - Visit `http://localhost:3000`

## Usage

1. **Upload a PDF:** Drag and drop or click to select a PDF file (max 50MB)
2. **View Document:** Click "View PDF Document" to open the viewer
3. **Annotate:** Use Adobe's annotation tools to add comments and markup
4. **Navigate:** Click any redlined item in the left sidebar to jump to that location
5. **Download/Print:** Use the tools in the PDF viewer to save or print your work

## Project Structure

```
pdf-redline-viewer/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main upload page
│   ├── globals.css                # Global styles
│   └── api/                       # API routes (future)
├── components/
│   ├── ui/                        # shadcn components
│   ├── pdf-viewer/                # PDF viewer components
│   ├── sidebar/                   # Redline sidebar components
│   └── upload/                    # File upload components
├── hooks/
│   ├── useFileUpload.ts           # File upload logic
│   ├── useAdobePDF.ts             # Adobe SDK integration
│   └── useAnnotations.ts          # Annotation management
├── lib/
│   ├── utils.ts                   # Utility functions
│   ├── adobe-pdf-types.ts         # Adobe SDK types
│   └── annotation-parser.ts       # Annotation parsing
├── types/
│   └── index.ts                   # TypeScript definitions
├── public/                        # Static assets
├── tailwind.config.ts             # Tailwind configuration
└── package.json
```

## Design System

### Typography (Golden Ratio Scale)

- **Base:** 16px (1rem)
- **Scale Factor:** 1.618 (φ - Golden Ratio)

| Size | Value | Description |
|------|-------|-------------|
| xs | 0.618rem | 9.888px |
| sm | 0.764rem | 12.224px |
| base | 1rem | 16px |
| lg | 1.618rem | 25.888px |
| xl | 2.618rem | 41.888px |
| 2xl | 4.236rem | 67.776px |
| 3xl | 6.854rem | 109.664px |

### Color Palette

**Primary (Deep Navy Blue)** - Professional, authoritative base
- primary-900: #102a43
- primary-700: #334e68
- primary-500: #627d98
- primary-300: #9fb3c8
- primary-100: #d9e2ec

**Accent (Burgundy Red)** - Highlighting redlined content
- accent-900: #7f1d1d
- accent-700: #b91c1c
- accent-500: #ef4444
- accent-300: #fca5a5
- accent-100: #fee2e2

**Gold/Bronze** - Professional highlights
- gold-700: #a16207
- gold-500: #eab308
- gold-300: #fde047
- gold-100: #fef9c3

## API Reference

### Hooks

#### `useFileUpload()`
Handles PDF file uploads and validation.

```typescript
const { uploadedFile, isLoading, error, handleFileUpload, clearFile } = useFileUpload();
```

#### `useAdobePDF(options)`
Initializes Adobe PDF viewer and manages SDK lifecycle.

```typescript
const { isSDKReady, viewer, annotationManager, viewerAPIs, error, initializeViewer } = 
  useAdobePDF({ clientId, fileName, fileUrl });
```

#### `useAnnotations(annotationManager)`
Manages annotation state and real-time updates.

```typescript
const { redlineItems, activeItemId, setActiveItem, stats } = useAnnotations(annotationManager);
```

## Customization

### Change Color Scheme

Edit `tailwind.config.ts` to modify colors:

```typescript
primary: {
  900: '#custom-color',
  700: '#another-color',
  // ... etc
}
```

### Adjust Typography Scale

Modify the `fontSize` extension in `tailwind.config.ts`:

```typescript
fontSize: {
  'xl': 'custom-size', // Override default
}
```

## Troubleshooting

### Adobe SDK Not Loading
- Check your Client ID is correct in `.env.local`
- Verify the Adobe PDF Embed API is enabled in your console project
- Check browser console for CORS errors

### Annotations Not Appearing
- Ensure the PDF has existing annotations
- Try adding a new annotation using the toolbar
- Check that `enableAnnotationAPIs` is set to `true`

### Performance Issues
- Reduce PDF file size (limit 50MB)
- Ensure browser has adequate memory
- Try disabling thumbnails and bookmarks if needed

## Future Enhancements

- [ ] Keyboard navigation (arrow keys to navigate items)
- [ ] Search/filter annotations
- [ ] Export annotations as JSON/CSV
- [ ] Batch upload multiple PDFs
- [ ] Annotation statistics dashboard
- [ ] Dark mode support
- [ ] Accessibility improvements
- [ ] Backend storage for annotations

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues with:
- **PDF Viewer:** [Adobe Support](https://developer.adobe.com/support)
- **Next.js:** [Next.js Docs](https://nextjs.org/docs)
- **Tailwind CSS:** [Tailwind Docs](https://tailwindcss.com/docs)

## Contributing

Feel free to submit issues and enhancement requests!

---

**Made with ❤️ for legal professionals**
