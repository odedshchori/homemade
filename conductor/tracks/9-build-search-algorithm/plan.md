# Track 9: Search Engine & Ranking Logic

## Goal
Create the backend algorithm or SQL query that powers the "Quick Search" bar, ensuring a 2-click maximum user journey.

## Instructions
"Write the backend search and ranking logic (specify your preferred language, e.g., Python, Node.js, or raw SQL) for a pantry management app. The algorithm must handle partial string matches (e.g., user types 'Cu'). It must rank the output array in this strict order: 1) Items the user has purchased before (checking the User_Pantry table history), 2) High-popularity items from the Global_Items table, and 3) All remaining alphabetical matches. Include basic error handling and query sanitization."

## Tasks
1. [x] Implement the search query/algorithm.
2. [x] Integrate ranking logic based on user history and popularity.
3. [x] Add query sanitization and error handling.

## Verification
- Search returns relevant results for partial strings.
- Results are ranked according to the specified priority.
- Query is safe from basic injection attacks.
