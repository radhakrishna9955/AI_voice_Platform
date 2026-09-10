"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { createInterview } from '@/lib/actions/interview.actions';

export default function CreateInterviewButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateInterview = async () => {
    setLoading(true);
    try {
      const result = await createInterview();
      
      if (result.success && result.interviewId) {
        router.push(`/interview/${result.interviewId}`);
      } else {
        alert('Failed to create interview: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      alert('Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCreateInterview}
      disabled={loading}
      className='btn-primary text-lg px-8 py-6'
    >
      {loading ? 'Creating Interview...' : 'Start Practice Interview'}
    </Button>
  );
}
