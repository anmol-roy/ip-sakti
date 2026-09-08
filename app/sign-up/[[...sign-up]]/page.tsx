'use client'

import { SignUp } from '@clerk/nextjs'

import { AuthScreen } from '@/components/auth/auth-screen'

export default function SignUpPage() {
  return (
    <AuthScreen titleKey="auth.signUpTitle" subtitleKey="auth.signUpSubtitle">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
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
