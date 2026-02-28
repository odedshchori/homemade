# Track 5: Hebrew Localization (RTL)

## Goal
Make the entire application accessible in Hebrew, including RTL layout and AI-generated recipes in Hebrew.

## Tasks
1. [ ] Create a new branch `track-5-localization`.
2. [ ] Update `src/app/layout.tsx` to include `dir="rtl"` and `lang="he"`.
3. [ ] Translate all UI text (buttons, labels, headings) in:
   - Login page.
   - Pantry page (search, categories, units).
   - Recipes page.
4. [ ] Update `recipeService.ts` to request Hebrew recipes from Gemini.
5. [ ] Refine Tailwind spacing/layout for RTL consistency.

## Verification
- Layout is correctly aligned from right to left.
- All text is clearly translated and readable.
- AI suggests recipes in fluent Hebrew.
