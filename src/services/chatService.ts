import type { Message } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL_NAME = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role?: string;
    };
    finishReason?: string;
    index?: number;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }>;
}

const validateConversation = (messages: Message[]): Message[] => {
  const validMessages: Message[] = [];
  let lastRole: 'user' | 'ai' | null = null;

  for (const msg of messages) {
    if (lastRole !== msg.role) {
      validMessages.push(msg);
      lastRole = msg.role;
    }
  }

  if (validMessages.length > 0 && validMessages[0].role !== 'user') {
    validMessages.shift();
  }

  return validMessages;
};

const makeGeminiRequest = async (
  contents: Array<{ role: string; parts: Array<{ text: string }> }>,
  retries = 3,
  delay = 1000
): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      });

      if (response.status === 503 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  throw new Error('Max retries reached');
};

export const sendMessageToGemini = async (
  messages: Message[]
): Promise<string> => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('API key is missing. Please add VITE_GEMINI_API_KEY to your .env file');
    }

    const validMessages = validateConversation(messages);

    if (validMessages.length === 0) {
      throw new Error('No valid messages to send');
    }

    const contents = validMessages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const response = await makeGeminiRequest(contents);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `Gemini API returned ${response.status}: ${response.statusText}`
      );
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from AI. The content may have been blocked by safety filters.');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    if (!responseText) {
      throw new Error('AI returned an empty response');
    }

    return responseText;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to communicate with AI');
  }
};