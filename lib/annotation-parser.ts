import { Annotation, RedlineItem } from "@/types";
import { isRedlineAnnotation, convertAnnotationToRedlineItem } from "./utils";

export class AnnotationParser {
  static parseAnnotations(annotations: Annotation[]): RedlineItem[] {
    return annotations
      .filter(isRedlineAnnotation)
      .map(annotation => convertAnnotationToRedlineItem(annotation))
      .sort((a, b) => a.pageNumber - b.pageNumber);
  }

  static groupByPage(redlineItems: RedlineItem[]): Map<number, RedlineItem[]> {
    const grouped = new Map<number, RedlineItem[]>();
    
    redlineItems.forEach(item => {
      const existing = grouped.get(item.pageNumber) || [];
      grouped.set(item.pageNumber, [...existing, item]);
    });
    
    return grouped;
  }

  static getAnnotationStats(redlineItems: RedlineItem[]) {
    const stats = {
      total: redlineItems.length,
      byType: new Map<string, number>(),
      byPage: new Map<number, number>(),
    };

    redlineItems.forEach(item => {
      // Count by type
      const typeCount = stats.byType.get(item.type) || 0;
      stats.byType.set(item.type, typeCount + 1);

      // Count by page
      const pageCount = stats.byPage.get(item.pageNumber) || 0;
      stats.byPage.set(item.pageNumber, pageCount + 1);
    });

    return stats;
  }
}
