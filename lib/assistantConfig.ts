// Example assistant configuration for Vapi
export const createInterviewAssistant = (questions: string[], role: string) => ({
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an AI interviewer conducting a ${role} interview. 
        Ask the following questions one by one and engage naturally with the candidate.
        Questions: ${questions.join(", ")}
        
        Be professional, encouraging, and take notes on their responses.
        After all questions, provide brief feedback.`
      }
    ]
  },
  voice: {
    provider: "11labs",
    voiceId: "21m00Tcm4TlvDq8ikWAM" // Default voice, change as needed
  },
  name: `${role} Interview`,
  firstMessage: `Hello! I'm conducting your ${role} interview today. Are you ready to begin?`,
});
