import { render, screen, fireEvent, act } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import RecipesPage from './page'
import { createClient } from '@/lib/supabase'
import { getSuggestedRecipes } from '@/services/recipeService'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [{ id: '1', name: 'Tomato' }], error: null })),
      })),
    })),
  })),
}))

// Mock Recipe Service
vi.mock('@/services/recipeService', () => ({
  getSuggestedRecipes: vi.fn(() => Promise.resolve({
    recipes: [
      {
        id: '1',
        title: 'סלט עגבניות',
        description: 'סלט פשוט וטעים',
        ingredients: [{ name: 'עגבניה', amount: '2' }],
        instructions: ['לחתוך', 'לתבל'],
      },
    ],
    model: 'test-model',
    status: 'success',
  })),
}))

test('opens modal when clicking instructions button', async () => {
  render(<RecipesPage />)
  
  // Wait for loading to finish and recipes to appear
  const button = await screen.findByText('צפייה בהוראות ההכנה')
  
  // Instructions should not be visible yet
  expect(screen.queryByText(/הוראות הכנה/)).not.toBeInTheDocument()
  
  // Click button
  act(() => {
    fireEvent.click(button)
  })
  
  // Instructions should now be visible
  expect(await screen.findByText(/הוראות הכנה/)).toBeInTheDocument()
  expect(screen.getByText('לחתוך')).toBeInTheDocument()
  expect(screen.getByText('לתבל')).toBeInTheDocument()

  // Click close button
  const closeButton = screen.getByText('סגור')
  act(() => {
    fireEvent.click(closeButton)
  })

  // Modal should be gone
  expect(screen.queryByText(/הוראות הכנה/)).not.toBeInTheDocument()
})
