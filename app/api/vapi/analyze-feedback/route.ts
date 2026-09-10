import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/admin';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: NextRequest) {
  try {
    const { interviewId, transcript, messages } = await req.json();

    if (!interviewId) {
      return NextResponse.json(
        { success: false, message: 'Interview ID is required' },
        { status: 400 }
      );
    }

    // Get interview details from Firestore
    const interviewDoc = await db.collection('interviews').doc(interviewId).get();
    
    if (!interviewDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Interview not found' },
        { status: 404 }
      );
    }

    const interviewData = interviewDoc.data();
    
    // Prepare conversation for analysis
    const conversationText = messages?.map((msg: { role: string; content: string }) => 
      `${msg.role}: ${msg.content}`
    ).join('\n') || transcript || 'No transcript available';

    // Generate feedback using AI
    const prompt = `You are an expert interview coach analyzing a technical interview. 
    
Interview Details:
- Role: ${interviewData?.role || 'Not specified'}
- Level: ${interviewData?.level || 'Not specified'}
- Tech Stack: ${interviewData?.techstack?.join(', ') || 'Not specified'}
- Questions Asked: ${interviewData?.questions?.length || 0}

Conversation Transcript:
${conversationText}

Analyze this interview and provide:
1. Behavioral Score (0-100): Communication, confidence, clarity, professionalism
2. Technical Score (0-100): Technical knowledge, problem-solving, accuracy
3. Detailed breakdown of strengths and weaknesses in both areas
4. 3-5 specific, actionable suggestions for improvement
5. Recommended learning resources or topics to focus on

Format your response as JSON with this structure:
{
  "behavioralScore": <number 0-100>,
  "technicalScore": <number 0-100>,
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "resources": ["resource/topic1", "resource/topic2", ...]
}

Be constructive, specific, and encouraging. Focus on actionable feedback.`;

    console.log('Generating feedback analysis...');
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt,
      temperature: 0.7,
    });

    console.log('AI Response:', text);

    // Parse AI response
    let feedback;
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedback = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback feedback if parsing fails
      feedback = {
        behavioralScore: 70,
        technicalScore: 70,
        strengths: ['Participated in the interview', 'Showed interest in the role'],
        weaknesses: ['Analysis incomplete - please review manually'],
        suggestions: ['Practice more technical questions', 'Work on communication skills', 'Review core concepts'],
        resources: ['LeetCode for coding practice', 'System design fundamentals', 'Mock interview platforms']
      };
    }

    // Save feedback to Firestore
    await db.collection('interviews').doc(interviewId).update({
      feedback: {
        behavioral: feedback.behavioralScore,
        technical: feedback.technicalScore,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        suggestions: feedback.suggestions,
        resources: feedback.resources,
        analyzed: true,
        analyzedAt: new Date().toISOString(),
      },
      transcript: conversationText,
      updatedAt: new Date().toISOString(),
    });

    console.log('Feedback saved successfully for interview:', interviewId);

    return NextResponse.json({
      success: true,
      feedback,
      message: 'Feedback generated successfully',
    });

  } catch (error: unknown) {
    console.error('Error analyzing feedback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to analyze feedback',
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
