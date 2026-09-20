'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  BookOpen, 
  ExternalLink,
  Play,
  Pause,
  Square,
  Copy,
  Check,
  UserCheck,
  Paperclip,
  Mic,
  MicOff,
  Send,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useI18n } from '@/components/providers/i18n-provider'
import { Button } from '@/components/ui/button'
import { ErrorDisplay } from '@/components/ui/error-display'
import { apiClient, APIError, AskResponse, FormulationAnalysisResponse } from '@/lib/api-client'

const MAX_CHARS = 2000
const LANGUAGES = [
  { code: 'en', name: 'English', speechCode: 'en-US' },
  { code: 'hi', name: 'Hindi', speechCode: 'hi-IN' },
  { code: 'bn', name: 'Bengali', speechCode: 'bn-IN' },
  { code: 'te', name: 'Telugu', speechCode: 'te-IN' },
  { code: 'mr', name: 'Marathi', speechCode: 'mr-IN' },
  { code: 'ta', name: 'Tamil', speechCode: 'ta-IN' },
]

interface EvidenceItem {
  id: string
  title: string
  subtitle: string
  type: string
  jurisdiction: string
  url: string
}

interface PriorArtItem {
  id: string
  title: string
  patentNumber?: string
  publicationDate?: string
  jurisdiction: string
  similarity?: number
  matchingFeatures?: string[]
  url: string
}

interface LegalProvision {
  id: string
  title: string
  section: string
  explanation: string
  url: string
}

interface AIResponse {
  preliminaryFinding: string
  explanation: string
  relevantAreas: string[]
  evidence: EvidenceItem[]
  confidence: 'High' | 'Moderate' | 'Low' | 'Insufficient'
  // Formulation analysis fields
  formulationClassification?: {
    classification: string
    confidence: string
    detectedType?: string
    reason?: string
  }
  biologicalResources?: string[]
  traditionalKnowledgeIndicators?: string
  absRelevance?: {
    status: string
    reason: string
    legalSource?: string
    evidenceLink?: string
  }
  priorArt?: PriorArtItem[]
  legalProvisions?: LegalProvision[]
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  response?: AIResponse
  createdAt: Date
}

type LoadingState = 'idle' | 'loading' | 'error' | 'insufficient'
type ListenState = 'idle' | 'playing' | 'paused'
type VoiceState = 'idle' | 'listening' | 'transcribing' | 'error'

