'use client'

import { SignIn } from '@clerk/nextjs'

import { AuthScreen } from '@/components/auth/auth-screen'

export default function SignInPage() {
  return (
    <AuthScreen titleKey="auth.signInTitle" subtitleKey="auth.signInSubtitle">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: 'w-full flex justify-center',
            cardBox: 'shadow-sm',
          },
        }}
      />
    </AuthScreen>
  )
}
