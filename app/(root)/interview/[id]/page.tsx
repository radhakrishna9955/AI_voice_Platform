import Agent from '@/components/Agent';
import { db } from '@/firebase/admin';
import { getCurrentUser } from '@/lib/actions/auth.actions';
import { redirect } from 'next/navigation';

export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
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

  // If interview already has feedback, redirect to feedback page
  if (interview?.feedback) {
    redirect(`/interview/${id}/feedback`);
  }

  return (
    <>
      <div className="mt-10 mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{interview?.role} Interview</h3>
        <p className="text-gray-400">
          {interview?.level} • {interview?.type} • {interview?.questions?.length || 0} questions
        </p>
      </div>
      <Agent 
        userName={user.name} 
        userId={user.id} 
        type="interview" 
        workflowId="1cb3698d-b3a0-40d7-8d82-3042a777461c"
        interviewId={id}
      />
    </>
  );
}
