import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">
      <h2 className="text-3xl font-bold text-red-500 mb-4">Authentication Error</h2>
      <p className="text-zinc-400 mb-8">
        We couldn't verify your session. This might be due to an expired link or network issue.
      </p>
      <Link href="/login" className="text-orange-500 underline underline-offset-4">
        Back to Login
      </Link>
    </div>
  );
}