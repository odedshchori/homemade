export type Category = 
  | 'Fruits' 
  | 'Vegetables' 
  | 'Legumes' 
  | 'Sauces' 
  | 'Dairy' 
  | 'Meat' 
  | 'Grains' 
  | 'Spices' 
  | 'Other';

export type Unit = 'quantity' | 'kg' | 'g' | 'ml' | 'l' | 'tsp' | 'tbsp' | 'cup';

export interface Ingredient {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  updated_at: string;
  user_id: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  calories?: number;
  info?: string;
  suggestions?: string[];
}
