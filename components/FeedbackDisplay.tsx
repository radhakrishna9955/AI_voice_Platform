"use client";

import ScoreCard from './ScoreCard';
import FeedbackSection from './FeedbackSection';
import Link from 'next/link';

interface FeedbackDisplayProps {
  interview: any;
  feedback: any;
}

export default function FeedbackDisplay({ interview, feedback }: FeedbackDisplayProps) {
  const overallScore = feedback.overallScore || Math.round((feedback.behavioralScore + feedback.technicalScore) / 2);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Interview Feedback</h1>
        <p className="text-gray-400">
          {interview.role} • {interview.level} • {new Date(interview.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ScoreCard 
          title="Overall Score" 
          score={overallScore} 
          color="primary"
        />
        <ScoreCard 
          title="Behavioral Score" 
          score={feedback.behavioralScore} 
          color="blue"
        />
        <ScoreCard 
          title="Technical Score" 
          score={feedback.technicalScore} 
          color="purple"
        />
      </div>

      {/* Summary */}
      {feedback.summary && (
        <div className="bg-dark-300 border border-dark-400 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Performance Summary</h2>
          <p className="text-gray-300 leading-relaxed">{feedback.summary}</p>
        </div>
      )}

      {/* Detailed Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FeedbackSection 
          title="Strengths" 
          items={feedback.strengths || []}
          type="success"
        />
        <FeedbackSection 
          title="Areas for Improvement" 
          items={feedback.weaknesses || []}
          type="warning"
        />
      </div>

      {/* Suggestions */}
      <div className="mb-8">
        <FeedbackSection 
          title="Actionable Suggestions" 
          items={(feedback.suggestions || []).map((s: string | { title: string; description: string; priority?: string }) => 
            typeof s === 'string' ? s : `${s.title}: ${s.description}`
          )}
          type="info"
        />
      </div>

      {/* Resources */}
      <div className="mb-8">
        <FeedbackSection 
          title="Recommended Learning Resources" 
          items={(feedback.resources || []).map((r: string | { title: string; description: string; url?: string; type?: string }) => 
            typeof r === 'string' ? r : `${r.title} - ${r.description}${r.url ? ` (${r.url})` : ''}`
          )}
          type="resource"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mt-12">
        <Link 
          href="/"
          className="btn-secondary px-6 py-3 rounded-lg"
        >
          Back to Home
        </Link>
        <Link 
          href="/profile"
          className="btn-primary px-6 py-3 rounded-lg"
        >
          View All Interviews
        </Link>
      </div>
    </div>
  );
}
