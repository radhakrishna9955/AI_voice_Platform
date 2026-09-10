import { getCurrentUser } from '@/lib/actions/auth.actions';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import { db } from '@/firebase/admin';
import FeedbackCard from '@/components/FeedbackCard';

const ProfilePage = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Get user's interviews
  const interviewsSnapshot = await db
    .collection('interviews')
    .where('userid', '==', user.id)
    .get();

  console.log('Profile page - User ID:', user.id);
  console.log('Profile page - Total interviews found:', interviewsSnapshot.docs.length);
  
  // Map and sort all interviews
  const completedInterviews = interviewsSnapshot.docs
    .map(doc => {
      const data = doc.data();
      return {
        interviewId: doc.id,
        userId: data.userid,
        role: data.role,
        type: data.type,
        techstack: data.techstack,
        createdAt: data.createdAt,
        feedback: data.feedback,
        feedbackGeneratedAt: data.feedbackGeneratedAt,
        status: data.status
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      <ProfileForm user={user} />

      {/* Interview History Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Interview History</h2>
        
        {completedInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedInterviews.map((interview) => (
              <FeedbackCard
                key={interview.interviewId}
                interviewId={interview.interviewId}
                createdAt={interview.feedbackGeneratedAt || interview.createdAt}
                initialTitle={`${interview.role} Interview`}
              />
            ))}
          </div>
        ) : (
          <div className="bg-dark-300 border border-dark-400 rounded-lg p-8 text-center">
            <p className="text-gray-400">No completed interviews yet. Start practicing to see your history here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
