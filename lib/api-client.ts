/**
 * API Client for IP-SAKTI Sahayak Backend
 * 
 * This client provides typed interfaces to the Python FastAPI backend
 * running on the server. All API calls are centralized here for consistent
 * error handling, loading states, and response parsing.
 */

const DEFAULT_BACKEND_PORTS = [8000, 8001, 8002, 8003, 8004, 8005]
const DEFAULT_BACKEND_HOSTS = ['http://localhost', 'http://127.0.0.1']

function getCandidateBaseUrls(configuredUrl?: string): string[] {
  const uniqueUrls = new Set<string>()

  if (configuredUrl && configuredUrl.trim()) {
    uniqueUrls.add(configuredUrl.replace(/\/$/, ''))
  }

  for (const host of DEFAULT_BACKEND_HOSTS) {
    for (const port of DEFAULT_BACKEND_PORTS) {
      uniqueUrls.add(`${host}:${port}`)
    }
  }

  return Array.from(uniqueUrls)
}

const API_BASE_URL = getCandidateBaseUrls(process.env.NEXT_PUBLIC_API_BASE_URL)[0] ?? 'http://localhost:8000'

// ─────────────────────────────────────────────────────────────────────────────
// Types matching backend Pydantic models
// ─────────────────────────────────────────────────────────────────────────────

// Common citation types
interface BaseCitation {
  document: string
  chapter?: string
  section?: string
  subsection?: string
  page?: number
  source: string
  source_url?: string
  chunk_id: string
}

// Phase 2: Query endpoint
interface QueryRequest {
  question: string
  domain?: string
}

interface QueryResponse {
  answer: string
  confidence: string
  citations: BaseCitation[]
  query_type: string
  sufficient: boolean
}

// Phase 3: Analyze Invention endpoint
interface InventionRequest {
  description: string
}

interface PatentMatch {
  label: string
  similarity_score?: number
  source: string
  chunk_id: string
}

interface TKMatch {
  label: string
  source: string
  page?: number
  score?: number
}

interface EvidenceCitation {
  type: string
  label: string
  source: string
  section?: string
  page?: number
  chunk_id: string
}

interface Invention {
  title: string
  technical_field?: string
  problem?: string
  solution?: string
  components: string[]
  intended_use?: string
  keywords: string[]
  novelty_claim?: string
}

interface AnalysisResponse {
  invention: Invention
  relevant_provisions: string[]
  similar_patents: PatentMatch[]
  tk_matches: TKMatch[]
  issues: string[]
  assessment: string
  confidence: string
  citations: EvidenceCitation[]
}

// Phase 4: Patentability Check endpoint
interface PatentabilityRequest {
  description: string
  cutoff_date?: string // ISO "YYYY-MM-DD"
}

interface Feature {
  id: string
  feature: string
  category: string
}

interface InventionDetail {
  title: string
  technical_field?: string
  features: Feature[]
  claim_type: string
  ipc_suggested: string[]
  independent_claim: string
}

interface LegalBasis {
  label: string
  source: string
  section?: string
  page?: number
}

interface TKEvidence {
  label: string
  source: string
  page?: number
  score?: number
  section?: string
}

interface AssessmentStatus {
  status: string
  reason: string
}

interface PatentabilityResponse {
  invention: InventionDetail
  legal_basis: LegalBasis[]
  prior_art: any[]
  traditional_knowledge: TKEvidence[]
  novelty_analysis: any
  inventive_step_analysis: any
  assessment: AssessmentStatus
  report: string
  confidence: string
  citations: EvidenceCitation[]
}

// Phase 5: Ask endpoint (Unified routed Q&A)
interface AskRequest {
  query: string
}

interface Formulation {
  formulation_type: string
  secondary_types: string[]
  ingredients: string[]
  biological_resources: string[]
  traditional_knowledge_indicators: string[]
  tk_systems: string[]
  confidence: number
  notes?: string
}

interface AskCitation extends BaseCitation {
  domain?: string
}

interface AskResponse {
  query: string
  ip_types: string[]
  primary_ip: string
  router_reason: string
  formulation?: Formulation
  answer: string
  confidence: string
  sufficient: boolean
  citations: AskCitation[]
  domains_used: string[]
  query_type: string
}

// Phase 7: Analyze Formulation endpoint
interface FormulationAnalysisRequest {
  description: string
}

interface Ingredient {
  name: string
  scientific_name?: string
  biological_resource: boolean
  traditional_use_indicator: boolean
  traditional_systems: string[]
  source: string
}

interface FormulationClass {
  formulation_type: string
  secondary_types: string[]
  ingredients: string[]
  biological_resources: string[]
  traditional_knowledge_indicators: string[]
  tk_systems: string[]
  ingredient_objects: Ingredient[]
  confidence: number
  notes?: string
}

interface ABSAssessment {
  potentially_relevant: boolean
  biological_resources: string[]
  traditional_knowledge_detected: boolean
  reasons: string[]
  relevant_sources: string[]
  requires_human_review: boolean
  suggested_provisions: string[]
}

