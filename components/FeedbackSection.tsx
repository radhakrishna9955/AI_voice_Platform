"use client";

import { CheckCircle, AlertCircle, Info, BookOpen } from 'lucide-react';

interface FeedbackSectionProps {
  title: string;
  items: string[];
  type: 'success' | 'warning' | 'info' | 'resource';
}

export default function FeedbackSection({ title, items, type }: FeedbackSectionProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    resource: <BookOpen className="w-5 h-5 text-purple-500" />,
  };

  const borderColors = {
    success: 'border-green-500/20',
    warning: 'border-yellow-500/20',
    info: 'border-blue-500/20',
    resource: 'border-purple-500/20',
  };

  const bgColors = {
    success: 'bg-green-500/5',
    warning: 'bg-yellow-500/5',
    info: 'bg-blue-500/5',
    resource: 'bg-purple-500/5',
  };

  return (
    <div className={`border ${borderColors[type]} ${bgColors[type]} rounded-lg p-6`}>
      <div className="flex items-center gap-2 mb-4">
        {icons[type]}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      
      <ul className="space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-gray-400 mt-1">•</span>
              <span className="text-gray-300 flex-1">{item}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic">No items to display</li>
        )}
      </ul>
    </div>
  );
}
