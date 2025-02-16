'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    CredentialsSignin: 'Invalid email or password',
    Default: 'Something went wrong',
  }

  const errorMessage = errorMessages[error as string] || errorMessages.Default

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-red-50 p-8 text-center">
        <h1 className="text-xl font-semibold text-red-800">Authentication Error</h1>
        <p className="mt-2 text-red-600">{errorMessage}</p>
        <a
          href="/signin"
          className="mt-4 inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Back to Sign In
        </a>
      </div>
    </div>
  )
} 