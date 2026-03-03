# Track 8: Recipe Instructions Display

## Goal
Implement the display of preparation instructions for recipes, which is currently non-functional.

## Tasks
0. [x] Set up Vitest testing framework.
1. [x] Create a new branch `track-8-recipe-instructions`.
2. [x] Choose a UI pattern for showing instructions (e.g., a Modal or an expandable section in the recipe card). (Chosen: Modal)
3. [x] Implement state management in `src/app/recipes/page.tsx` to handle showing/hiding instructions.
4. [x] Render the `instructions` array from the `Recipe` object.
5. [x] Ensure the UI is Hebrew localized and follows RTL conventions.
6. [x] Add a "Close" or "Back" button to return to the recipe list if using a modal.

## Verification
- Clicking "צפייה בהוראות ההכנה" opens the instructions.
- All instruction steps are displayed correctly in Hebrew.
- The UI remains responsive and follows RTL layout.
