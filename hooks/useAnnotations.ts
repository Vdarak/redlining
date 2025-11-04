'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnnotationManager, Annotation, RedlineItem, AnnotationEvent } from '@/types';
import { AnnotationParser } from '@/lib/annotation-parser';

export function useAnnotations(annotationManager: AnnotationManager | null) {
  const [redlineItems, setRedlineItems] = useState<RedlineItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load annotations when manager is available
  useEffect(() => {
    if (!annotationManager) return;

    const loadAnnotations = async () => {
      setIsLoading(true);
      try {
        const annotations = await annotationManager.getAnnotations();
        const items = AnnotationParser.parseAnnotations(annotations);
        setRedlineItems(items);
      } catch (error) {
        console.error('Error loading annotations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnnotations();
  }, [annotationManager]);

  // Register event listeners for annotation changes
  useEffect(() => {
    if (!annotationManager) return;

    const handleAnnotationEvent = (event: AnnotationEvent) => {
      console.log('Annotation event:', event.type);
      
      switch (event.type) {
        case 'ANNOTATION_ADDED':
          handleAnnotationAdded(event.data);
          break;
        case 'ANNOTATION_UPDATED':
          handleAnnotationUpdated(event.data);
          break;
        case 'ANNOTATION_DELETED':
          handleAnnotationDeleted(event.data);
          break;
      }
    };

    const eventOptions = {
      listenOn: ['ANNOTATION_ADDED', 'ANNOTATION_UPDATED', 'ANNOTATION_DELETED'],
    };

    try {
      annotationManager.registerEventListener(handleAnnotationEvent, eventOptions);
    } catch (error) {
      console.error('Error registering event listener:', error);
    }
  }, [annotationManager]);

  const handleAnnotationAdded = useCallback((annotation: Annotation) => {
    setRedlineItems(prev => {
      const items = AnnotationParser.parseAnnotations([...prev.map(item => item.annotation), annotation]);
      return items;
    });
  }, []);

  const handleAnnotationUpdated = useCallback((annotation: Annotation) => {
    setRedlineItems(prev => {
      const updated = prev.map(item => 
        item.id === annotation.id 
          ? { ...item, annotation, text: annotation.bodyValue || item.text }
          : item
      );
      return updated;
    });
  }, []);

  const handleAnnotationDeleted = useCallback((annotation: Annotation) => {
    setRedlineItems(prev => prev.filter(item => item.id !== annotation.id));
  }, []);

  const setActiveItem = useCallback((id: string | null) => {
    setActiveItemId(id);
  }, []);

  const groupedByPage = AnnotationParser.groupByPage(redlineItems);
  const stats = AnnotationParser.getAnnotationStats(redlineItems);

  return {
    redlineItems,
    activeItemId,
    isLoading,
    setActiveItem,
    groupedByPage,
    stats,
  };
}
