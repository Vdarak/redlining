'use client';

import { RedlineItem as RedlineItemType } from '@/types';
import { RedlineItem } from './RedlineItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface RedlineSidebarProps {
  redlineItems: RedlineItemType[];
  activeItemId: string | null;
  onItemClick: (item: RedlineItemType) => void;
  isLoading: boolean;
}

export function RedlineSidebar({
  redlineItems,
  activeItemId,
  onItemClick,
  isLoading,
}: RedlineSidebarProps) {
  if (isLoading) {
    return (
      <div className="w-96 bg-neutral-50 border-r border-neutral-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading annotations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-neutral-50 border-r border-neutral-200 flex flex-col">
      {/* Header */}
      <div className="p-6 bg-primary-800 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary-700 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight">Redlined Items</h2>
            <p className="text-sm text-primary-200">Document Annotations</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Badge className="bg-primary-600 hover:bg-primary-600 text-white">
            {redlineItems.length} Items
          </Badge>
          {redlineItems.length > 0 && (
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              {new Set(redlineItems.map(item => item.pageNumber)).size} Pages
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Content */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-4 space-y-3">
          {redlineItems.length === 0 ? (
            <Card className="p-8 bg-white">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-neutral-400" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">No Annotations Found</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Start adding comments, highlights, or markup to the document using the tools in the PDF viewer.
                </p>
              </div>
            </Card>
          ) : (
            redlineItems.map((item) => (
              <RedlineItem
                key={item.id}
                item={item}
                isActive={item.id === activeItemId}
                onClick={() => onItemClick(item)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
