'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      // If auto-confirm is ON, we might already have a session
      if (data.session) {
        router.push('/pantry')
      } else {
        alert('בדקו את המייל שלכם לאישור ההרשמה!')
      }
    }
    setLoading(false)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push('/pantry')
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold text-center">ברוכים הבאים ל-HomeMade</h2>
      <form className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="אימייל"
          className="p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="סיסמה"
          className="p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="flex-1 bg-black text-white dark:bg-white dark:text-black p-2 rounded font-medium hover:opacity-90 disabled:opacity-50"
          >
            התחברות
          </button>
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="flex-1 border border-zinc-300 dark:border-zinc-700 p-2 rounded font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            הרשמה
          </button>
        </div>
      </form>
    </div>
  )
}
