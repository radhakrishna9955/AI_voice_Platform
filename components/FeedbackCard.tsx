"use client";

import { useState } from 'react';
import { Calendar, Edit2, Check, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FeedbackCardProps {
  interviewId: string;
  createdAt: string;
  initialTitle?: string;
}

export default function FeedbackCard({ interviewId, createdAt, initialTitle }: FeedbackCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(initialTitle || 'Interview Session');
  const router = useRouter();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = () => {
    // TODO: Save to Firestore if needed
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/interviews/${interviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete interview');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting interview:', error);
      alert('Failed to delete interview');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-dark-300 border border-dark-400 rounded-lg p-6 hover:border-primary-100 transition-colors relative">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
        title="Delete interview"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex items-start justify-between mb-4 pr-8">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-dark-400 text-white px-3 py-1 rounded border border-dark-400 focus:border-primary-100 outline-none flex-1"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="text-green-500 hover:text-green-400 p-1"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setTitle(initialTitle || 'Interview Session');
                setIsEditing(false);
              }}
              className="text-red-500 hover:text-red-400 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-white p-1"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
        <Calendar className="w-4 h-4" />
        <span>{formatDateTime(createdAt)}</span>
      </div>

      <Link
        href={`/interview/${interviewId}/feedback`}
        className="block w-full text-center bg-primary-100 hover:bg-primary-100/90 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        View Feedback
      </Link>
    </div>
  );
}
