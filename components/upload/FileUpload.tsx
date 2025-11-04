'use client';

import { useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  isLoading?: boolean;
}

export function FileUpload({ onFileSelect, selectedFile, onClear, isLoading }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  if (selectedFile) {
    return (
      <Card className="p-6 bg-primary-50 border-primary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <FileText className="w-6 h-6 text-primary-700" />
            </div>
            <div>
              <p className="font-semibold text-primary-900">{selectedFile.name}</p>
              <p className="text-sm text-primary-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={isLoading}
            className="text-primary-700 hover:text-primary-900 hover:bg-primary-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-primary-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors bg-primary-50/50"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-primary-100 rounded-full">
          <Upload className="w-8 h-8 text-primary-700" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            Upload PDF Document
          </h3>
          <p className="text-sm text-primary-600 mb-4">
            Drag and drop your PDF file here, or click to browse
          </p>
        </div>
        <label htmlFor="file-upload">
          <Button asChild className="cursor-pointer">
            <span>
              Choose File
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </span>
          </Button>
        </label>
        <p className="text-xs text-primary-500 mt-2">
          Maximum file size: 50MB
        </p>
      </div>
    </div>
  );
}