interface TKMatchItem {
  source: string
  title: string
  matched_components: string[]
  score: number
  page?: number
}

interface TKResult {
  match_found: boolean
  matches: TKMatchItem[]
}

interface PatentResult {
  publication_number: string
  title: string
  similarity_score: number
  matched_components: string[]
  source: string
}

interface LegalProvision {
  document: string
  section?: string
  subsection?: string
  source: string
  page?: number
  chunk_id: string
}

interface FormulationAnalysisResponse {
  classification: FormulationClass
  abs_assessment: ABSAssessment
  tk_results: TKResult
  patent_results: PatentResult[]
  legal_provisions: LegalProvision[]
  report: string
  confidence: string
}

// Phase 8: Multilingual Query endpoint
interface MultilingualQueryRequest {
  question: string
  language?: string // "en" | "hi" | "kn"
  domain?: string
  jurisdiction?: string
  ip_type?: string
}

interface MultilingualCitation {
  document: string
  section?: string
  subsection?: string
  page?: number
  source: string
  jurisdiction?: string
  chunk_id: string
}

interface MultilingualQueryResponse {
  language: string
  original_question: string
  normalized_question: string
  ip_types: string[]
  jurisdiction?: string
  answer: string
  answer_english: string
  citations: MultilingualCitation[]
  confidence: string
  sufficient: boolean
  disclaimer: string
  detection_method: string
}

// ─────────────────────────────────────────────────────────────────────────────
// API Error handling
// ─────────────────────────────────────────────────────────────────────────────

class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API Client Class
// ─────────────────────────────────────────────────────────────────────────────

class IPSaktiClient {
  private baseUrl: string
  private candidateBaseUrls: string[]

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.candidateBaseUrls = getCandidateBaseUrls(process.env.NEXT_PUBLIC_API_BASE_URL)
    if (!this.candidateBaseUrls.includes(this.baseUrl)) {
      this.candidateBaseUrls.unshift(this.baseUrl)
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    let lastError: unknown = null

    for (const baseUrl of this.candidateBaseUrls) {
      const url = `${baseUrl}${endpoint}`
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      try {
        const response = await fetch(url, {
          ...options,
          headers,
        })

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`
          try {
            const errorData = await response.json()
            errorMessage = errorData.detail || errorMessage
          } catch {
            errorMessage = response.statusText || errorMessage
          }
          throw new APIError(errorMessage, response.status)
        }

        this.baseUrl = baseUrl
        return await response.json()
      } catch (error) {
        if (error instanceof APIError) {
          throw error
        }

        const isNetworkFailure =
          error instanceof TypeError &&
          /fetch|network|Failed to fetch|load failed/i.test(error.message)

        const isConnectionFailure =
          typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          (error.name === 'TypeError' || error.name === 'AbortError')

        if (!(isNetworkFailure || isConnectionFailure)) {
          throw new APIError('An unexpected error occurred')
        }

        lastError = error
      }
    }

    throw new APIError(
      'Network error: Unable to connect to the backend server',
      undefined,
      lastError
    )
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    return this.request('/')
  }

  // Phase 2: Legal Q&A
  async query(request: QueryRequest): Promise<QueryResponse> {
    return this.request<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  // Phase 3: Analyze Invention
  async analyzeInvention(request: InventionRequest): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>('/analyze-invention', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  // Phase 4: Patentability Check
  async patentabilityCheck(request: PatentabilityRequest): Promise<PatentabilityResponse> {
    return this.request<PatentabilityResponse>('/patentability-check', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  // Phase 5: Unified Routed Q&A
  async ask(request: AskRequest): Promise<AskResponse> {
    return this.request<AskResponse>('/ask', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  // Phase 7: Formulation Analysis
  async analyzeFormulation(request: FormulationAnalysisRequest): Promise<FormulationAnalysisResponse> {
    return this.request<FormulationAnalysisResponse>('/analyze-formulation', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  // Phase 8: Multilingual Query
  async multilingualQuery(request: MultilingualQueryRequest): Promise<MultilingualQueryResponse> {
    return this.request<MultilingualQueryResponse>('/multilingual-query', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Export singleton instance
// ─────────────────────────────────────────────────────────────────────────────

export const apiClient = new IPSaktiClient()

// Export types for use in components
export type {
  QueryRequest,
  QueryResponse,
  InventionRequest,
  AnalysisResponse,
  PatentabilityRequest,
  PatentabilityResponse,
  AskRequest,
  AskResponse,
  FormulationAnalysisRequest,
  FormulationAnalysisResponse,
  MultilingualQueryRequest,
  MultilingualQueryResponse,
  BaseCitation,
  Formulation,
  Ingredient,
  Feature,
  Invention,
  PatentMatch,
  TKMatch,
  EvidenceCitation,
  LegalBasis,
  TKEvidence,
  AssessmentStatus,
  TKMatchItem,
  TKResult,
  PatentResult,
  LegalProvision,
  ABSAssessment,
  FormulationClass,
}

export { APIError }
