'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/upload/FileUpload';
import { PDFViewerContainer } from '@/components/pdf-viewer/PDFViewerContainer';
import { useFileUpload } from '@/hooks/useFileUpload';
import { AdobeDebugger } from '@/components/AdobeDebugger';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// IMPORTANT: Replace with your actual Adobe Client ID
const ADOBE_CLIENT_ID = process.env.NEXT_PUBLIC_ADOBE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';

export default function Home() {
  const { uploadedFile, isLoading, error, handleFileUpload, clearFile } = useFileUpload();
  const [showViewer, setShowViewer] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      await handleFileUpload(file);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const handleViewPDF = () => {
    if (uploadedFile) {
      setShowViewer(true);
    }
  };

  const handleBack = () => {
    setShowViewer(false);
    clearFile();
  };

  if (showViewer && uploadedFile) {
    return (
      <>
        <AdobeDebugger />
        <Button
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 bg-primary-800 hover:bg-primary-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>
        <PDFViewerContainer
          clientId={ADOBE_CLIENT_ID}
          fileName={uploadedFile.file.name}
          fileUrl={uploadedFile.url}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-primary-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary-900 mb-4 tracking-tight">
            PDF Redline Document Viewer
          </h1>
          <p className="text-base text-primary-700 leading-relaxed max-w-2xl mx-auto">
            Upload your annotated PDF document to view and navigate through redlined items. 
            Professional document review made simple.
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-3xl mx-auto">
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={uploadedFile?.file || null}
            onClear={clearFile}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-4 p-4 bg-accent-50 border border-accent-200 rounded-lg">
              <p className="text-sm text-accent-800">{error}</p>
            </div>
          )}

          {uploadedFile && !showViewer && (
            <div className="mt-8 text-center">
              <Button
                onClick={handleViewPDF}
                size="lg"
                className="bg-primary-700 hover:bg-primary-800 text-white px-8 py-6 text-base"
              >
                View PDF Document
              </Button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-primary-900 mb-6 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Full Annotation Support',
                description: 'View, add, and edit highlights, comments, and markup',
              },
              {
                title: 'Smart Navigation',
                description: 'Click any redlined item to jump directly to that location',
              },
              {
                title: 'Professional Tools',
                description: 'Access print, download, search, and zoom controls',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm"
              >
                <h3 className="font-semibold text-primary-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
