# Track 4: AI Recipe Integration

## Goal
Replace the mock recipe service with real AI-generated suggestions based on the user's pantry.

## Tasks
1. [x] Create a new branch `track-4-ai-recipes`.
2. [x] Research and select the best prompt for Gemini to generate recipe suggestions in JSON format.
3. [x] Implement the Gemini API call in `src/services/recipeService.ts`.
4. [x] Add `NEXT_PUBLIC_GEMINI_API_KEY` to `.env.local`.
5. [x] Update the UI to handle the AI response and show better loading/error states.
6. [x] Stage, commit, and push this branch once complete.

## Verification
- Recipes are dynamically generated based on current ingredients.
- The response is correctly parsed and displayed in the UI.
- Errors (like a missing API key) are handled gracefully.
