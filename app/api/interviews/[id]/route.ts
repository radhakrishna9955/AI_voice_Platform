import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';
import { getCurrentUser } from '@/lib/actions/auth.actions';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Get the interview to verify ownership
    const interviewDoc = await db.collection('interviews').doc(id).get();
    
    if (!interviewDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Interview not found' },
        { status: 404 }
      );
    }

    const interview = interviewDoc.data();
    
    // Verify the user owns this interview
    if (interview?.userid !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to delete this interview' },
        { status: 403 }
      );
    }

    // Delete the interview
    await db.collection('interviews').doc(id).delete();

    return NextResponse.json({
      success: true,
      message: 'Interview deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to delete interview' 
      },
      { status: 500 }
    );
  }
}
