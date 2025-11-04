'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import '@/lib/adobe-pdf-types';
import { AdobeViewer, AnnotationManager, ViewerAPIs, UserProfile } from '@/types';

interface UseAdobePDFOptions {
  clientId: string;
  fileName: string;
  fileUrl?: string;
  filePromise?: Promise<ArrayBuffer>;
  userProfile?: UserProfile;
}

export function useAdobePDF({
  clientId,
  fileName,
  fileUrl,
  filePromise,
  userProfile,
}: UseAdobePDFOptions) {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [viewer, setViewer] = useState<AdobeViewer | null>(null);
  const [annotationManager, setAnnotationManager] = useState<AnnotationManager | null>(null);
  const [viewerAPIs, setViewerAPIs] = useState<ViewerAPIs | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const adobeDCViewRef = useRef<any>(null);
  const sdkCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Wait for Adobe SDK to load
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 100; // 10 seconds timeout
    
    const checkSDK = () => {
      console.log('Checking for Adobe SDK...', attempts);
      
      if (window.AdobeDC) {
        console.log('Adobe SDK found!');
        setIsSDKReady(true);
        return;
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        sdkCheckTimeoutRef.current = setTimeout(checkSDK, 100);
      } else {
        console.error('Adobe SDK failed to load within timeout period');
        setError('Adobe SDK failed to load. Please refresh the page.');
      }
    };

    const handleSDKReady = () => {
      console.log('Adobe SDK ready event fired');
      setIsSDKReady(true);
      if (sdkCheckTimeoutRef.current) {
        clearTimeout(sdkCheckTimeoutRef.current);
      }
    };

    document.addEventListener('adobe_dc_view_sdk.ready', handleSDKReady);
    checkSDK();

    return () => {
      document.removeEventListener('adobe_dc_view_sdk.ready', handleSDKReady);
      if (sdkCheckTimeoutRef.current) {
        clearTimeout(sdkCheckTimeoutRef.current);
      }
    };
  }, []);

  const initializeViewer = useCallback(async () => {
    if (!isSDKReady || !window.AdobeDC || isInitializing) {
      console.log('Not ready to initialize:', { isSDKReady, hasAdobeDC: !!window.AdobeDC, isInitializing });
      return;
    }
    if (!fileUrl && !filePromise) {
      console.log('No file provided');
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      console.log('Initializing Adobe PDF viewer...');
      
      // Create Adobe DC View instance
      adobeDCViewRef.current = new window.AdobeDC.View({
        clientId,
        divId: 'adobe-dc-view',
      });

      console.log('Adobe View created');

      // Register user profile if provided
      if (userProfile) {
        adobeDCViewRef.current.registerCallback(
          window.AdobeDC!.Enum.CallbackType.GET_USER_PROFILE_API,
          () => {
            return Promise.resolve({
              code: window.AdobeDC!.Enum.ApiResponseCode.SUCCESS,
              data: { userProfile },
            });
          },
          {}
        );
      }

      // Configure preview options
      const previewConfig = {
        embedMode: 'FULL_WINDOW',
        showAnnotationTools: true,
        showDownloadPDF: true,
        showPrintPDF: true,
        showZoomControl: true,
        showThumbnails: true,
        showBookmarks: true,
        enableAnnotationAPIs: true,
        includePDFAnnotations: true,
        enableFormFilling: true,
        defaultViewMode: 'FIT_WIDTH',
        focusOnRendering: true,
        showFullScreenViewButton: true,
      };

      // Prepare file content
      const fileContent: any = {
        metaData: {
          fileName,
          id: `pdf-${Date.now()}`,
        },
      };

      if (fileUrl) {
        fileContent.content = {
          location: { url: fileUrl },
        };
      } else if (filePromise) {
        fileContent.content = {
          promise: filePromise,
        };
      }

      console.log('Loading PDF file:', fileName);

      // Load PDF
      const previewFilePromise = adobeDCViewRef.current.previewFile(
        fileContent,
        previewConfig
      );

      const adobeViewer = await previewFilePromise;
      console.log('PDF loaded successfully');
      setViewer(adobeViewer);

      // Get Annotation Manager
      const manager = await adobeViewer.getAnnotationManager();
      setAnnotationManager(manager);
      console.log('Annotation manager loaded');

      // Get Viewer APIs
      const apis = await adobeViewer.getAPIs();
      setViewerAPIs(apis);
      console.log('Viewer APIs loaded');

    } catch (err) {
      console.error('Error initializing Adobe PDF viewer:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize PDF viewer';
      setError(errorMsg);
    } finally {
      setIsInitializing(false);
    }
  }, [isSDKReady, clientId, fileName, fileUrl, filePromise, userProfile, isInitializing]);

  return {
    isSDKReady,
    viewer,
    annotationManager,
    viewerAPIs,
    error,
    isInitializing,
    initializeViewer,
  };
}
