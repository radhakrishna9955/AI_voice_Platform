"use client";

interface ScoreCardProps {
  title: string;
  score: number;
  color: 'primary' | 'blue' | 'purple';
}

export default function ScoreCard({ title, score, color }: ScoreCardProps) {
  const colorClasses = {
    primary: 'text-primary-100',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
  };

  const bgClasses = {
    primary: 'bg-primary-100',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  // Calculate circle progress
  const circumference = 2 * Math.PI * 45; // radius = 45
  const progress = ((100 - score) / 100) * circumference;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              className={colorClasses[color]}
              style={{
                transition: 'stroke-dashoffset 1s ease-in-out',
              }}
            />
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-bold ${colorClasses[color]}`}>
              {score}
            </span>
          </div>
        </div>
      </div>
      
      {/* Score interpretation */}
      <div className="mt-4 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${bgClasses[color]} bg-opacity-10 ${colorClasses[color]}`}>
          {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Improvement'}
        </span>
      </div>
    </div>
  );
}
