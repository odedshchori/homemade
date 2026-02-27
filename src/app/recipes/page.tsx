'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { getSuggestedRecipes } from '@/services/recipeService'
import { Ingredient, Recipe } from '@/types'
import Link from 'next/link'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchAndSuggest = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: pantry, error: pantryError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', user.id)

      if (pantryError) {
        setError('Failed to fetch pantry ingredients.')
      } else {
        const suggested = await getSuggestedRecipes(pantry || [])
        setRecipes(suggested)
      }
      setLoading(false)
    }
    fetchAndSuggest()
  }, [])

  if (loading) return <div className="p-8 text-center">Cooking up some recipes for you...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">Recipe Suggestions</h1>
        <Link href="/pantry" className="text-sm font-medium hover:underline">
          Back to Pantry
        </Link>
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!recipes.length && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No recipes found. Try adding more ingredients to your pantry!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map(recipe => (
          <div key={recipe.id} className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.calories && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full dark:bg-orange-900/30 dark:text-orange-300">
                  🔥 {recipe.calories} kcal
                </span>
              )}
              {recipe.info && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                  💡 {recipe.info}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-sm mb-2 uppercase tracking-wide text-gray-500">Key Ingredients</h3>
            <ul className="list-disc list-inside text-sm mb-4">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing.name} ({ing.amount})</li>
              ))}
            </ul>

            <button className="w-full bg-zinc-100 dark:bg-zinc-800 py-2 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
              View Instructions
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
