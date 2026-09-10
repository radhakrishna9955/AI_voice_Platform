import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/firebase/admin';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { interviewId, transcript, messages } = await request.json();

    if (!interviewId) {
      return NextResponse.json(
        { success: false, message: 'Interview ID is required' },
        { status: 400 }
      );
    }

    console.log('Generating feedback for interview:', interviewId);

    // Get interview details
    const interviewDoc = await db.collection('interviews').doc(interviewId).get();
    if (!interviewDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Interview not found' },
        { status: 404 }
      );
    }

    const interview = interviewDoc.data();

    // Analyze the interview using AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

    const analysisPrompt = `Analyze this technical interview and provide detailed feedback:

Interview Details:
- Role: ${interview?.role || 'Not specified'}
- Level: ${interview?.level || 'Not specified'}
- Tech Stack: ${interview?.techstack?.join(', ') || 'Not specified'}

Interview Transcript/Messages:
${transcript || JSON.stringify(messages, null, 2)}

Please provide a JSON response with the following structure:
{
  "behavioralScore": <number 0-100>,
  "technicalScore": <number 0-100>,
  "overallScore": <number 0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "suggestions": [
    {
      "title": "Suggestion title",
      "description": "Detailed suggestion",
      "priority": "high|medium|low"
    }
  ],
  "resources": [
    {
      "title": "Resource title",
      "description": "What this resource covers",
      "url": "https://example.com",
      "type": "article|video|course|documentation"
    }
  ],
  "summary": "Overall performance summary in 2-3 sentences"
}

Scoring criteria:
- Behavioral Score: Communication clarity, confidence, problem-solving approach, listening skills
- Technical Score: Accuracy of answers, depth of knowledge, code quality (if applicable), technical terminology usage
- Overall Score: Average of behavioral and technical scores

Be constructive and specific in feedback. Provide actionable suggestions and relevant learning resources.`;

    const result = await model.generateContent(analysisPrompt);
    const responseText = result.response.text();
    
    // Extract JSON from markdown code blocks if present
    let feedbackData;
    try {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
      feedbackData = JSON.parse(jsonMatch ? jsonMatch[1] : responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      throw new Error('Failed to parse feedback data');
    }

    // Save feedback to Firestore
    await db.collection('interviews').doc(interviewId).update({
      feedback: feedbackData,
      feedbackGeneratedAt: new Date().toISOString(),
      status: 'completed'
    });

    console.log('Feedback generated successfully for interview:', interviewId);

    return NextResponse.json({
      success: true,
      feedback: feedbackData
    });

  } catch (error: any) {
    console.error('Error generating feedback:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to generate feedback' 
      },
      { status: 500 }
    );
  }
}
