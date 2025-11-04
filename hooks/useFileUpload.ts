'use client';

import { useState, useCallback } from 'react';

export interface UploadedFile {
  file: File;
  url: string;
  arrayBuffer: ArrayBuffer;
}

export function useFileUpload() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('Please upload a PDF file');
      }

      // Validate file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 50MB');
      }

      // Create URL for the file
      const url = URL.createObjectURL(file);

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      setUploadedFile({
        file,
        url,
        arrayBuffer,
      });

      return { file, url, arrayBuffer };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearFile = useCallback(() => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
    setError(null);
  }, [uploadedFile]);

  return {
    uploadedFile,
    isLoading,
    error,
    handleFileUpload,
    clearFile,
  };
}
