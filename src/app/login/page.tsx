import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-24 bg-zinc-50 dark:bg-black">
      <AuthForm />
    </div>
  )
}
