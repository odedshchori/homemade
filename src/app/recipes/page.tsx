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
  const [debugInfo, setDebugInfo] = useState<{
    model: string;
    status: string;
    duration?: number;
  } | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

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
            const response = await getSuggestedRecipes(pantry || [])
            setRecipes(response?.recipes || [])
            if (response) {
              setDebugInfo({
                model: response.model,
                status: response.status,
                duration: response.duration
              })
            }
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
    <div className="max-w-4xl mx-auto p-4 sm:p-8 relative min-h-screen pb-24" dir="rtl">
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
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-900/30 dark:text-orange-300">
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

            <button 
              onClick={() => setSelectedRecipe(recipe)}
              className="w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              צפייה בהוראות ההכנה
            </button>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{selectedRecipe.title} - הוראות הכנה</h2>
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                aria-label="סגור"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <ol className="space-y-6">
                {selectedRecipe.instructions.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 py-3 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}

      {debugInfo && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 p-4 bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg text-[10px] font-mono text-zinc-500 dark:text-zinc-400 z-50">
          <div className="flex justify-between items-center mb-1 border-b border-zinc-200 dark:border-zinc-700 pb-1">
            <span className="font-bold uppercase tracking-wider">AI Debug Info</span>
            <span className="px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200">
              v1.0
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Model:</span>
              <span className="text-zinc-900 dark:text-zinc-100">{debugInfo.model}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-zinc-900 dark:text-zinc-100">{debugInfo.status}</span>
            </div>
            {debugInfo.duration && (
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-zinc-900 dark:text-zinc-100">{(debugInfo.duration / 1000).toFixed(2)}s</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
