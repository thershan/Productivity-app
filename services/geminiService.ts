
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { DailyEntry, Task } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getDailyReflection = async (tasks: Task[], journal: string): Promise<string> => {
  if (!journal && tasks.length === 0) {
    return "Log your tasks and a journal entry to receive a reflection.";
  }

  const taskSummary = tasks.map(t => `- Task: ${t.text}, Status: ${t.status}, Focus: ${t.focusLevel}/10`).join('\n');

  const prompt = `
    System Instruction: You are Darshan, a calm, realistic, and mentor-like AI self-mastery coach. Your goal is to provide insightful, non-judgmental reflections to help the user understand their own mind. Avoid generic praise or toxic positivity. Focus on patterns, triggers, and opportunities for self-awareness.

    User Input:
    Today's Tasks:
    ${taskSummary}

    My Journal Entry: "${journal}"

    Provide a brief, one-paragraph reflection on my day. What patterns or connections do you notice between my tasks, focus levels, and thoughts? What is one gentle question I could ask myself?
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating daily reflection:", error);
    return "There was an error generating the reflection. Please try again.";
  }
};

export interface WeeklyInsight {
    title: string;
    summary: string;
    suggestion: string;
}

export const getWeeklyInsights = async (entries: DailyEntry[]): Promise<WeeklyInsight[] | string> => {
  if (entries.length < 3) {
      return "You need at least 3 days of entries to generate weekly insights.";
  }

  const prompt = `
    System Instruction: You are Darshan, an AI analyst specializing in human performance and self-mastery. You are analyzing a week of a user's productivity and journal data. Your tone is motivational but grounded in data. Identify the most significant patterns and present them as actionable insights.

    User Input:
    Here is my data for the last ${entries.length} days:
    ${JSON.stringify(entries, null, 2)}

    Analyze this data and provide 3 distinct insights. For each insight, provide:
    1. A short, impactful title (e.g., "Your Focus Peak," "The Procrastination Trigger").
    2. A one-sentence summary of the pattern.
    3. A brief, encouraging suggestion for the user to consider next week.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              suggestion: { type: Type.STRING },
            },
            required: ["title", "summary", "suggestion"],
          },
        },
      },
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as WeeklyInsight[];

  } catch (error) {
    console.error("Error generating weekly insights:", error);
    return "There was an error analyzing your week. Please check your data and try again.";
  }
};
