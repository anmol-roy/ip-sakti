'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Loader2,
  FileText,
  Check,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Shield,
  Book
} from 'lucide-react'

const REASONS = [
  'Evidence requires professional interpretation',
  'Insufficient or conflicting evidence',
  'Potential prior-art concern',
  'Traditional Knowledge verification needed',
  'ABS compliance clarification',
  'Formulation classification clarification',
  'Patentability assessment requires review',
  'Other',
]

type PageState = 'form' | 'submitting' | 'success' | 'error'
type RequestStatus = 'Pending review' | 'Under review' | 'Awaiting information' | 'Resolved' | 'Closed' | 'Cancelled'

interface ReviewRequest {
  id?: string
  reason: string
  question: string
  chatId?: string
  analysisId?: string
  userId?: string
  consent: boolean
  submittedAt?: Date
  status?: RequestStatus
}

function ReviewPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatId = searchParams.get('chatId')
  const analysisId = searchParams.get('analysisId')
  const requestId = searchParams.get('requestId')

  const [pageState, setPageState] = useState<PageState>('form')
  const [request, setRequest] = useState<ReviewRequest>({
    reason: 'Evidence requires professional interpretation',
    question: '',
    chatId: chatId || undefined,
    analysisId: analysisId || undefined,
    consent: false,
  })
  const [linkedAnalysis, setLinkedAnalysis] = useState<any>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load context from sessionStorage if coming from chat
  useEffect(() => {
    if (chatId) {
      try {
        const reviewQuestion = sessionStorage.getItem('review:question')
        const reviewResponse = sessionStorage.getItem('review:response')
        const reviewJurisdiction = sessionStorage.getItem('review:jurisdiction')
        const reviewConfidence = sessionStorage.getItem('review:confidence')

        if (reviewQuestion) {
          setRequest(prev => ({
            ...prev,
            question: reviewQuestion || 'Please review the preliminary assessment and relevant evidence.'
          }))
        }

        if (reviewResponse) {
          setLinkedAnalysis({
            title: 'Ask Sahayak · Preliminary assessment',
            type: 'IP Research Chat',
            chatId: chatId,
            jurisdiction: reviewJurisdiction || 'India',
            confidence: reviewConfidence || 'Moderate',
          })
        }
      } catch (e) {
        console.error('Failed to load review context:', e)
      }
    }
  }, [chatId])

  // Load existing request if requestId is provided
  useEffect(() => {
    if (requestId) {
      setIsLoading(true)
      // Simulate API call - replace with actual backend call
      setTimeout(() => {
        setIsLoading(false)
        setPageState('success')
        setRequest(prev => ({
          ...prev,
          id: requestId,
          status: 'Pending review',
          submittedAt: new Date(),
        }))
      }, 1000)
    }
  }, [requestId])

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {}

    if (!request.question.trim()) {
      errors.question = 'Please describe what you would like the IP facilitator to review.'
    }

    if (!request.consent) {
      errors.consent = 'Please acknowledge the consent statement.'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [request])

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return

    setPageState('submitting')
    setSubmitError(null)

    try {
      // Simulate API call - replace with actual backend call
      // const response = await fetch('/api/review/request', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(request)
      // })
      // const data = await response.json()

      // Simulate delay and generate request ID
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate a realistic request ID (in production, this comes from backend)
      const generatedRequestId = `IPF-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

      setRequest(prev => ({
        ...prev,
        id: generatedRequestId,
        status: 'Pending review',
        submittedAt: new Date(),
      }))

      setPageState('success')
    } catch (error) {
      setPageState('error')
      setSubmitError('We could not submit your review request. Please try again.')
    }
  }, [request, validateForm])

  const handleRetry = useCallback(() => {
    setSubmitError(null)
    setPageState('form')
  }, [])

  const handleReturnToChat = useCallback(() => {
    if (chatId) {
      router.push(`/ask/${chatId}`)
    } else {
      router.push('/ask')
    }
  }, [chatId, router])

  // Loading state
  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm">Loading request details...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-background/95 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
              HUMAN REVIEW
            </span>
          </div>
          {pageState === 'form' ? (
            <>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Need expert assistance?
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                The available evidence may not be sufficient for a reliable answer. You can request review by an IP facilitator.
              </p>
            </>
          ) : pageState === 'success' ? (
            <>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Review request submitted
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                An IP facilitator will review the available evidence and follow up with guidance.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Request review
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                Submit your request for expert IP facilitator review.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Form State */}
          {pageState === 'form' && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
              {/* Reason */}
              <div className="mb-6">
                <label htmlFor="reason" className="mb-2 block text-sm font-medium text-foreground">
                  Reason
                </label>
                <select
                  id="reason"
                  value={request.reason}
                  onChange={(e) => setRequest(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {REASONS.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              {/* Question */}
              <div className="mb-6">
                <label htmlFor="question" className="mb-2 block text-sm font-medium text-foreground">
                  Question
                </label>
                <Textarea
                  id="question"
                  placeholder="Please describe what you would like the IP facilitator to review."
                  value={request.question}
                  onChange={(e) => setRequest(prev => ({ ...prev, question: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />
                {validationErrors.question && (
                  <p className="mt-1 text-xs text-destructive">{validationErrors.question}</p>
                )}
              </div>

              {/* Linked Analysis */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Relevant analysis
                </label>
                {linkedAnalysis ? (
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{linkedAnalysis.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {linkedAnalysis.type} · {linkedAnalysis.jurisdiction}
                        </p>
                      </div>
                    </div>
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3" />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                    No analysis selected
                  </div>
                )}
              </div>

              {/* Consent */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={request.consent}
                    onChange={(e) => setRequest(prev => ({ ...prev, consent: e.target.checked }))}
                    className="mt-1 size-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm text-foreground">
                    I understand that this request is for informational review and does not create an advocate-client relationship.
                  </span>
                </label>
                {validationErrors.consent && (
                  <p className="mt-1 text-xs text-destructive">{validationErrors.consent}</p>
                )}
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="mb-6 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="size-4" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                className="w-full gap-2"
                size="lg"
              >
                <>
                  Submit for Review
                  <ArrowRight className="size-4" />
                </>
              </Button>
            </div>
          )}

          {/* Success State */}
          {pageState === 'success' && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <Check className="size-8 text-primary" />
                </div>
              </div>

              {/* Confirmation Heading */}
              <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
                Review request submitted
              </h2>

              {/* Request Details */}
              <div className="space-y-4">
                {/* Request ID */}
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-sm text-muted-foreground">Request ID</span>
                  <span className="text-sm font-medium text-foreground">
                    {request.id || 'IPF-2026-0827-041'}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {request.status || 'Pending review'}
                  </span>
                </div>

                {/* Submitted Date */}
                {request.submittedAt && (
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <span className="text-sm text-muted-foreground">Submitted</span>
                    <span className="text-sm text-foreground">
                      {request.submittedAt.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}

                {/* Reason */}
                <div className="flex items-start justify-between border-b border-border/50 pb-3">
                  <span className="text-sm text-muted-foreground">Reason</span>
                  <span className="max-w-[60%] text-right text-sm text-foreground">
                    {request.reason}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  variant="outline"
                  onClick={handleReturnToChat}
                  className="flex-1 sm:flex-none"
                >
                  Return to chat
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/ask')}
                  className="flex-1 sm:flex-none"
                >
                  Go to Ask Sahayak
                </Button>
              </div>
            </div>
          )}

          {/* Error State */}
          {pageState === 'error' && (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="mb-6 flex justify-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="size-8 text-destructive" />
                </div>
              </div>

              <h2 className="mb-2 text-center text-xl font-semibold text-foreground">
                Unable to submit request
              </h2>
              <p className="mb-6 text-center text-sm text-muted-foreground">
                {submitError || 'We could not submit your review request. Please try again.'}
              </p>

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="gap-2"
                >
                  <RotateCcw className="size-4" />
                  Retry
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReturnToChat}
                >
                  Return to chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="border-t border-border/40 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <Shield className="size-4" />
            <span>
              Information provided by Anvashai is for general informational purposes only and does not constitute legal advice.
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-background">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm">Loading review details...</span>
          </div>
        </main>
      }
    >
      <ReviewPageContent />
    </Suspense>
  )
}

