'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Paperclip,
  Mic,
  MapPin,
  ArrowUp,
  FileSearch,
  Leaf,
  Scale,
  ChevronDown,
  ArrowRight,
  X,
  FileText,
  Check,
  Loader2,
  MicOff,
  Languages,
  AlertCircle,
} from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'

const MAX_CHARS = 2000
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

const SUGGESTIONS = [
  {
    key: 'suggestion1',
    Icon: FileSearch,
    color: 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30',
    iconBg: 'bg-primary/10 dark:bg-primary/20 text-primary',
  },
  {
    key: 'suggestion2',
    Icon: Leaf,
    color: 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30',
    iconBg: 'bg-primary/10 dark:bg-primary/20 text-primary',
  },
  {
    key: 'suggestion3',
    Icon: Scale,
    color: 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30',
    iconBg: 'bg-primary/10 dark:bg-primary/20 text-primary',
  },
] as const

const JURISDICTIONS = [
  { value: 'india', label: 'India' },
  { value: 'international', label: 'International' },
  { value: 'compare', label: 'Compare' },
]

const LANGUAGES = [
  { code: 'en', name: 'English', speechCode: 'en-US' },
  { code: 'hi', name: 'Hindi', speechCode: 'hi-IN' },
  { code: 'bn', name: 'Bengali', speechCode: 'bn-IN' },
  { code: 'te', name: 'Telugu', speechCode: 'te-IN' },
  { code: 'mr', name: 'Marathi', speechCode: 'mr-IN' },
  { code: 'ta', name: 'Tamil', speechCode: 'ta-IN' },
  { code: 'ur', name: 'Urdu', speechCode: 'ur-IN' },
  { code: 'gu', name: 'Gujarati', speechCode: 'gu-IN' },
  { code: 'kn', name: 'Kannada', speechCode: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', speechCode: 'ml-IN' },
]

interface FileAttachment {
  id: string
  file: File
  name: string
  size: number
  type: string
  progress?: number
  status: 'uploading' | 'uploaded' | 'error'
  error?: string
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function AskPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showLanguagePicker, setShowLanguagePicker] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [showJurisdictionDropdown, setShowJurisdictionDropdown] =
    useState(false)
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('india')
  const [isProcessingFile, setIsProcessingFile] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isRecordingRef = useRef(false)

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSpeechSupported(false)
      setMicError('Speech recognition is not supported in this browser')
    }
  }, [])

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSpeechSupported(false)
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = LANGUAGES.find(l => l.code === selectedLanguage)?.speechCode || 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsRecording(true)
      isRecordingRef.current = true
      setMicError(null)
      setRecordingTime(0)
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setQuestion((prev) => {
          const newText = prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript
          return newText.slice(0, MAX_CHARS)
        })
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      
      if (event.error === 'not-allowed') {
        setMicError('Microphone access denied. Please allow microphone access in your browser settings.')
      } else if (event.error === 'no-speech') {
        setMicError('No speech detected. Please try again.')
      } else if (event.error === 'audio-capture') {
        setMicError('No microphone found. Please connect a microphone.')
      } else if (event.error === 'network') {
        setMicError('Network error. Please check your connection.')
      } else {
        setMicError(`Error: ${event.error}`)
      }
      
      setIsRecording(false)
      isRecordingRef.current = false
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
    }

    recognition.onend = () => {
      if (isRecordingRef.current) {
        // If we're still supposed to be recording, restart
        try {
          recognition.start()
        } catch (e) {
          console.error('Failed to restart recognition:', e)
          setIsRecording(false)
          isRecordingRef.current = false
        }
      } else {
        setIsRecording(false)
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current)
          recordingTimerRef.current = null
        }
      }
    }

    return recognition
  }, [selectedLanguage])

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (!isSpeechSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (isRecording) {
      // Stop recording
      isRecordingRef.current = false
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error('Error stopping recognition:', e)
        }
      }
      setIsRecording(false)
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
      return
    }

    // Start recording — let SpeechRecognition request mic permission natively
    try {
      recognitionRef.current = initSpeechRecognition()
      if (!recognitionRef.current) {
        setMicError('Failed to initialize speech recognition')
        return
      }
      setMicError(null)
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      setMicError('Failed to start voice recording. Please try again.')
      setIsRecording(false)
      isRecordingRef.current = false
    }
  }, [isRecording, isSpeechSupported, initSpeechRecognition])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      if (!files) return

      const validFiles = Array.from(files).filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          alert(`${file.name} is too large. Maximum size is 10MB.`)
          return false
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          alert(
            `${file.name} is not supported. Please upload PDF, DOC, DOCX, or TXT files.`
          )
          return false
        }
        return true
      })

      if (validFiles.length === 0) return

      const newAttachments = validFiles.map((file) => ({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading' as const,
        progress: 0,
      }))

      setAttachments((prev) => [...prev, ...newAttachments])

      // Simulate upload progress
      newAttachments.forEach((attachment) => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 15
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            setAttachments((prev) =>
              prev.map((a) =>
                a.id === attachment.id
                  ? { ...a, status: 'uploaded' as const, progress: 100 }
                  : a
              )
            )
          } else {
            setAttachments((prev) =>
              prev.map((a) =>
                a.id === attachment.id ? { ...a, progress: Math.min(progress, 99) } : a
              )
            )
          }
        }, 200)
      })
    },
    []
  )

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const handleSubmit = useCallback(() => {
    const q = question.trim()
    if (!q || submitting) return
    setSubmitting(true)
    const chatId = generateId()
    try {
      sessionStorage.setItem(`chat:${chatId}:q`, q)
      if (attachments.length > 0) {
        sessionStorage.setItem(
          `chat:${chatId}:attachments`,
          JSON.stringify(attachments.map((a) => ({ name: a.name, size: a.size, type: a.type })))
        )
      }
      sessionStorage.setItem(`chat:${chatId}:jurisdiction`, selectedJurisdiction)
    } catch {}
    router.push(`/ask/${chatId}`)
  }, [question, submitting, router, attachments, selectedJurisdiction])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const fillSuggestion = (text: string) => {
    setQuestion(text)
    textareaRef.current?.focus()
  }

  const remaining = MAX_CHARS - question.length
  const canSubmit = question.trim().length > 0 && question.length <= MAX_CHARS

  const getLanguageName = (code: string) => {
    const lang = LANGUAGES.find((l) => l.code === code)
    return lang ? lang.name : code
  }

  return (
    <main className="relative flex min-h-[calc(100vh-56px)] w-full flex-col overflow-hidden bg-background">
      {/* ── BG IMAGES ──────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 select-none">
        <div className="absolute bottom-0 left-0 h-[420px] w-[300px] opacity-[0.18] dark:opacity-[0.08]">
          <Image
            src="/image/ask/ask_bg.png"
            alt=""
            fill
            sizes="300px"
            className="object-cover object-[15%_bottom]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background" />
        </div>
        <div className="absolute bottom-0 right-0 h-[480px] w-[340px] opacity-[0.15] dark:opacity-[0.07]">
          <Image
            src="/image/ask/ask_bg.png"
            alt=""
            fill
            sizes="340px"
            className="object-cover object-[85%_bottom]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background" />
        </div>
      </div>

      {/* ── CONTENT ────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 md:px-6 md:py-16">
        {/* heading */}
        <div className="mb-10 text-center">
          <div aria-hidden className="mx-auto mb-5 h-1 w-10 rounded-full bg-primary" />
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('home.ask.heading')}
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('home.ask.subheading')}
          </p>
        </div>

        {/* input card */}
        <div className="mb-8 rounded-2xl border border-border bg-card shadow-lg shadow-primary/5">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder={t('home.ask.placeholder')}
            rows={4}
            className="w-full resize-none rounded-t-2xl bg-transparent px-5 pt-5 pb-2 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            aria-label={t('home.ask.placeholder')}
          />

          {/* Error message */}
          {micError && (
            <div className="mx-4 mt-1 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4" />
              <span>{micError}</span>
              <button
                type="button"
                onClick={() => setMicError(null)}
                className="ml-auto text-destructive/70 hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm"
                >
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="max-w-[120px] truncate text-foreground">
                    {attachment.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({formatFileSize(attachment.size)})
                  </span>
                  {attachment.status === 'uploading' && (
                    <Loader2 className="size-3 animate-spin text-primary" />
                  )}
                  {attachment.status === 'uploaded' && (
                    <Check className="size-3 text-emerald-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachment(attachment.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* toolbar */}
          <div className="flex items-center justify-between px-4 pb-4 pt-1">
            <div className="flex items-center gap-1">
              {/* attach */}
              <button
                type="button"
                aria-label={t('home.ask.attachLabel')}
                className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingFile}
              >
                <Paperclip className="size-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={isProcessingFile}
              />

              {/* mic with voice controls */}
              <div className="relative">
                <button
                  type="button"
                  aria-label={t('home.ask.micLabel')}
                  onClick={toggleRecording}
                  disabled={!isSpeechSupported}
                  className={`flex size-9 items-center justify-center rounded-xl transition-colors hover:bg-muted hover:text-foreground ${
                    isRecording
                      ? 'text-red-500 hover:text-red-600 animate-pulse'
                      : 'text-muted-foreground'
                  } ${!isSpeechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Mic className="size-4" />
                </button>
                {isRecording && (
                  <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-background border border-border px-3 py-1.5 text-xs shadow-lg flex items-center gap-3">
                    <span className="text-red-500 font-mono">
                      {formatTime(recordingTime)}
                    </span>
                    <span className="text-muted-foreground">Recording...</span>
                  </div>
                )}
              </div>

              {/* language picker */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Select language"
                  onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Languages className="size-3" />
                  {getLanguageName(selectedLanguage)}
                  <ChevronDown className="size-3 text-muted-foreground" />
                </button>
                {showLanguagePicker && (
                  <div className="absolute left-0 top-full mt-1 max-h-60 w-48 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(lang.code)
                          setShowLanguagePicker(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted ${
                          selectedLanguage === lang.code
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <span>{lang.name}</span>
                        {selectedLanguage === lang.code && (
                          <Check className="size-3" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* jurisdiction dropdown */}
              <div className="relative">
                <button
                  type="button"
                  aria-label={t('home.ask.jurisdictionLabel')}
                  onClick={() =>
                    setShowJurisdictionDropdown(!showJurisdictionDropdown)
                  }
                  className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <MapPin className="size-3 text-primary" />
                  {JURISDICTIONS.find((j) => j.value === selectedJurisdiction)
                    ?.label || 'India'}
                  <ChevronDown className="size-3 text-muted-foreground" />
                </button>
                {showJurisdictionDropdown && (
                  <div className="absolute left-0 top-full mt-1 w-40 rounded-lg border border-border bg-popover p-1 shadow-lg z-50">
                    {JURISDICTIONS.map((j) => (
                      <button
                        key={j.value}
                        type="button"
                        onClick={() => {
                          setSelectedJurisdiction(j.value)
                          setShowJurisdictionDropdown(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted ${
                          selectedJurisdiction === j.value
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <span>{j.label}</span>
                        {selectedJurisdiction === j.value && (
                          <Check className="size-3" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs tabular-nums ${
                  remaining < 100 ? 'text-destructive' : 'text-muted-foreground'
                }`}
              >
                {question.length}/{MAX_CHARS}
              </span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                aria-label={t('home.ask.submitLabel')}
                className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <ArrowUp className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* suggestions */}
        <div className="mb-auto">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t('home.ask.tryAsking')}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {SUGGESTIONS.map(({ key, Icon, color, iconBg }) => (
              <button
                key={key}
                type="button"
                onClick={() => fillSuggestion(t(`home.ask.${key}`))}
                className={`group flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${color}`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <p className="flex-1 text-xs leading-relaxed text-foreground">
                  {t(`home.ask.${key}`)}
                </p>
                <ArrowRight
                  className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </div>

        {/* footer tagline */}
        <p className="mt-12 text-center text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground/60">
          {t('home.ask.footerKnowledge')}
          <span className="mx-3">|</span>
          {t('home.ask.footerInnovation')}
          <span className="mx-3">|</span>
          {t('home.ask.footerStatement')}
        </p>
      </div>
    </main>
  )
}