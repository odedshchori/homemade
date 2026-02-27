import { Ingredient, Recipe } from '../types';

export const getSuggestedRecipes = async (pantry: Ingredient[]): Promise<Recipe[]> => {
  // In the future, this will call an AI API (Gemini/OpenAI)
  // For now, we return mock data
  console.log('Fetching recipes for pantry:', pantry);
  
  return [
    {
      id: '1',
      title: 'Simple Vegetable Stir-fry',
      description: 'A quick and healthy stir-fry using whatever vegetables you have.',
      ingredients: [
        { name: 'Mixed Vegetables', amount: '500g' },
        { name: 'Soy Sauce', amount: '2 tbsp' },
        { name: 'Olive Oil', amount: '1 tbsp' }
      ],
      instructions: [
        'Chop all vegetables into bite-sized pieces.',
        'Heat oil in a wok or large pan over high heat.',
        'Add vegetables and stir-fry for 5-7 minutes.',
        'Add soy sauce and toss to coat.',
        'Serve hot with rice or noodles.'
      ],
      calories: 250,
      info: 'High in fiber and vitamins!',
      suggestions: ['Add tofu or chicken for protein.']
    },
    {
      id: '2',
      title: 'Creamy Tomato Pasta',
      description: 'A comforting pasta dish with a rich tomato sauce.',
      ingredients: [
        { name: 'Pasta', amount: '200g' },
        { name: 'Tomato Sauce', amount: '400ml' },
        { name: 'Cream', amount: '100ml' },
        { name: 'Garlic', amount: '2 cloves' }
      ],
      instructions: [
        'Cook pasta according to package instructions.',
        'In a separate pan, sauté minced garlic in oil.',
        'Add tomato sauce and simmer for 10 minutes.',
        'Stir in cream and cook for another 2 minutes.',
        'Toss pasta with the sauce and serve.'
      ],
      calories: 450,
      info: 'A classic Italian-style comfort meal.',
      suggestions: ['Top with fresh basil and parmesan cheese.']
    }
  ];
};
