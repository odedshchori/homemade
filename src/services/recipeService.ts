import { Ingredient, Recipe } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export const getSuggestedRecipes = async (pantry: Ingredient[]): Promise<Recipe[]> => {
  if (!pantry.length) return [];
  
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is missing. Returning mock data.');
    return getMockRecipes();
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const pantryList = pantry.map(ing => `${ing.name} (${ing.quantity} ${ing.unit})`).join(', ');

  const prompt = `
    You are a professional chef. Based on the following pantry ingredients, suggest 3 delicious and easy recipes. 
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
    ONLY return the JSON array, no extra text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up response text if it includes markdown code blocks
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedText) as Recipe[];
  } catch (error) {
    console.error('Error generating recipes with Gemini:', error);
    return getMockRecipes();
  }
};

const getMockRecipes = (): Recipe[] => [
  {
    id: 'mock-1',
    title: 'Simple Vegetable Stir-fry (Mock)',
    description: 'A quick and healthy stir-fry using whatever vegetables you have.',
    ingredients: [
      { name: 'Mixed Vegetables', amount: '500g' },
      { name: 'Soy Sauce', amount: '2 tbsp' }
    ],
    instructions: ['Stir-fry vegetables.', 'Add soy sauce.'],
    calories: 250,
    info: 'Mock data: Add your Gemini API key to see real results!'
  }
];
