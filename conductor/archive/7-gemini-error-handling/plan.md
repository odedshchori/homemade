# Track 7: Gemini Error Handling and Fallback

## Goal
Improve the reliability of AI recipe generation by implementing a fallback mechanism for 503 errors and providing a clear "service unavailable" message instead of mock data.

## Tasks
1. [x] Create a new branch `track-7-gemini-error-handling`.
2. [x] Update `src/services/recipeService.ts` to implement fallback logic.
    - Specifically handle 503 (Service Unavailable) errors.
    - Fallback from `gemini-3-flash-preview` to `gemini-1.5-flash`.
    - Throw a specific error when all models fail or are unavailable.
3. [x] Update the `src/app/recipes/page.tsx` (or relevant component) to handle the "unavailable" state.
    - Remove the automatic return of mock data in the service.
    - Display a Hebrew localized message: "השירות אינו זמין כרגע, אנא נסו שוב מאוחר יותר."
4. [x] Verify the fallback mechanism by temporarily forcing a failure in the primary model call.
5. [x] Stage, commit, and push this branch once complete.

## Verification
- 503 errors trigger a call to the fallback model.
- If all models fail, the UI shows a clear "unavailable" message.
- No more confusing mock data is shown when the API fails.
- Linting passed and unrelated errors in `pantry/page.tsx` were also fixed.
