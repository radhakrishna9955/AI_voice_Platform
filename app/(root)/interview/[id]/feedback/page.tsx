import { db } from '@/firebase/admin';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth.actions';
import FeedbackDisplay from '@/components/FeedbackDisplay';

export default async function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  const { id } = await params;
  const interviewDoc = await db.collection('interviews').doc(id).get();
  
  if (!interviewDoc.exists) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white">Interview not found</h1>
      </div>
    );
  }

  const interview = interviewDoc.data();
  
  // Check if feedback has been generated
  if (!interview?.feedback) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-2">Analyzing Your Interview</h1>
          <p className="text-gray-400">Please wait while we generate your feedback...</p>
        </div>
      </div>
    );
  }

  return <FeedbackDisplay interview={interview} feedback={interview.feedback} />;
}
