// Adobe PDF Embed API Types
export interface AdobeDCViewConfig {
  clientId: string;
  divId: string;
}

export interface PDFPreviewConfig {
  embedMode: 'FULL_WINDOW' | 'SIZED_CONTAINER' | 'IN_LINE' | 'LIGHT_BOX';
  showAnnotationTools?: boolean;
  showDownloadPDF?: boolean;
  showPrintPDF?: boolean;
  showZoomControl?: boolean;
  showThumbnails?: boolean;
  showBookmarks?: boolean;
  enableAnnotationAPIs?: boolean;
  includePDFAnnotations?: boolean;
  enableFormFilling?: boolean;
  defaultViewMode?: 'FIT_WIDTH' | 'FIT_PAGE' | 'TWO_COLUMN' | 'TWO_COLUMN_FIT_PAGE';
  focusOnRendering?: boolean;
  showFullScreenViewButton?: boolean;
}

export interface PDFFileContent {
  content: {
    location?: {
      url: string;
    };
    promise?: Promise<ArrayBuffer>;
  };
  metaData: {
    fileName: string;
    id?: string;
  };
}

export interface AnnotationTarget {
  source: {
    node: {
      index: number; // Page number (0-indexed)
    };
  };
  selector?: {
    subtype?: string;
    selectedText?: string;
    quadPoints?: number[];
  };
}

export interface Annotation {
  id: string;
  type: string;
  motivation: string;
  bodyValue?: string;
  target: AnnotationTarget;
  created: string;
  modified: string;
  creator: {
    name: string;
    type: string;
  };
}

export interface RedlineItem {
  id: string;
  pageNumber: number;
  text: string;
  type: string;
  annotation: Annotation;
  isActive: boolean;
}

export interface AdobeViewer {
  getAnnotationManager: () => Promise<AnnotationManager>;
  getAPIs: () => Promise<ViewerAPIs>;
}

export interface AnnotationManager {
  getAnnotations: (options?: {
    pageRange?: { startPage: number; endPage: number };
    annotationIds?: string[];
  }) => Promise<Annotation[]>;
  addAnnotations: (annotations: Annotation[]) => Promise<void>;
  updateAnnotation: (annotation: Annotation) => Promise<void>;
  deleteAnnotations: (annotationIds: string[]) => Promise<void>;
  registerEventListener: (
    callback: (event: AnnotationEvent) => void,
    options: { listenOn: string[] }
  ) => void;
}

export interface ViewerAPIs {
  gotoLocation: (page: number) => Promise<void>;
  getZoomAPIs: () => ZoomAPIs;
  getPDFMetadata: () => Promise<{ numPages: number; pdfTitle: string }>;
  search: (searchTerm: string) => Promise<SearchObject>;
  enableTextSelection: (enable: boolean) => Promise<void>;
}

export interface ZoomAPIs {
  getZoomLimits: () => Promise<{ minZoom: number; maxZoom: number }>;
  zoomIn: () => Promise<number>;
  zoomOut: () => Promise<number>;
  setZoomLevel: (level: number) => Promise<number>;
}

export interface SearchObject {
  onResultsUpdate: (callback: (results: any) => void) => Promise<boolean>;
  next: () => Promise<boolean>;
  previous: () => Promise<boolean>;
  clear: () => Promise<boolean>;
}

export interface AnnotationEvent {
  type: 'ANNOTATION_ADDED' | 'ANNOTATION_UPDATED' | 'ANNOTATION_DELETED';
  data: Annotation;
}

// User Profile
export interface UserProfile {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}
