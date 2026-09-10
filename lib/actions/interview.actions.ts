'use server';

import { getCurrentUser } from './auth.actions';
import { db } from '@/firebase/admin';
import { getRandomInterviewCover } from '@/lib/utils';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function createInterview() {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, message: 'Session expired. Please sign in again to create an interview.' };
  }

  try {
    const role = 'Full Stack Developer';
    const type = 'Technical';
    const level = 'Mid-level';
    const techstack = 'React, Node.js, TypeScript';
    const amount = 5;

    // Generate questions
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const tempId = `interview-${Date.now()}`;
    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(",").map(t => t.trim()),
      questions: JSON.parse(questions),
      userid: user.id,
      finalized: true,
      coverImage: getRandomInterviewCover(tempId) as string,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return { success: true, interviewId: docRef.id };
  } catch (error: any) {
    console.error('Error creating interview:', error);
    return { success: false, message: `Failed to create interview: ${error?.message || error}` };
  }
}
