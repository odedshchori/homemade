'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Ingredient, Category, Unit } from '@/types'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

const CATEGORIES: Category[] = [
  'Fruits', 'Vegetables', 'Legumes', 'Sauces', 'Dairy', 'Meat', 'Grains', 'Spices', 'Other'
]
const UNITS: Unit[] = ['quantity', 'kg', 'g', 'ml', 'l', 'tsp', 'tbsp', 'cup']

const CATEGORY_LABELS: Record<Category, string> = {
  'Fruits': 'פירות',
  'Vegetables': 'ירקות',
  'Legumes': 'קטניות',
  'Sauces': 'רטבים',
  'Dairy': 'מוצרי חלב',
  'Meat': 'בשר',
  'Grains': 'דגנים',
  'Spices': 'תבלינים',
  'Other': 'אחר'
}

const UNIT_LABELS: Record<Unit, string> = {
  'quantity': 'יח׳',
  'kg': 'ק״ג',
  'g': 'גרם',
  'ml': 'מ״ל',
  'l': 'ליטר',
  'tsp': 'כפית',
  'tbsp': 'כף',
  'cup': 'כוס'
}

export default function PantryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  
  // New ingredient form state
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<Category>('Vegetables')
  const [newQuantity, setNewQuantity] = useState(0)
  const [newUnit, setNewUnit] = useState<Unit>('quantity')

  // Search and Filter state
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('All')

  const supabase = createClient()
  const router = useRouter()

  const fetchIngredients = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) console.error('Error fetching ingredients:', error)
    else setIngredients(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        fetchIngredients(user.id)
      }
    }
    checkUser()
  }, [router, supabase, fetchIngredients])

  const addIngredient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !user) return

    const { data, error } = await supabase
      .from('ingredients')
      .insert([
        { 
          name: newName, 
          category: newCategory, 
          quantity: newQuantity, 
          unit: newUnit, 
          user_id: user.id 
        }
      ])
      .select()

    if (error) {
      console.error('Error adding ingredient:', error)
    } else {
      setIngredients([...ingredients, ...(data || [])])
      setNewName('')
      setNewQuantity(0)
    }
  }

  const updateQuantity = async (id: string, delta: number) => {
    const ing = ingredients.find(i => i.id === id)
    if (!ing) return
    const newQty = Math.max(0, ing.quantity + delta)

    const { error } = await supabase
      .from('ingredients')
      .update({ quantity: newQty })
      .eq('id', id)

    if (error) console.error('Error updating quantity:', error)
    else setIngredients(ingredients.map(i => i.id === id ? { ...i, quantity: newQty } : i))
  }

  const deleteIngredient = async (id: string) => {
    if (!confirm('האם אתם בטוחים שברצונכם למחוק את זה?')) return
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id)

    if (error) console.error('Error deleting ingredient:', error)
    else setIngredients(ingredients.filter(ing => ing.id !== id))
  }

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = filterCategory === 'All' || ing.category === filterCategory
    return matchesSearch && matchesCategory
  })

  if (loading) return <div className="p-8 text-center text-zinc-500">טוען את המזווה שלך...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">המזווה שלי</h1>
          <p className="text-zinc-500 dark:text-zinc-400">נהלו את המצרכים שלכם בקלות.</p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => router.push('/recipes')}
            className="text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            קבל מתכונים
          </button>
          <button 
            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
            className="text-sm text-zinc-400 hover:text-red-500 transition-colors"
          >
            התנתק
          </button>
        </div>
      </header>

      {/* Add Ingredient Section */}
      <section className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 mb-8">
        <h2 className="text-lg font-bold mb-4">הוסף מצרך חדש</h2>
        <form onSubmit={addIngredient} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">שם</label>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white outline-none" 
              placeholder="לדוגמה: אבוקדו"
              required
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">קטגוריה</label>
            <select 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value as Category)}
              className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>)}
            </select>
          </div>
          <div className="w-24">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">כמות</label>
            <input 
              type="number" 
              value={newQuantity} 
              onChange={(e) => setNewQuantity(Number(e.target.value))}
              className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none" 
              step="0.1"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">יחידה</label>
            <select 
              value={newUnit} 
              onChange={(e) => setNewUnit(e.target.value as Unit)}
              className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none"
            >
              {UNITS.map(u => <option key={u} value={u}>{UNIT_LABELS[u]}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-black text-white dark:bg-white dark:text-black px-8 py-2 rounded-full font-bold hover:opacity-80 transition-opacity">
            הוסף
          </button>
        </form>
      </section>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="חפש מצרכים..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-none rounded-full outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
          <span className="absolute right-4 top-2.5 text-zinc-400">🔍</span>
        </div>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-none rounded-full outline-none"
        >
          <option value="All">כל הקטגוריות</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>)}
        </select>
      </div>

      {/* Ingredient List grouped by Category */}
      <div className="space-y-12">
        {CATEGORIES.map(category => {
          const catIngredients = filteredIngredients.filter(ing => ing.category === category)
          if (catIngredients.length === 0) return null

          return (
            <section key={category} className="animate-in fade-in duration-500">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                {CATEGORY_LABELS[category]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {catIngredients.map(ing => (
                  <div key={ing.id} className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm group">
                    <div>
                      <h3 className="font-bold text-lg">{ing.name}</h3>
                      <p className="text-sm text-zinc-500">
                        {ing.quantity} {UNIT_LABELS[ing.unit]}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(ing.id, -1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{ing.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(ing.id, 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => deleteIngredient(ing.id)}
                        className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
        {filteredIngredients.length === 0 && !loading && (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 italic">לא נמצאו מצרכים.</p>
          </div>
        )}
      </div>
    </div>
  )
}
