# Track 9: AI Process Debug Info

## Goal
Implement a UI element (window/tooltip/info box) that shows the model being used and the status during and after AI recipe generation.

## Tasks
1. [x] Create a new branch `track-9-ai-debug-info`. [3743ca6]
2. [x] Update `src/services/recipeService.ts` to return model information along with the recipes. [a7473d7] (likely by wrapping the response).
3. [ ] Add state in `src/app/recipes/page.tsx` to track:
   - Current model name being queried.
   - Status (e.g., "Attempting Primary Model", "Falling back to Secondary Model", "Success").
   - Total time taken (optional).
4. [ ] Design and implement a subtle "Debug Info" UI component (e.g., a floating badge or a small fixed box at the bottom).
5. [ ] Ensure the debug info is only visible during development or by user preference (optional: keep simple for now).
6. [ ] Show the final model used after a successful generation.

## Verification
- A UI element is visible while recipes are being fetched.
- It displays the model name currently being used.
- It updates when falling back from `gemini-3-flash-preview` to `gemini-1.5-flash-latest`.
- It remains visible after success to show which model provided the final recipes.
