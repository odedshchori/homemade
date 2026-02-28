# Track 7 Specification: Gemini Error Handling and Fallback

## Goal
Improve the robustness of the AI-driven recipe generation feature. Specifically, when the GoogleGenerativeAI service is under heavy load (503 error) or fails for other reasons, the system should gracefully fallback to a secondary model or show a clear error state instead of falling back to static mock data.

## Requirements
- **Model Fallback:** If `gemini-3-flash-preview` returns a 503 error, the system must attempt to retry using a more stable model (e.g., `gemini-1.5-flash`).
- **Graceful Error Display:** If both the primary and fallback models fail, or if a non-retryable error occurs, the UI must show a localized (Hebrew) "service unavailable" message.
- **RTL Support:** The error message in the UI must be properly aligned for RTL.
- **Mock Data Elimination:** Remove the logic that automatically returns mock data in the service level on API failure.

## Technical Details
- **Service:** `src/services/recipeService.ts`
- **Component:** `src/app/recipes/page.tsx`
- **Fallback Models:** `gemini-1.5-flash`
- **Error Types:** Specifically handle the `503` status from the `@google/generative-ai` package.