// Utility function for relative timestamps
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  // Format as date for older messages
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatExactTime(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function ChatPage() {
  const { t } = useI18n()
  const router = useRouter()
  const params = useParams<{ chatId: string }>()
  const chatId = params?.chatId ?? ''
  
  const [messages, setMessages] = useState<Message[]>([])
  const [followUp, setFollowUp] = useState('')
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [listenState, setListenState] = useState<ListenState>('idle')
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [responseCopied, setResponseCopied] = useState(false)
  const [copiedEvidenceId, setCopiedEvidenceId] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [formulationData, setFormulationData] = useState<any>(null)
  const [isFormulationAnalysis, setIsFormulationAnalysis] = useState(false)
  const [showFormulationDetails, setShowFormulationDetails] = useState(false)
  const [chatTitle, setChatTitle] = useState('IP Research Chat')
  const [apiError, setApiError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const isRecordingRef = useRef(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  
  // Map backend AskResponse to frontend AIResponse format
  const mapAskResponseToAIResponse = (backendResponse: AskResponse): AIResponse => {
    const evidence: EvidenceItem[] = backendResponse.citations.map((citation, idx) => ({
      id: `citation-${idx}`,
      title: citation.document,
      subtitle: `${citation.source}${citation.section ? ` · ${citation.section}` : ''}`,
      type: 'Legal Source',
      jurisdiction: 'India',
      url: `/sources/${citation.chunk_id}`
    }))

    const confidenceMap: Record<string, 'High' | 'Moderate' | 'Low' | 'Insufficient'> = {
      'high': 'High',
      'medium': 'Moderate',
      'low': 'Low',
    }

    return {
      preliminaryFinding: backendResponse.primary_ip || 'No specific IP type detected',
      explanation: backendResponse.answer,
      relevantAreas: backendResponse.ip_types,
      evidence,
      confidence: confidenceMap[backendResponse.confidence] || 'Moderate',
      formulationClassification: backendResponse.formulation ? {
        classification: backendResponse.formulation.formulation_type,
        confidence: `${Math.round(backendResponse.formulation.confidence * 100)}%`,
        detectedType: backendResponse.formulation.formulation_type,
        reason: backendResponse.formulation.notes
      } : undefined,
      biologicalResources: backendResponse.formulation?.biological_resources,
      traditionalKnowledgeIndicators: backendResponse.formulation?.traditional_knowledge_indicators.length 
        ? `Detected indicators: ${backendResponse.formulation.traditional_knowledge_indicators.join(', ')}`
        : undefined
    }
  }

  // Map backend FormulationAnalysisResponse to frontend AIResponse format
  const mapFormulationResponseToAIResponse = (backendResponse: FormulationAnalysisResponse): AIResponse => {
    const evidence: EvidenceItem[] = [
      ...backendResponse.legal_provisions.map((provision, idx) => ({
        id: `legal-${idx}`,
        title: provision.document,
        subtitle: `${provision.source}${provision.section ? ` · ${provision.section}` : ''}`,
        type: 'Legal Source',
        jurisdiction: 'India',
        url: `/sources/${provision.chunk_id}`
      })),
      ...backendResponse.tk_results.matches.map((match, idx) => ({
        id: `tk-${idx}`,
        title: match.title,
        subtitle: `${match.source} · Score: ${match.score.toFixed(2)}`,
        type: 'Traditional Knowledge',
        jurisdiction: 'India',
        url: `/sources/tk-${idx}`
      }))
    ]

    const priorArt: PriorArtItem[] = backendResponse.patent_results.map((patent, idx) => ({
      id: `patent-${idx}`,
      title: patent.title,
      patentNumber: patent.publication_number,
      jurisdiction: 'India',
      similarity: Math.round(patent.similarity_score * 100),
      matchingFeatures: patent.matched_components,
      url: `/sources/patent-${idx}`
    }))

    const legalProvisions: LegalProvision[] = backendResponse.legal_provisions.map((provision, idx) => ({
      id: `legal-prov-${idx}`,
      title: provision.document,
      section: provision.section || 'N/A',
      explanation: 'Relevant provision for this formulation',
      url: `/sources/${provision.chunk_id}`
    }))

    const confidenceMap: Record<string, 'High' | 'Moderate' | 'Low' | 'Insufficient'> = {
      'high': 'High',
      'medium': 'Moderate',
      'low': 'Low',
    }

    return {
      preliminaryFinding: backendResponse.classification.formulation_type,
      explanation: backendResponse.report,
      relevantAreas: ['Patent', 'Traditional Knowledge', 'Formulation', 'India'],
      evidence,
      confidence: confidenceMap[backendResponse.confidence] || 'Moderate',
      formulationClassification: {
        classification: backendResponse.classification.formulation_type,
        confidence: `${Math.round(backendResponse.classification.confidence * 100)}%`,
        detectedType: backendResponse.classification.formulation_type,
        reason: backendResponse.classification.notes
      },
      biologicalResources: backendResponse.classification.biological_resources,
      traditionalKnowledgeIndicators: backendResponse.classification.traditional_knowledge_indicators.length
        ? `Detected indicators: ${backendResponse.classification.traditional_knowledge_indicators.join(', ')}`
        : undefined,
      absRelevance: {
        status: backendResponse.abs_assessment.potentially_relevant ? 'Potentially relevant' : 'Not relevant',
        reason: backendResponse.abs_assessment.reasons.join('; '),
        legalSource: backendResponse.abs_assessment.relevant_sources.join(', ')
      },
      priorArt,
      legalProvisions
    }
  }

  // Initialize conversation from sessionStorage
  useEffect(() => {
    const initializeChat = async () => {
      // Prevent duplicate initialization
      if (isInitialized) return
      
      try {
        const storedQuestion = sessionStorage.getItem(`chat:${chatId}:q`)
        const storedFormulation = sessionStorage.getItem(`chat:${chatId}:formulation`)
        const chatType = sessionStorage.getItem(`chat:${chatId}:type`)
        
        if (storedQuestion) {
          // Check if this is a formulation analysis
          if (chatType === 'formulation' && storedFormulation) {
            const formulation = JSON.parse(storedFormulation)
            setFormulationData(formulation)
            setIsFormulationAnalysis(true)
            setChatTitle(formulation.name || 'Formulation Analysis')
            
            const initialMessage: Message = {
              id: 'initial',
              role: 'user',
              content: `Analyze formulation: ${formulation.name}`,
              createdAt: new Date()
            }
            setMessages([initialMessage])
            
            // Call backend API for formulation analysis
            setLoadingState('loading')
            try {
              const description = `${formulation.name}. Ingredients: ${formulation.ingredients.join(', ')}. Intended use: ${formulation.intendedUse}${formulation.preparationProcess ? `. Preparation: ${formulation.preparationProcess}` : ''}${formulation.traditionalUse ? `. Traditional use: ${formulation.traditionalUse}` : ''}`
              
              const backendResponse = await apiClient.analyzeFormulation({ description })
              const aiResponse: Message = {
                id: 'initial-response',
                role: 'assistant',
                content: '',
                response: mapFormulationResponseToAIResponse(backendResponse),
                createdAt: new Date()
              }
              
              // Prevent duplicate messages
              setMessages(prev => {
                if (prev.some(msg => msg.id === 'initial-response')) {
                  console.warn('Prevented duplicate initial-response')
                  return prev
                }
                return [...prev, aiResponse]
              })
            } catch (error) {
              console.error('Formulation analysis error:', error)
              if (error instanceof APIError) {
                setApiError(error.message)
              } else {
                setApiError('Failed to analyze formulation. Please try again.')
              }
              setLoadingState('error')
            } finally {
              setLoadingState('idle')
            }
          } else {
            // Regular question flow
            setChatTitle('IP Research Chat')
            const initialMessage: Message = {
              id: 'initial',
              role: 'user',
              content: storedQuestion,
              createdAt: new Date()
            }
            setMessages([initialMessage])
            
            // Call backend API for general query
            setLoadingState('loading')
            try {
              const backendResponse = await apiClient.ask({ query: storedQuestion })
              const aiResponse: Message = {
                id: 'initial-response',
                role: 'assistant',
                content: '',
                response: mapAskResponseToAIResponse(backendResponse),
                createdAt: new Date()
              }
              
              // Prevent duplicate messages
              setMessages(prev => {
                if (prev.some(msg => msg.id === 'initial-response')) {
                  console.warn('Prevented duplicate initial-response')
                  return prev
                }
                return [...prev, aiResponse]
              })
              
              if (!backendResponse.sufficient) {
                setLoadingState('insufficient')
              }
            } catch (error) {
              console.error('Query error:', error)
              if (error instanceof APIError) {
                setApiError(error.message)
              } else {
                setApiError('Failed to process your question. Please try again.')
              }
              setLoadingState('error')
            } finally {
              setLoadingState('idle')
            }
          }
        }
      } catch (error) {
        console.error('Chat initialization error:', error)
        setMessages([])
      } finally {
        setIsInitialized(true)
      }
    }
    
    initializeChat()
  }, [chatId, isInitialized])

  // Update current time periodically for relative timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSpeechSupported(false)
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
      if (finalTranscript) {
        setFollowUp((prev) => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        setVoiceError('Microphone access denied. Please allow microphone access.')
      } else {
        setVoiceError(`Error: ${event.error}`)
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
  }, [selectedLanguage])

  const toggleVoiceRecording = useCallback(() => {
    if (!isSpeechSupported) {
      alert('Speech recognition is not supported in this browser.')
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
      return
    }

    try {
      recognitionRef.current = initSpeechRecognition()
      if (!recognitionRef.current) {
        setVoiceError('Failed to initialize speech recognition')
        return
      }
      setVoiceError(null)
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      setVoiceError('Failed to start voice recording. Please try again.')
      setVoiceState('error')
    }
  }, [voiceState, isSpeechSupported, initSpeechRecognition])

  // Text-to-speech for Listen button
  const toggleListen = useCallback((response: AIResponse) => {
    if (!('speechSynthesis' in window)) {
      alert('Voice playback is not supported in this browser.')
      return
    }

    if (listenState === 'playing') {
      window.speechSynthesis.pause()
      setListenState('paused')
    } else if (listenState === 'paused') {
      window.speechSynthesis.resume()
      setListenState('playing')
    } else {
      // Start speaking - read the complete answer
      const textToRead = `${response.preliminaryFinding}. ${response.explanation}. Relevant areas: ${response.relevantAreas.join(', ')}. Evidence confidence: ${response.confidence}. Anvashai provides source-grounded informational assistance and does not constitute legal advice.`
      const utterance = new SpeechSynthesisUtterance(textToRead)
      utterance.lang = LANGUAGES.find(l => l.code === selectedLanguage)?.speechCode || 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onend = () => setListenState('idle')
      utterance.onerror = () => setListenState('idle')
      speechRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setListenState('playing')
    }
  }, [listenState, selectedLanguage])

  const stopListen = useCallback(() => {
    window.speechSynthesis.cancel()
    setListenState('idle')
  }, [])

  const copyResponse = useCallback((response: AIResponse) => {
    const evidenceText = response.evidence.map((e, idx) => 
      `${idx + 1}. ${e.title}\n   ${e.subtitle}\n   Type: ${e.type}, Jurisdiction: ${e.jurisdiction}`
    ).join('\n\n')
    
    const textToCopy = `${response.preliminaryFinding}\n\n${response.explanation}\n\nRelevant areas: ${response.relevantAreas.join(', ')}\n\nEvidence used:\n\n${evidenceText}\n\nEvidence confidence: ${response.confidence}\n\nAnvashai provides source-grounded informational assistance and does not constitute legal advice.`
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setResponseCopied(true)
      setTimeout(() => setResponseCopied(false), 2000)
    }).catch(() => {
      alert('Failed to copy to clipboard. Please try again.')
    })
  }, [])

  const requestFacilitatorReview = useCallback((message: Message) => {
    // Save context and navigate to review page
    try {
      const userMessage = messages.find(m => m.role === 'user')
      const aiMessage = messages.find(m => m.role === 'assistant')
      
      sessionStorage.setItem('review:question', userMessage?.content || '')
      sessionStorage.setItem('review:response', JSON.stringify(aiMessage?.response))
      sessionStorage.setItem('review:chatId', chatId)
      sessionStorage.setItem('review:jurisdiction', 'India') // Would come from backend
      sessionStorage.setItem('review:confidence', aiMessage?.response?.confidence || 'Moderate')
    } catch {}
    router.push(`/review?chatId=${chatId}`)
  }, [messages, chatId, router])

  const handleFollowUpSubmit = useCallback(async () => {
    const q = followUp.trim()
    if (!q) return
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      createdAt: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setFollowUp('')
    setLoadingState('loading')
    
    try {
      // Call backend API
      const backendResponse = await apiClient.ask({ query: q })
      const aiResponseId = `ai-${Date.now()}`
      const aiResponse: Message = {
        id: aiResponseId,
        role: 'assistant',
        content: '',
        response: mapAskResponseToAIResponse(backendResponse),
        createdAt: new Date()
      }
      
      // Prevent duplicate messages by checking if we already have this response
      setMessages(prev => {
        if (prev.some(msg => msg.id === aiResponseId)) {
          console.warn('Prevented duplicate message with id:', aiResponseId)
          return prev
        }
        return [...prev, aiResponse]
      })
      setApiError(null)
      
      if (!backendResponse.sufficient) {
        setLoadingState('insufficient')
      }
    } catch (error) {
      console.error('Follow-up query error:', error)
      if (error instanceof APIError) {
        setApiError(error.message)
      } else {
        setApiError('Failed to process your question. Please try again.')
      }
      setLoadingState('error')
    } finally {
      setLoadingState('idle')
    }
    
    // Scroll to bottom
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }, [followUp])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleFollowUpSubmit()
    }
  }

  const handleRetry = useCallback(() => {
    // Retry the last user message
    const lastUserMessage = messages.findLast(m => m.role === 'user')
    if (lastUserMessage) {
      setFollowUp(lastUserMessage.content)
      handleFollowUpSubmit()
    }
  }, [messages, handleFollowUpSubmit])

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {}
      }
      window.speechSynthesis.cancel()
    }
  }, [])

  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col bg-background">
      {/* Page Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm md:px-6">
        <button
          type="button"
          onClick={() => router.push('/ask')}
          aria-label="Back to Ask Sahayak"
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{chatTitle}</span>
          <span className="text-[11px] text-muted-foreground">Session #{chatId} · Updated {formatRelativeTime(new Date())}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 md:px-6 pb-32">
        
        {/* Messages */}
        <div className="space-y-8">
          {messages.map((message) => (
            <div key={message.id}>
              {/* User Message */}
              {message.role === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-[75%] text-right">
                    <p className="text-sm leading-relaxed text-foreground select-text">
                      {message.content}
                    </p>
                    <span 
                      className="mt-1 block text-[10px] text-muted-foreground"
                      title={formatExactTime(message.createdAt)}
                    >
                      {formatRelativeTime(message.createdAt)}
                    </span>
                    
                    {/* Formulation Details - Expandable */}
                    {isFormulationAnalysis && formulationData && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setShowFormulationDetails(!showFormulationDetails)}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                        >
                          {showFormulationDetails ? (
                            <>
                              <ChevronUp className="size-3" />
                              Hide formulation details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="size-3" />
                              View formulation details
                            </>
                          )}
                        </button>
                        
                        {showFormulationDetails && (
                          <div className="mt-3 rounded-lg border border-border bg-muted/30 p-4 text-left">
                            <div className="space-y-3">
                              <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Formulation name</p>
                                <p className="text-sm text-foreground">{formulationData.name}</p>
                              </div>
                              
                              {formulationData.formulationType && (
                                <div>
                                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Formulation type</p>
                                  <p className="text-sm text-foreground">{formulationData.formulationType}</p>
                                </div>
                              )}
                              
                              <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Ingredients</p>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {formulationData.ingredients.map((ing: string, idx: number) => (
                                    <span key={idx} className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-foreground">
                                      {ing}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Intended use</p>
                                <p className="text-sm text-foreground">{formulationData.intendedUse}</p>
                              </div>
                              
                              {formulationData.preparationProcess && (
                                <div>
                                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Preparation process</p>
                                  <p className="text-sm text-foreground">{formulationData.preparationProcess}</p>
                                </div>
                              )}
                              
                              {formulationData.traditionalUse && (
                                <div>
                                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Traditional use</p>
                                  <p className="text-sm text-foreground">{formulationData.traditionalUse}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Message */}
              {message.role === 'assistant' && message.response && (
                <div className="space-y-6">
                  {/* Response Header */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <span 
                      className="text-sm font-semibold text-foreground"
                      title={formatExactTime(message.createdAt)}
                    >
                      Sahayak · {formatRelativeTime(message.createdAt)}
                    </span>
                  </div>

                  {/* Document-like response using typography hierarchy */}
                  <div className="space-y-6">
                    {/* Preliminary Finding */}
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        PRELIMINARY FINDING
                      </p>
                      <h2 className="text-xl font-semibold text-foreground">
                        {message.response.preliminaryFinding}
                      </h2>
                    </div>

                    {/* Explanation */}
                    <div className="text-sm leading-relaxed text-foreground prose prose-sm max-w-none">
                      {message.response.explanation}
                    </div>

                    {/* Formulation Classification */}
                    {message.response.formulationClassification && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          FORMULATION CLASSIFICATION
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">
                            {message.response.formulationClassification.classification}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">
                              Classification confidence: {message.response.formulationClassification.confidence}
                            </span>
                            {message.response.formulationClassification.detectedType && (
                              <span className="text-xs text-muted-foreground">
                                Detected type: {message.response.formulationClassification.detectedType}
                              </span>
                            )}
                          </div>
                          {message.response.formulationClassification.reason && (
                            <p className="text-xs text-muted-foreground">
                              {message.response.formulationClassification.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Biological Resources */}
                    {message.response.biologicalResources && message.response.biologicalResources.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          BIOLOGICAL RESOURCES
                        </p>
                        <div className="space-y-1">
                          {message.response.biologicalResources.map((resource, idx) => (
                            <p key={idx} className="text-sm text-foreground">
                              • {resource}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Traditional Knowledge Indicators */}
                    {message.response.traditionalKnowledgeIndicators && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          TRADITIONAL KNOWLEDGE INDICATORS
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {message.response.traditionalKnowledgeIndicators}
                        </p>
                      </div>
                    )}

                    {/* Potential ABS Relevance */}
                    {message.response.absRelevance && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          POTENTIAL ABS RELEVANCE
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">
                            {message.response.absRelevance.status}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {message.response.absRelevance.reason}
                          </p>
                          {message.response.absRelevance.legalSource && (
                            <p className="text-xs text-muted-foreground">
                              Legal source: {message.response.absRelevance.legalSource}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Potentially Relevant Prior Art */}
                    {message.response.priorArt && message.response.priorArt.length > 0 && (
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          POTENTIALLY RELEVANT PRIOR ART
                        </p>
                        <div className="space-y-3">
                          {message.response.priorArt.map((item) => (
                            <div key={item.id} className="rounded-lg border border-border/50 bg-muted/30 p-4">
                              <div className="mb-2 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-foreground">
                                    {item.title}
                                  </p>
                                  {item.patentNumber && (
                                    <p className="text-xs text-muted-foreground">
                                      {item.patentNumber}
                                    </p>
                                  )}
                                  {item.publicationDate && (
                                    <p className="text-xs text-muted-foreground">
                                      Published: {item.publicationDate}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    Jurisdiction: {item.jurisdiction}
                                  </p>
                                </div>
                                {item.similarity && (
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-foreground">
                                      {item.similarity}%
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                      AI-assisted similarity
                                    </p>
                                  </div>
                                )}
                              </div>
                              {item.matchingFeatures && item.matchingFeatures.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Matching features
                                  </p>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {item.matchingFeatures.map((feature, idx) => (
                                      <span key={idx} className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-foreground">
                                        {feature}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <button
                                onClick={() => router.push(item.url)}
                                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                              >
                                View evidence
                                <ExternalLink className="size-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Relevant Legal Provisions */}
                    {message.response.legalProvisions && message.response.legalProvisions.length > 0 && (
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          RELEVANT LEGAL PROVISIONS
                        </p>
                        <div className="space-y-2">
                          {message.response.legalProvisions.map((provision) => (
                            <div key={provision.id} className="rounded-lg border border-border/50 bg-muted/30 p-3">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {provision.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {provision.section}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {provision.explanation}
                                  </p>
                                </div>
                                <button
                                  onClick={() => router.push(provision.url)}
                                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-primary"
                                  aria-label={`View ${provision.title}`}
                                >
                                  <ExternalLink className="size-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Relevant areas - Chips */}
                    {message.response.relevantAreas.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-foreground">Relevant areas</h3>
                        <div className="flex flex-wrap gap-2">
                          {message.response.relevantAreas.map((area, idx) => (
                            <span
                              key={idx}
                              className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evidence used - Professional citation format */}
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-foreground">Evidence used</h3>
                      <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                        <div className="space-y-3">
                          {message.response.evidence.map((item, idx) => (
                            <div key={item.id} className="flex items-start gap-3">
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {item.subtitle}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span className="inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                        {item.type}
                                      </span>
                                      <span className="inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                        {item.jurisdiction}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => {
                                        const citationText = `${item.title} - ${item.subtitle} (${item.type}, ${item.jurisdiction})`
                                        navigator.clipboard.writeText(citationText).then(() => {
                                          setCopiedEvidenceId(item.id)
                                          setTimeout(() => setCopiedEvidenceId(null), 2000)
                                        })
                                      }}
                                      className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                      aria-label="Copy citation"
                                      title="Copy citation"
                                    >
                                      {copiedEvidenceId === item.id ? (
                                        <Check className="size-3.5 text-emerald-500" />
                                      ) : (
                                        <Copy className="size-3.5" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => router.push(item.url)}
                                      className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                                      aria-label={`View ${item.title}`}
                                      title="View source"
                                    >
                                      <ExternalLink className="size-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Evidence Confidence */}
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-foreground">Evidence confidence</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">
                          {message.response.confidence}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Confidence reflects evidence strength, not legal certainty.
                        </p>
                      </div>
                      {message.response.confidence === 'Low' || message.response.confidence === 'Insufficient' ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Evidence is limited. Consider facilitator review.
                        </p>
                      ) : null}
                    </div>

                    {/* Response Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => toggleListen(message.response!)}
                        disabled={!('speechSynthesis' in window)}
                      >
                        {listenState === 'playing' ? (
                          <>
                            <Pause className="size-4" />
                            Pause
                          </>
                        ) : listenState === 'paused' ? (
                          <>
                            <Play className="size-4" />
                            Resume
                          </>
                        ) : (
                          <>
                            <Play className="size-4" />
                            Listen
                          </>
                        )}
                      </Button>
                      
                      {listenState !== 'idle' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={stopListen}
                        >
                          <Square className="size-4" />
                          Stop
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => copyResponse(message.response!)}
                      >
                        {responseCopied ? (
                          <>
                            <Check className="size-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="size-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => requestFacilitatorReview(message)}
                      >
                        <UserCheck className="size-4" />
                        Request facilitator review
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loadingState === 'loading' && (
          <div className="mb-8 flex items-center gap-3 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-sm">Sahayak is researching...</span>
          </div>
        )}

        {/* Error State */}
        {loadingState === 'error' && apiError && (
          <div className="mb-8">
            <ErrorDisplay
              error={apiError}
              onRetry={handleRetry}
              onDismiss={() => setApiError(null)}
            />
          </div>
        )}

        {/* Insufficient Evidence State */}
        {loadingState === 'insufficient' && (
          <div className="mb-8 rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Evidence insufficient</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              The available sources do not provide enough evidence to answer this question reliably.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">View available sources</Button>
              <Button variant="outline" size="sm">Ask a more specific question</Button>
              <Button variant="outline" size="sm" onClick={() => {
                const lastUserMessage = messages.find(m => m.role === 'user')
                if (lastUserMessage) {
                  requestFacilitatorReview(lastUserMessage)
                }
              }}>
                Request facilitator review
              </Button>
            </div>
          </div>
        )}


        {/* Disclaimer */}
        <div className="mt-8 border-t border-border/40 pt-4">
          <p className="text-[11px] text-muted-foreground/60">
            Anvashai provides source-grounded informational assistance and does not constitute legal advice.
          </p>
        </div>
      </div>

      {/* Sticky Follow-up Input */}
      <div className="sticky bottom-0 z-20 border-t border-border bg-background/95 px-4 py-4 backdrop-blur-sm md:px-6">
        <div className="mx-auto max-w-4xl">
          {/* Voice error message */}
          {voiceError && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="size-4" />
              <span>{voiceError}</span>
              <button
                type="button"
                onClick={() => setVoiceError(null)}
                className="ml-auto text-destructive/70 hover:text-destructive"
              >
                ×
              </button>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
            <textarea
              ref={textareaRef}
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up..."
              rows={2}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              aria-label="Ask a follow-up question"
            />
            
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* File attachment */}
                <button
                  type="button"
                  aria-label="Attach file"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Paperclip className="size-4" />
                </button>
                
                {/* Voice input */}
                <button
                  type="button"
                  aria-label={voiceState === 'listening' ? 'Stop recording' : 'Voice input'}
                  onClick={toggleVoiceRecording}
                  disabled={!isSpeechSupported}
                  className={`flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-muted hover:text-foreground ${
                    voiceState === 'listening'
                      ? 'text-red-500 animate-pulse'
                      : 'text-muted-foreground'
                  } ${!isSpeechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {voiceState === 'listening' ? (
                    <MicOff className="size-4" />
                  ) : (
                    <Mic className="size-4" />
                  )}
                </button>
                
                {voiceState === 'listening' && (
                  <span className="text-xs text-muted-foreground">
                    Listening… Click to stop
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`text-xs tabular-nums ${
                  followUp.length >= MAX_CHARS ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {followUp.length}/{MAX_CHARS}
                </span>
                <button
                  type="button"
                  onClick={handleFollowUpSubmit}
                  disabled={!followUp.trim() || loadingState === 'loading'}
                  aria-label="Send follow-up"
                  className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loadingState === 'loading' ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}