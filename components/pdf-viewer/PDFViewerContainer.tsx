'use client';

import { useEffect } from 'react';
import { AdobePDFViewer } from './AdobePDFViewer';
import { useAdobePDF } from '@/hooks/useAdobePDF';
import { useAnnotations } from '@/hooks/useAnnotations';
import { RedlineSidebar } from '../sidebar/RedlineSidebar';
import { RedlineItem } from '@/types';
import { Loader2 } from 'lucide-react';

interface PDFViewerContainerProps {
  clientId: string;
  fileName: string;
  fileUrl?: string;
  filePromise?: Promise<ArrayBuffer>;
}

export function PDFViewerContainer({
  clientId,
  fileName,
  fileUrl,
  filePromise,
}: PDFViewerContainerProps) {
  const {
    isSDKReady,
    annotationManager,
    viewerAPIs,
    error,
    isInitializing,
    initializeViewer,
  } = useAdobePDF({
    clientId,
    fileName,
    fileUrl,
    filePromise,
    userProfile: {
      name: 'Legal Reviewer',
      firstName: 'Legal',
      lastName: 'Reviewer',
      email: 'reviewer@lawfirm.com',
    },
  });

  const {
    redlineItems,
    activeItemId,
    isLoading: annotationsLoading,
    setActiveItem,
  } = useAnnotations(annotationManager);

  // Initialize viewer when SDK is ready
  useEffect(() => {
    if (isSDKReady && !isInitializing) {
      initializeViewer();
    }
  }, [isSDKReady, initializeViewer, isInitializing]);

  const handleItemClick = async (item: RedlineItem) => {
    setActiveItem(item.id);
    
    if (viewerAPIs) {
      try {
        await viewerAPIs.gotoLocation(item.pageNumber);
      } catch (error) {
        console.error('Error navigating to location:', error);
      }
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Error Loading PDF</h2>
          <p className="text-neutral-600 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (!isSDKReady || isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-base font-medium text-neutral-900 mb-2">
            Loading PDF Viewer...
          </p>
          <p className="text-sm text-neutral-600">
            Please wait while we initialize the document
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100">
      {/* Left Sidebar */}
      <RedlineSidebar
        redlineItems={redlineItems}
        activeItemId={activeItemId}
        onItemClick={handleItemClick}
        isLoading={annotationsLoading}
      />

      {/* Right PDF Viewer */}
      <div className="flex-1 relative">
        <AdobePDFViewer clientId={clientId} />
      </div>
    </div>
  );
}
