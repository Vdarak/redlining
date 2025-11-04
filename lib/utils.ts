import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Annotation, RedlineItem } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractPageNumber(annotation: Annotation): number {
  if (annotation.target?.source?.node?.index !== undefined) {
    return annotation.target.source.node.index + 1; // Convert 0-indexed to 1-indexed
  }
  return 0;
}

export function extractAnnotationText(annotation: Annotation): string {
  if (annotation.bodyValue) {
    return annotation.bodyValue;
  }
  if (annotation.target?.selector?.selectedText) {
    return annotation.target.selector.selectedText;
  }
  return `${annotation.type} annotation`;
}

export function getAnnotationType(annotation: Annotation): string {
  const subtype = annotation.target?.selector?.subtype;
  if (subtype) return subtype;
  return annotation.type || 'Unknown';
}

export function isRedlineAnnotation(annotation: Annotation): boolean {
  const redlineTypes = ['Highlight', 'StrikeOut', 'Underline', 'FreeText', 'Note'];
  const type = getAnnotationType(annotation);
  return redlineTypes.includes(type) || !!annotation.bodyValue;
}

export function convertAnnotationToRedlineItem(
  annotation: Annotation,
  isActive: boolean = false
): RedlineItem {
  return {
    id: annotation.id,
    pageNumber: extractPageNumber(annotation),
    text: extractAnnotationText(annotation),
    type: getAnnotationType(annotation),
    annotation,
    isActive,
  };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
