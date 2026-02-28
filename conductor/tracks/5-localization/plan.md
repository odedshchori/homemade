# Track 5: Hebrew Localization (RTL)

## Goal
Make the entire application accessible in Hebrew, including RTL layout and AI-generated recipes in Hebrew.

## Tasks
1. [x] Create a new branch `track-5-localization`.
2. [x] Update `src/app/layout.tsx` to include `dir="rtl"` and `lang="he"`.
3. [x] Translate all UI text (buttons, labels, headings) in:
   - Login page.
   - Pantry page (search, categories, units).
   - Recipes page.
4. [x] Update `recipeService.ts` to request Hebrew recipes from Gemini.
5. [x] Refine Tailwind spacing/layout for RTL consistency.

## Verification
- Layout is correctly aligned from right to left.
- All text is clearly translated and readable.
- AI suggests recipes in fluent Hebrew.
