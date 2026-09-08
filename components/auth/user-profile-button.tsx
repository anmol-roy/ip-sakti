'use client'

import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { LogIn } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/components/providers/i18n-provider'

export function UserProfileButton() {
  const { t } = useI18n()
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return (
      <div
        aria-hidden="true"
        className="size-8 animate-pulse rounded-full bg-muted"
      />
    )
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button variant="outline" size="sm" aria-label={t('header.signIn')}>
          <LogIn className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t('header.signIn')}</span>
        </Button>
      </SignInButton>
    )
  }

  return <UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
}
