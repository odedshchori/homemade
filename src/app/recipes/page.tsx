'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { getSuggestedRecipes } from '@/services/recipeService'
import { Recipe } from '@/types'
import Link from 'next/link'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchAndSuggest = async () => {
      try {
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
          setError('שגיאה בטעינת המצרכים מהמזווה.')
        } else {
          try {
            const suggested = await getSuggestedRecipes(pantry || [])
            setRecipes(suggested)
          } catch (recipeError: unknown) {
            const err = recipeError as Error
            if (err.message === 'GEMINI_SERVICE_UNAVAILABLE') {
              setError('השירות אינו זמין כרגע, אנא נסו שוב מאוחר יותר.')
            } else if (err.message === 'GEMINI_API_KEY is missing') {
              setError('מפתח ה-API של Gemini חסר. אנא הגדר אותו בקובץ ה-env.')
            } else {
              setError('אירעה שגיאה בייצור המתכונים. אנא נסו שוב.')
            }
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('אירעה שגיאה בלתי צפויה.')
      } finally {
        setLoading(false)
      }
    }
    fetchAndSuggest()
  }, [supabase])

  if (loading) return (
    <div className="p-8 text-center" dir="rtl">
      <div className="animate-pulse text-xl font-medium text-zinc-600 dark:text-zinc-400">
        מבשלים עבורכם מתכונים...
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8" dir="rtl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50">הצעות למתכונים</h1>
        <Link href="/pantry" className="text-sm font-medium hover:underline text-zinc-600 dark:text-zinc-400">
          חזרה למזווה
        </Link>
      </header>

      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-red-800 dark:text-red-400">שגיאה</h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {!recipes.length && !loading && !error && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">לא נמצאו מתכונים. נסו להוסיף עוד מצרכים למזווה שלכם!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map(recipe => (
          <div key={recipe.id} className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-2 text-zinc-800 dark:text-zinc-100">{recipe.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.calories && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full dark:bg-orange-900/30 dark:text-orange-300">
                  🔥 {recipe.calories} קלוריות
                </span>
              )}
              {recipe.info && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                  💡 {recipe.info}
                </span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-xs mb-2 uppercase tracking-wide text-zinc-400">מצרכים עיקריים</h3>
              <ul className="space-y-1">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    {ing.name} ({ing.amount})
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
              צפייה בהוראות ההכנה
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
