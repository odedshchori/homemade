import { Ingredient, Recipe } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const generateWithModel = async (modelName: string, prompt: string): Promise<Recipe[]> => {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Clean up response text if it includes markdown code blocks
  const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleanedText) as Recipe[];
};

export const getSuggestedRecipes = async (pantry: Ingredient[]): Promise<Recipe[]> => {
  if (!pantry.length) return [];
  
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  const pantryList = pantry.map(ing => `${ing.name} (${ing.quantity} ${ing.unit})`).join(', ');

  const prompt = `
    You are a professional chef. Based on the following pantry ingredients, suggest 3 delicious and easy recipes in Hebrew. 
    Pantry: ${pantryList}

    Return the recipes as a JSON array of objects with the following structure:
    {
      "id": "unique string",
      "title": "string",
      "description": "string",
      "ingredients": [{"name": "string", "amount": "string"}],
      "instructions": ["string"],
      "calories": number,
      "info": "short nutritional or fun fact",
      "suggestions": ["alternative ingredients or tips"]
    }
    ONLY return the JSON array, no extra text. Ensure the title, description, ingredients names, and instructions are in Hebrew.
  `;

  try {
    console.log('Attempting recipe generation with gemini-3-flash-preview...');
    return await generateWithModel("gemini-3-flash-preview", prompt);
  } catch (error: unknown) {
    const errorWithStatus = error as { status?: number; message?: string };
    // Check if it's a 503 error or any other error that might benefit from a fallback
    const is503 = errorWithStatus?.status === 503 || errorWithStatus?.message?.includes('503') || errorWithStatus?.message?.includes('high demand');
    
    if (is503) {
      console.warn('gemini-3-flash-preview is experiencing high demand (503). Falling back to gemini-1.5-flash-latest...');
      try {
        return await generateWithModel("gemini-1.5-flash-latest", prompt);
      } catch (fallbackError) {
        console.error('Fallback model gemini-1.5-flash-latest also failed:', fallbackError);
        throw new Error('GEMINI_SERVICE_UNAVAILABLE');
      }
    }

    console.error('Error generating recipes with Gemini (primary model):', error);
    // Even for non-503, we might want to try fallback once if it's a transient issue
    try {
      console.log('Attempting fallback to gemini-1.5-flash-latest after primary error...');
      return await generateWithModel("gemini-1.5-flash-latest", prompt);
    } catch (fallbackError) {
      console.error('Fallback model also failed:', fallbackError);
      throw new Error('GEMINI_SERVICE_UNAVAILABLE');
    }
  }
};
