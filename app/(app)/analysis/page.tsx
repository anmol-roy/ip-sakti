'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowRight,
  Mic,
  MicOff,
  Paperclip,
  X,
  Plus,
  Loader2,
  AlertCircle,
  Languages,
  ChevronDown,
  Check
} from 'lucide-react'
import { apiClient, APIError } from '@/lib/api-client'
import { ErrorDisplay } from '@/components/ui/error-display'

const FORMULATION_TYPES = [
  'Ayurveda',
  'Siddha',
  'Unani',
  'Herbal / Traditional',
  'Modern pharmaceutical',
  'Cosmetic',
  'Food / Nutraceutical',
  'Not sure',
]

const LANGUAGES = [
  { code: 'en', name: 'English', speechCode: 'en-US' },
  { code: 'hi', name: 'Hindi', speechCode: 'hi-IN' },
  { code: 'bn', name: 'Bengali', speechCode: 'bn-IN' },
  { code: 'te', name: 'Telugu', speechCode: 'te-IN' },
]

interface FormulationData {
  name: string
  formulationType?: string
  ingredients: string[]
  intendedUse: string
  preparationProcess?: string
  traditionalUse?: string
  attachment?: File
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'
type VoiceState = 'idle' | 'listening' | 'transcribing' | 'error'

export default function AnalysisPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormulationData>({
    name: '',
    formulationType: '',
    ingredients: [],
    intendedUse: '',
    preparationProcess: '',
    traditionalUse: '',
  })
  const [ingredientInput, setIngredientInput] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [activeVoiceField, setActiveVoiceField] = useState<keyof FormulationData | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const [showLanguagePicker, setShowLanguagePicker] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const isRecordingRef = useRef(false)

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSpeechSupported(false)
      setVoiceError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
    }
  }, [])

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return null

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = LANGUAGES.find(l => l.code === selectedLanguage)?.speechCode || 'en-US'

    recognition.onstart = () => {
      setVoiceState('listening')
      isRecordingRef.current = true
      setVoiceError(null)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript && activeVoiceField) {
        setFormData(prev => ({
          ...prev,
          [activeVoiceField]: (prev[activeVoiceField] || '') + ' ' + finalTranscript
        }))
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        setVoiceError('Please allow microphone access when prompted by your browser. Click the microphone button again after allowing access.')
      } else if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Please try speaking louder or closer to the microphone.')
      } else if (event.error === 'audio-capture') {
        setVoiceError('No microphone found. Please connect a microphone and try again.')
      } else if (event.error === 'network') {
        setVoiceError('Network error. Please check your connection.')
      } else {
        setVoiceError(`Error: ${event.error}. Please try again.`)
      }
      setVoiceState('error')
      isRecordingRef.current = false
    }

    recognition.onend = () => {
      if (isRecordingRef.current) {
        try {
          recognition.start()
        } catch (e) {
          setVoiceState('idle')
          isRecordingRef.current = false
        }
      } else {
        setVoiceState('idle')
      }
    }

    return recognition
  }, [selectedLanguage, activeVoiceField])

  const toggleVoiceRecording = useCallback((field: keyof FormulationData) => {
    if (!isSpeechSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (voiceState === 'listening') {
      isRecordingRef.current = false
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
      setVoiceState('idle')
      setActiveVoiceField(null)
      return
    }

    setActiveVoiceField(field)
    setVoiceError(null)

    try {
      recognitionRef.current = initSpeechRecognition()
      if (!recognitionRef.current) {
        setVoiceError('Failed to initialize speech recognition')
        return
      }
      recognitionRef.current.start()
    } catch (error: any) {
      console.error('Error starting speech recognition:', error)
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setVoiceError('Please allow microphone access when prompted by your browser. Click the microphone button again after allowing access.')
      } else if (error.name === 'NotFoundError') {
        setVoiceError('No microphone found. Please connect a microphone and try again.')
      } else {
        setVoiceError('Failed to start voice recording. Please try again.')
      }
      setVoiceState('error')
    }
  }, [voiceState, isSpeechSupported, initSpeechRecognition])

  // Add ingredient
  const addIngredient = useCallback(() => {
    const ingredient = ingredientInput.trim()
    if (!ingredient) return
    if (formData.ingredients.includes(ingredient)) {
      setValidationErrors(prev => ({ ...prev, ingredients: 'Ingredient already added' }))
      return
    }
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient]
    }))
    setIngredientInput('')
    setValidationErrors(prev => ({ ...prev, ingredients: '' }))
  }, [ingredientInput, formData.ingredients])

  // Remove ingredient
  const removeIngredient = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }, [])

  // Handle file attachment
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    
    if (!allowedTypes.includes(file.type)) {
      setValidationErrors(prev => ({ ...prev, attachment: 'Only PDF, DOC, DOCX, or TXT files are allowed' }))
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setValidationErrors(prev => ({ ...prev, attachment: 'File size must be less than 10MB' }))
      return
    }

    setFormData(prev => ({ ...prev, attachment: file }))
    setValidationErrors(prev => ({ ...prev, attachment: '' }))
  }, [])

  // Remove attachment
  const removeAttachment = useCallback(() => {
    setFormData(prev => ({ ...prev, attachment: undefined }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // Validate form
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Formulation name is required'
    }
    
    if (formData.ingredients.length === 0) {
      errors.ingredients = 'At least one ingredient is required'
    }
    
    if (!formData.intendedUse.trim()) {
      errors.intendedUse = 'Intended use is required'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData])

  // Submit form
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return
    
    setSubmitState('submitting')
    
    try {
      // Generate a unique chat ID
      const chatId = Math.random().toString(36).substring(2, 10)
      
      // Store formulation data in sessionStorage for the chat page
      try {
        sessionStorage.setItem(`chat:${chatId}:formulation`, JSON.stringify(formData))
        sessionStorage.setItem(`chat:${chatId}:q`, formData.name)
        sessionStorage.setItem(`chat:${chatId}:type`, 'formulation')
      } catch (e) {
        console.error('Failed to store formulation data:', e)
      }
      
      // Call backend API to validate the formulation can be processed
      const description = `${formData.name}. Ingredients: ${formData.ingredients.join(', ')}. Intended use: ${formData.intendedUse}${formData.preparationProcess ? `. Preparation: ${formData.preparationProcess}` : ''}${formData.traditionalUse ? `. Traditional use: ${formData.traditionalUse}` : ''}`
      
      try {
        await apiClient.analyzeFormulation({ description })
        setApiError(null)
      } catch (error) {
        console.error('Formulation validation error:', error)
        if (error instanceof APIError) {
          setApiError(error.message)
        } else {
          setApiError('Failed to validate formulation. Please try again.')
        }
        setSubmitState('error')
        return
      }
      
      // Redirect to the chat page with the new chat ID
      router.push(`/ask/${chatId}`)
    } catch (error) {
      setSubmitState('error')
      setValidationErrors({ submit: 'Failed to analyze formulation. Please try again.' })
    }
  }, [formData, validateForm, router])

  // Use example data
  const useExample = useCallback(() => {
    setFormData({
      name: 'Neem and turmeric skin balm',
      formulationType: 'Ayurveda',
      ingredients: ['Neem', 'Turmeric'],
      intendedUse: 'Skin care',
      preparationProcess: 'Extract neem leaves and turmeric rhizomes, mix with base oil',
      traditionalUse: 'Traditional Ayurvedic remedy for skin conditions',
    })
  }, [])

  const getLanguageName = (code: string) => {
    const lang = LANGUAGES.find((l) => l.code === code)
    return lang ? lang.name : code
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
    }
  }, [])

  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-background/95 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5">
        <div className="mx-auto max-w-3xl">
          <div className="mb-1.5 flex items-center justify-between gap-2 sm:mb-2">
            <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-muted-foreground sm:text-[10px] sm:tracking-[0.2em] md:text-xs md:tracking-[0.25em]">
              FORMULATION WORKSPACE · INDIA
            </span>
            {/* Language Picker */}
            <div className="relative">
              <button
                type="button"
                aria-label="Select language"
                onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                className="flex items-center gap-1 rounded-full border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-foreground transition-colors hover:bg-muted sm:gap-1.5 sm:px-2 sm:py-1 sm:text-xs"
              >
                <Languages className="size-2 sm:size-2.5" />
                <span className="hidden sm:inline">{getLanguageName(selectedLanguage)}</span>
                <span className="sm:hidden">{selectedLanguage.toUpperCase()}</span>
                <ChevronDown className="size-2 text-muted-foreground sm:size-2.5" />
              </button>
              {showLanguagePicker && (
                <div className="absolute right-0 top-full mt-1 max-h-60 w-36 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg z-50 sm:w-44">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(lang.code)
                        setShowLanguagePicker(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-xs hover:bg-muted sm:px-2 sm:py-1.5 sm:text-sm ${
                        selectedLanguage === lang.code
                          ? 'bg-muted text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <span>{lang.name}</span>
                      {selectedLanguage === lang.code && (
                        <Check className="size-2.5 sm:size-3" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <h1 className="text-lg font-bold text-foreground sm:text-xl md:text-2xl">
            Tell us about your formulation
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm md:text-base">
            Share what you know. Sahayak will organize the evidence and identify what needs a closer look.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4 md:p-6">
            
            {/* Formulation Name */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="formulation-name" className="mb-1 block text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
                Formulation name <span className="text-destructive">*</span>
              </label>
              <Input
                id="formulation-name"
                type="text"
                placeholder="e.g. Neem and turmeric skin balm"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                aria-required="true"
                className="text-xs sm:text-sm"
              />
              {validationErrors.name && (
                <p className="mt-1 text-[10px] text-destructive sm:text-xs">{validationErrors.name}</p>
              )}
            </div>

            {/* Formulation Type */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="formulation-type" className="mb-1 block text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
                Formulation type (optional)
              </label>
              <select
                id="formulation-type"
                value={formData.formulationType}
                onChange={(e) => setFormData(prev => ({ ...prev, formulationType: e.target.value }))}
                className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-3 sm:py-2.5 sm:text-sm"
              >
                <option value="">Select type...</option>
                {FORMULATION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Ingredients */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="ingredient-input" className="mb-1 block text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
                Ingredients <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-1.5 sm:gap-2">
                <Input
                  id="ingredient-input"
                  type="text"
                  placeholder="Type ingredient and press Enter"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addIngredient()
                    }
                  }}
                  aria-label="Add ingredient"
                  className="flex-1 text-xs sm:text-sm"
                />
                <Button
                  type="button"
                  onClick={addIngredient}
                  variant="outline"
                  className="gap-1.5 px-2 sm:gap-2 sm:px-3"
                  size="sm"
                >
                  <Plus className="size-3 sm:size-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </div>

              {/* Ingredient Chips */}
              {formData.ingredients.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-foreground sm:px-2.5 sm:py-1 sm:text-xs"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="flex size-3 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:size-3.5"
                        aria-label={`Remove ${ingredient}`}
                      >
                        <X className="size-2 sm:size-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {validationErrors.ingredients && (
                <p className="mt-1 text-[10px] text-destructive sm:text-xs">{validationErrors.ingredients}</p>
              )}
            </div>

            {/* Intended Use */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="intended-use" className="mb-1 block text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
                Intended use <span className="text-destructive">*</span>
              </label>
              <Input
                id="intended-use"
                type="text"
                placeholder="What is it used for? e.g. skin care, digestion, cosmetic use"
                value={formData.intendedUse}
                onChange={(e) => setFormData(prev => ({ ...prev, intendedUse: e.target.value }))}
                aria-required="true"
                className="text-xs sm:text-sm"
              />
              {validationErrors.intendedUse && (
                <p className="mt-1 text-[10px] text-destructive sm:text-xs">{validationErrors.intendedUse}</p>
              )}
            </div>

            {/* Preparation / Processing Method */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="preparation-process" className="mb-1 block text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
                Preparation / processing method
              </label>
              <div className="relative">
                <Textarea
                  id="preparation-process"
                  placeholder="Describe how it is prepared or processed, such as extraction, heating, fermentation, drying, or mixing."
                  value={formData.preparationProcess}
                  onChange={(e) => setFormData(prev => ({ ...prev, preparationProcess: e.target.value }))}
                  rows={2}
                  className="pr-8 text-xs sm:pr-10 sm:rows-3 sm:text-sm"
                />
                <div className="absolute bottom-2 right-2">
                  <button
                    type="button"
                    onClick={() => toggleVoiceRecording('preparationProcess')}
                    disabled={!isSpeechSupported}
                    className={`flex size-6 items-center justify-center rounded-lg transition-colors hover:bg-muted sm:size-7 ${
                      voiceState === 'listening' && activeVoiceField === 'preparationProcess'
                        ? 'text-red-500 animate-pulse'
                        : 'text-muted-foreground'
                    } ${!isSpeechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Voice input for preparation method"
                  >
                    {voiceState === 'listening' && activeVoiceField === 'preparationProcess' ? (
                      <MicOff className="size-3 sm:size-3.5" />
                    ) : (
                      <Mic className="size-3 sm:size-3.5" />
                    )}
                  </button>
                  {!isSpeechSupported && (
                    <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-background border border-border px-2 py-1 text-[10px] shadow-lg">
                      Use Chrome/Edge/Safari
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Traditional or Community Use */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="traditional-use" className="mb-1 block text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
                Traditional or community use (optional)
              </label>
              <div className="relative">
                <Textarea
                  id="traditional-use"
                  placeholder="Describe any known traditional use, community use, region, textual reference, or documented practice."
                  value={formData.traditionalUse}
                  onChange={(e) => setFormData(prev => ({ ...prev, traditionalUse: e.target.value }))}
                  rows={2}
                  className="pr-8 text-xs sm:pr-10 sm:rows-3 sm:text-sm"
                />
                <div className="absolute bottom-2 right-2">
                  <button
                    type="button"
                    onClick={() => toggleVoiceRecording('traditionalUse')}
                    disabled={!isSpeechSupported}
                    className={`flex size-6 items-center justify-center rounded-lg transition-colors hover:bg-muted sm:size-7 ${
                      voiceState === 'listening' && activeVoiceField === 'traditionalUse'
                        ? 'text-red-500 animate-pulse'
                        : 'text-muted-foreground'
                    } ${!isSpeechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label="Voice input for traditional use"
                  >
                    {voiceState === 'listening' && activeVoiceField === 'traditionalUse' ? (
                      <MicOff className="size-3 sm:size-3.5" />
                    ) : (
                      <Mic className="size-3 sm:size-3.5" />
                    )}
                  </button>
                  {!isSpeechSupported && (
                    <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-background border border-border px-2 py-1 text-[10px] shadow-lg">
                      Use Chrome/Edge/Safari
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-1.5 text-[9px] text-muted-foreground sm:mt-2 sm:text-[10px]">
                Only share information that you are permitted to disclose.
              </p>
            </div>

            {/* Voice Error */}
            {voiceError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive sm:mb-4 sm:px-3 sm:py-2 sm:text-sm">
                <AlertCircle className="size-3 sm:size-4" />
                <span className="text-[10px] sm:text-xs">{voiceError}</span>
                <button
                  type="button"
                  onClick={() => setVoiceError(null)}
                  className="ml-auto text-destructive/70 hover:text-destructive"
                >
                  <X className="size-2.5 sm:size-3" />
                </button>
              </div>
            )}

            {/* API Error */}
            {apiError && (
              <div className="mb-3">
                <ErrorDisplay
                  error={apiError}
                  onDismiss={() => setApiError(null)}
                  showRetry={false}
                />
              </div>
            )}

            {/* Attachment */}
            <div className="mb-3 sm:mb-4">
              <label className="mb-1 block text-xs font-medium text-foreground sm:mb-2 sm:text-sm">
                Attachment (optional)
              </label>
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5 w-full text-xs sm:gap-2 sm:w-auto sm:text-sm"
                  size="sm"
                >
                  <Paperclip className="size-3 sm:size-3.5" />
                  <span>Attach file</span>
                </Button>

                {formData.attachment && (
                  <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
                    <span className="text-[10px] text-foreground truncate sm:text-xs">{formData.attachment.name}</span>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="flex size-3.5 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive sm:size-4"
                      aria-label="Remove attachment"
                    >
                      <X className="size-2 sm:size-2.5" />
                    </button>
                  </div>
                )}
              </div>
              {validationErrors.attachment && (
                <p className="mt-1 text-[10px] text-destructive sm:text-xs">{validationErrors.attachment}</p>
              )}
              <p className="mt-1.5 text-[9px] text-muted-foreground sm:mt-2 sm:text-[10px]">
                Supported formats: PDF, DOC, DOCX, TXT (max 10MB)
              </p>
            </div>

            {/* Privacy Note */}
            <div className="mb-3 rounded-lg bg-muted/30 px-2.5 py-2 sm:mb-4 sm:px-3 sm:py-2.5">
              <p className="text-[9px] text-muted-foreground sm:text-[10px]">
                Privacy-first processing. Avoid sharing confidential information unless necessary.
              </p>
            </div>

            {/* Analyze Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitState === 'submitting'}
              className="w-full gap-2"
              size="lg"
            >
              {submitState === 'submitting' ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span className="hidden sm:inline">Preparing formulation analysis...</span>
                  <span className="sm:hidden">Analyzing...</span>
                </>
              ) : (
                <>
                  Analyze
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>



            {/* Example Section */}
            <div className="mt-4 border-t border-border/40 pt-3 sm:mt-6 sm:pt-4">
              <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground sm:mb-2 sm:text-[10px]">
                Example
              </p>
              <p className="mb-1.5 text-[10px] text-muted-foreground sm:mb-2 sm:text-xs">
                Neem and turmeric based Ayurvedic formulation for skin care
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={useExample}
                className="text-primary text-xs sm:text-sm"
              >
                Use example
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
