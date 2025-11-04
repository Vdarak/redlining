'use client';

import { RedlineItem as RedlineItemType } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageSquare, Highlighter, Strikethrough, Underline } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RedlineItemProps {
  item: RedlineItemType;
  isActive: boolean;
  onClick: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  Highlight: <Highlighter className="w-4 h-4" />,
  StrikeOut: <Strikethrough className="w-4 h-4" />,
  Underline: <Underline className="w-4 h-4" />,
  FreeText: <MessageSquare className="w-4 h-4" />,
  Note: <MessageSquare className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
  Highlight: 'bg-gold-100 text-gold-700 border-gold-300',
  StrikeOut: 'bg-accent-100 text-accent-700 border-accent-300',
  Underline: 'bg-primary-100 text-primary-700 border-primary-300',
  FreeText: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  Note: 'bg-neutral-100 text-neutral-700 border-neutral-300',
};

export function RedlineItem({ item, isActive, onClick }: RedlineItemProps) {
  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all duration-200 border-l-4',
        isActive
          ? 'bg-accent-50 border-l-accent-600 shadow-md'
          : 'bg-white border-l-accent-400 hover:bg-accent-50/50 hover:shadow-sm'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-lg mt-1',
          typeColors[item.type] || 'bg-neutral-100 text-neutral-700'
        )}>
          {typeIcons[item.type] || <FileText className="w-4 h-4" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs font-medium text-primary-700">
              Page {item.pageNumber}
            </Badge>
            <Badge variant="outline" className="text-xs font-medium text-neutral-600">
              {item.type}
            </Badge>
          </div>
          
          <p className="text-sm text-neutral-900 leading-relaxed line-clamp-3">
            {item.text}
          </p>
        </div>
      </div>
    </Card>
  );
}
