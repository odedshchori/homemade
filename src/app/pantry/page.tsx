'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Ingredient, Category, Unit } from '@/types'
import { useRouter } from 'next/navigation'

const CATEGORIES: Category[] = [
  'Fruits', 'Vegetables', 'Legumes', 'Sauces', 'Dairy', 'Meat', 'Grains', 'Spices', 'Other'
]
const UNITS: Unit[] = ['quantity', 'kg', 'g', 'ml', 'l', 'tsp', 'tbsp', 'cup']

export default function PantryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  // New ingredient form state
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<Category>('Vegetables')
  const [newQuantity, setNewQuantity] = useState(0)
  const [newUnit, setNewUnit] = useState<Unit>('quantity')

  const supabase = createClient()
  const router = useRouter()

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
  }, [])

  const fetchIngredients = async (userId: string) => {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) console.error('Error fetching ingredients:', error)
    else setIngredients(data || [])
    setLoading(false)
  }

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

  const deleteIngredient = async (id: string) => {
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id)

    if (error) console.error('Error deleting ingredient:', error)
    else setIngredients(ingredients.filter(ing => ing.id !== id))
  }

  if (loading) return <div className="p-8 text-center">Loading your pantry...</div>

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Pantry</h1>
        <button 
          onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Sign Out
        </button>
      </header>

      {/* Add Ingredient Form */}
      <form onSubmit={addIngredient} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-8 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Ingredient Name</label>
          <input 
            type="text" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700" 
            placeholder="e.g. Tomatoes"
            required
          />
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select 
            value={newCategory} 
            onChange={(e) => setNewCategory(e.target.value as Category)}
            className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium mb-1">Qty</label>
          <input 
            type="number" 
            value={newQuantity} 
            onChange={(e) => setNewQuantity(Number(e.target.value))}
            className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700" 
            step="0.1"
          />
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium mb-1">Unit</label>
          <select 
            value={newUnit} 
            onChange={(e) => setNewUnit(e.target.value as Unit)}
            className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
          >
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-lg font-bold hover:opacity-90">
          Add
        </button>
      </form>

      {/* Ingredient List grouped by Category */}
      <div className="space-y-8">
        {CATEGORIES.map(category => {
          const catIngredients = ingredients.filter(ing => ing.category === category)
          if (catIngredients.length === 0) return null

          return (
            <section key={category}>
              <h2 className="text-xl font-semibold mb-3 border-b pb-1">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catIngredients.map(ing => (
                  <div key={ing.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <div>
                      <span className="font-medium">{ing.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteIngredient(ing.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
        {ingredients.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-12">Your pantry is empty. Start adding some ingredients!</p>
        )}
      </div>
    </div>
  )
}
