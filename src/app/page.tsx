export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          HomeMade
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg">
          Manage your kitchen ingredients, reduce waste, and discover delicious recipes with what you have.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <a
            href="/login"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Go to Pantry
          </a>
          <a
            href="/recipes"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            View Recipes
          </a>
        </div>
      </main>
      <footer className="mt-16 text-sm text-gray-500">
        Your collaborative kitchen companion.
      </footer>
    </div>
  );
}
