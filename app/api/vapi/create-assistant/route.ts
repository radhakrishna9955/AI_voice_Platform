// Temporary cache to avoid recreating assistants
const assistantCache = new Map<string, { id: string; createdAt: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function POST(request: Request) {
  const { workflowId } = await request.json();

  // Check cache first
  const cached = assistantCache.get(workflowId);
  if (cached && Date.now() - cached.createdAt < CACHE_DURATION) {
    return Response.json({ 
      success: true, 
      assistantId: cached.id,
      cached: true 
    }, { status: 200 });
  }

  try {
    const response = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `InterviewIQ Workflow ${Date.now()}`,
        model: {
          provider: "openai",
          model: "gpt-4o",
          temperature: 0.8,
          emotionRecognitionEnabled: true,
          messages: [
            {
              role: "system",
              content: `You are a friendly, professional human interviewer conducting a practice interview. 
              
              Key traits:
              - Speak naturally with casual phrases like "um", "you know", "that's great"
              - Show enthusiasm and encouragement ("That's interesting!", "I like that approach")
              - Use filler words occasionally to sound human
              - Ask follow-up questions based on their answers
              - Share brief reactions ("Hmm, okay", "Right, I see")
              - Be conversational, not robotic
              - Use their name occasionally
              - Show empathy if they're struggling
              
              Avoid:
              - Being too formal or scripted
              - Speaking in perfect sentences always
              - Sounding like you're reading from a script`
            }
          ]
        },
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM", // Josh - enthusiastic, confident male voice
          stability: 0.4,
          similarityBoost: 0.75,
          style: 0.3,
          useSpeakerBoost: true,
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en",
        },
        firstMessage: "Hey! Thanks for joining. I'm really excited to help you prep for your interview today. So, what kind of role are we preparing for?",
        voicemailMessage: "Hey, it looks like I missed you. Feel free to call back anytime you're ready!",
        endCallMessage: "Thanks so much for practicing with me today. Good luck with your real interview - you're going to do great!",
        endCallPhrases: ["goodbye", "that's all", "thanks bye", "end call"],
        backgroundSound: "office",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Vapi API error:", errorData);
      return Response.json({ 
        success: false, 
        error: errorData 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Cache the assistant ID
    assistantCache.set(workflowId, {
      id: data.id,
      createdAt: Date.now()
    });

    return Response.json({ 
      success: true, 
      assistantId: data.id,
      cached: false
    }, { status: 200 });
  } catch (error) {
    console.error("Error creating assistant:", error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
