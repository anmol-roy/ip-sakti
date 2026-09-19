'use client'

import { useState, useMemo, useCallback } from 'react'
import { Search, Scale, Leaf, Database, BookOpen, Globe, FileText, ExternalLink, Book, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Resource data model
interface Resource {
  id: string
  title: string
  description: string
  jurisdiction: 'india' | 'international'
  category: string
  section: string
  organization: string
  documentType: 'pdf' | 'webpage' | 'database'
  year?: string
  version?: string
  sourceUrl: string
  pdfUrl?: string
  keywords?: string[]
  isOfficial: boolean
}

// Real official resources
const RESOURCES: Resource[] = [
  // India - IP Laws & Regulations
  {
    id: 'india-patents-act-1970',
    title: 'Patents Act, 1970',
    description: 'India\'s principal legislation governing patents, including patentability exclusions, application procedures, and rights.',
    jurisdiction: 'india',
    category: 'Acts & Rules',
    section: 'Indian IP Laws & Regulations',
    organization: 'Government of India',
    documentType: 'webpage',
    year: '1970',
    sourceUrl: 'https://www.ipindia.gov.in/the-patents-act-1970',
    isOfficial: true,
    keywords: ['patent', 'act', 'law', 'legislation']
  },
  {
    id: 'india-patents-rules-2003',
    title: 'Patents Rules, 2003',
    description: 'Rules governing patent application procedures, fees, timelines, and administrative requirements under the Patents Act.',
    jurisdiction: 'india',
    category: 'Acts & Rules',
    section: 'Indian IP Laws & Regulations',
    organization: 'Government of India',
    documentType: 'webpage',
    year: '2003',
    sourceUrl: 'https://www.ipindia.gov.in/patents-rules-2003',
    isOfficial: true,
    keywords: ['patent', 'rules', 'procedure', 'fees']
  },
  {
    id: 'india-trademarks-act-1999',
    title: 'Trade Marks Act, 1999',
    description: 'Legislation governing trademark registration, protection, enforcement, and the Geographical Indications registry.',
    jurisdiction: 'india',
    category: 'Acts & Rules',
    section: 'Indian IP Laws & Regulations',
    organization: 'Government of India',
    documentType: 'webpage',
    year: '1999',
    sourceUrl: 'https://www.ipindia.gov.in/trade-marks-act-1999',
    isOfficial: true,
    keywords: ['trademark', 'act', 'brand', 'registration']
  },
  {
    id: 'india-copyright-act-1957',
    title: 'Copyright Act, 1957',
    description: 'India\'s copyright legislation protecting literary, dramatic, musical, and artistic works, films, and sound recordings.',
    jurisdiction: 'india',
    category: 'Acts & Rules',
    section: 'Indian IP Laws & Regulations',
    organization: 'Government of India',
    documentType: 'webpage',
    year: '1957',
    sourceUrl: 'https://www.copyright.gov.in/',
    isOfficial: true,
    keywords: ['copyright', 'act', 'literary', 'artistic']
  },
  {
    id: 'india-designs-act-2000',
    title: 'Designs Act, 2000',
    description: 'Legislation protecting the visual design of articles, including registration procedures and rights.',
    jurisdiction: 'india',
    category: 'Acts & Rules',
    section: 'Indian IP Laws & Regulations',
    organization: 'Government of India',
    documentType: 'webpage',
    year: '2000',
    sourceUrl: 'https://www.ipindia.gov.in/designs-act-2000',
    isOfficial: true,
    keywords: ['design', 'act', 'visual', 'industrial']
  },
  {
    id: 'india-gi-act-1999',
    title: 'Geographical Indications of Goods (Registration and Protection) Act, 1999',
    description: 'Legislation protecting geographical indications of goods, including registration and enforcement.',
    jurisdiction: 'india',
    category: 'Acts & Rules',
    section: 'Indian IP Laws & Regulations',
    organization: 'Government of India',
    documentType: 'webpage',
    year: '1999',
    sourceUrl: 'https://www.ipindia.gov.in/geographical-indications-act-1999',
    isOfficial: true,
    keywords: ['geographical indication', 'gi', 'act', 'protection']
  },

  // India - Traditional Knowledge & AYUSH
  {
    id: 'india-tkdl',
    title: 'Traditional Knowledge Digital Library (TKDL)',
    description: 'Official digital repository of traditional knowledge, including Ayurveda, Siddha, Unani, and Yoga, accessible to patent examiners.',
    jurisdiction: 'india',
    category: 'Traditional Knowledge',
    section: 'Traditional Knowledge & AYUSH',
    organization: 'Council of Scientific & Industrial Research (CSIR)',
    documentType: 'database',
    sourceUrl: 'https://www.tkdl.res.in/',
    isOfficial: true,
    keywords: ['traditional knowledge', 'tkdl', 'ayurveda', 'siddha', 'unani']
  },
  {
    id: 'india-ayush-ministry',
    title: 'Ministry of AYUSH',
    description: 'Official government ministry for Ayurveda, Yoga, Naturopathy, Unani, Siddha, and Homoeopathy systems of medicine.',
    jurisdiction: 'india',
    category: 'AYUSH & Formulations',
    section: 'Traditional Knowledge & AYUSH',
    organization: 'Government of India',
    documentType: 'webpage',
    sourceUrl: 'https://www.ayush.gov.in/',
    isOfficial: true,
    keywords: ['ayush', 'ministry', 'ayurveda', 'yoga', 'siddha']
  },

  // India - ABS & Biological Resources
  {
    id: 'india-bda-2002',
    title: 'Biological Diversity Act, 2002',
    description: 'Legislation governing access to biological resources, benefit-sharing, and protection of traditional knowledge.',
    jurisdiction: 'india',
    category: 'ABS & Biodiversity',
    section: 'ABS & Biological Resources',
    organization: 'Government of India',
    documentType: 'webpage',
    year: '2002',
    sourceUrl: 'https://nbaindia.gov.in/',
    isOfficial: true,
    keywords: ['biodiversity', 'abs', 'act', 'biological resources']
  },
  {
    id: 'india-bda-rules-2004',
    title: 'Biological Diversity Rules, 2004',
    description: 'Rules implementing the Biological Diversity Act, including procedures for access and benefit-sharing.',
    jurisdiction: 'india',
    category: 'ABS & Biodiversity',
    section: 'ABS & Biological Resources',
    organization: 'National Biodiversity Authority',
    documentType: 'webpage',
    year: '2004',
    sourceUrl: 'https://nbaindia.gov.in/rules-regulations/',
    isOfficial: true,
    keywords: ['biodiversity', 'rules', 'abs', 'benefit sharing']
  },
  {
    id: 'india-nba',
    title: 'National Biodiversity Authority (NBA)',
    description: 'Statutory body implementing the Biological Diversity Act, regulating access to biological resources.',
    jurisdiction: 'india',
    category: 'ABS & Biodiversity',
    section: 'ABS & Biological Resources',
    organization: 'Government of India',
    documentType: 'webpage',
    sourceUrl: 'https://nbaindia.gov.in/',
    isOfficial: true,
    keywords: ['nba', 'biodiversity', 'authority', 'abs']
  },

  // India - Official IP Databases
  {
    id: 'india-ipindia-patents',
    title: 'IP India Patent Database',
    description: 'Official patent database of the Indian Patent Office, searchable by application number, patent number, and applicant name.',
    jurisdiction: 'india',
    category: 'Government Databases',
    section: 'Official IP Databases',
    organization: 'Indian Patent Office',
    documentType: 'database',
    sourceUrl: 'https://ipindia.gov.in/',
    isOfficial: true,
    keywords: ['patent', 'database', 'search', 'ipo']
  },
  {
    id: 'india-ipindia-trademarks',
    title: 'IP India Trademark Database',
    description: 'Official trademark database for searching registered trademarks, brand names, and service marks.',
    jurisdiction: 'india',
    category: 'Government Databases',
    section: 'Official IP Databases',
    organization: 'Indian Patent Office',
    documentType: 'database',
    sourceUrl: 'https://ipindia.gov.in/trade-marks',
    isOfficial: true,
    keywords: ['trademark', 'database', 'search', 'brand']
  },
  {
    id: 'india-gi-registry',
    title: 'Geographical Indications Registry',
    description: 'Official registry of registered geographical indications in India, searchable by product and region.',
    jurisdiction: 'india',
    category: 'Government Databases',
    section: 'Official IP Databases',
    organization: 'Government of India',
    documentType: 'database',
    sourceUrl: 'https://www.ipindia.gov.in/geographical-indications',
    isOfficial: true,
    keywords: ['geographical indication', 'registry', 'gi', 'search']
  },

  // India - Guidelines & Reference Documents
  {
    id: 'india-patent-manual',
    title: 'Patent Office Practice and Procedure Manual',
    description: 'Official manual detailing patent examination procedures, guidelines, and practices for the Indian Patent Office.',
    jurisdiction: 'india',
    category: 'Guidelines & Policies',
    section: 'Guidelines & Reference Documents',
    organization: 'Indian Patent Office',
    documentType: 'pdf',
    sourceUrl: 'https://www.ipindia.gov.in/',
    isOfficial: true,
    keywords: ['patent', 'manual', 'procedure', 'guidelines']
  },

  // International - Treaties & Conventions
  {
    id: 'intl-wipo-convention',
    title: 'WIPO Convention',
    description: 'Convention establishing the World Intellectual Property Organization, the global forum for IP services and policy.',
    jurisdiction: 'international',
    category: 'Treaties & Conventions',
    section: 'International Treaties & Conventions',
    organization: 'World Intellectual Property Organization (WIPO)',
    documentType: 'webpage',
    year: '1970',
    sourceUrl: 'https://www.wipo.int/treaties/en/details.jsp?treaty_id=25',
    isOfficial: true,
    keywords: ['wipo', 'convention', 'treaty', 'organization']
  },
  {
    id: 'intl-paris-convention',
    title: 'Paris Convention for the Protection of Industrial Property',
    description: 'International treaty protecting industrial property, including patents, trademarks, and industrial designs.',
    jurisdiction: 'international',
    category: 'Treaties & Conventions',
    section: 'International Treaties & Conventions',
    organization: 'WIPO',
    documentType: 'webpage',
    year: '1883',
    sourceUrl: 'https://www.wipo.int/treaties/en/details.jsp?treaty_id=24',
    isOfficial: true,
    keywords: ['paris', 'convention', 'industrial property', 'treaty']
  },
  {
    id: 'intl-berne-convention',
    title: 'Berne Convention for the Protection of Literary and Artistic Works',
    description: 'International copyright treaty protecting literary and artistic works across member countries.',
    jurisdiction: 'international',
    category: 'Treaties & Conventions',
    section: 'International Treaties & Conventions',
    organization: 'WIPO',
    documentType: 'webpage',
    year: '1886',
    sourceUrl: 'https://www.wipo.int/treaties/en/details.jsp?treaty_id=15',
    isOfficial: true,
    keywords: ['berne', 'convention', 'copyright', 'literary']
  },
  {
    id: 'intl-pct',
    title: 'Patent Cooperation Treaty (PCT)',
    description: 'International treaty for patent applications, allowing a single application to seek protection in multiple countries.',
    jurisdiction: 'international',
    category: 'Treaties & Conventions',
    section: 'International Treaties & Conventions',
    organization: 'WIPO',
    documentType: 'webpage',
    year: '1970',
    sourceUrl: 'https://www.wipo.int/pct/en/',
    isOfficial: true,
    keywords: ['pct', 'patent', 'cooperation', 'treaty', 'international']
  },
  {
    id: 'intl-trips',
    title: 'TRIPS Agreement',
    description: 'WTO agreement on Trade-Related Aspects of Intellectual Property Rights, setting minimum IP protection standards.',
    jurisdiction: 'international',
    category: 'Treaties & Conventions',
    section: 'International Treaties & Conventions',
    organization: 'World Trade Organization (WTO)',
    documentType: 'webpage',
    year: '1994',
    sourceUrl: 'https://www.wto.org/english/tratops_e/trips_e/trips_e.htm',
    isOfficial: true,
    keywords: ['trips', 'wto', 'trade', 'intellectual property']
  },

  // International - International IP Systems
  {
    id: 'intl-madrid-system',
    title: 'Madrid System for International Registration of Trademarks',
    description: 'International trademark registration system allowing protection in multiple countries through a single application.',
    jurisdiction: 'international',
    category: 'International Systems',
    section: 'International IP Systems',
    organization: 'WIPO',
    documentType: 'webpage',
    sourceUrl: 'https://www.wipo.int/madrid/en/',
    isOfficial: true,
    keywords: ['madrid', 'trademark', 'international', 'registration']
  },
  {
    id: 'intl-hague-system',
    title: 'Hague System for International Registration of Industrial Designs',
    description: 'International design registration system for protecting industrial designs in multiple countries.',
    jurisdiction: 'international',
    category: 'International Systems',
    section: 'International IP Systems',
    organization: 'WIPO',
    documentType: 'webpage',
    sourceUrl: 'https://www.wipo.int/hague/en/',
    isOfficial: true,
    keywords: ['hague', 'design', 'international', 'registration']
  },

  // International - Classification & Guidelines
  {
    id: 'intl-ipc',
    title: 'International Patent Classification (IPC)',
    description: 'Hierarchical classification system for patents, used by patent offices worldwide for patent search and examination.',
    jurisdiction: 'international',
    category: 'International Classification & Guidelines',
    section: 'International Classification & Guidelines',
    organization: 'WIPO',
    documentType: 'database',
    sourceUrl: 'https://www.wipo.int/classifications/ipc/en/',
    isOfficial: true,
    keywords: ['ipc', 'patent', 'classification', 'search']
  },
  {
    id: 'intl-nice',
    title: 'Nice Classification',
    description: 'International classification of goods and services for trademark registration purposes.',
    jurisdiction: 'international',
    category: 'International Classification & Guidelines',
    section: 'International Classification & Guidelines',
    organization: 'WIPO',
    documentType: 'database',
    sourceUrl: 'https://www.wipo.int/classifications/nice/en/',
    isOfficial: true,
    keywords: ['nice', 'trademark', 'classification', 'goods', 'services']
  },
  {
    id: 'intl-locarno',
    title: 'Locarno Classification',
    description: 'International classification for industrial designs, used for design registration and search.',
    jurisdiction: 'international',
    category: 'International Classification & Guidelines',
    section: 'International Classification & Guidelines',
    organization: 'WIPO',
    documentType: 'database',
    sourceUrl: 'https://www.wipo.int/classifications/locarno/en/',
    isOfficial: true,
    keywords: ['locarno', 'design', 'classification', 'industrial']
  },

  // International - Traditional Knowledge & Biodiversity
  {
    id: 'intl-wipo-tk',
    title: 'WIPO Traditional Knowledge Resources',
    description: 'WIPO resources on traditional knowledge, genetic resources, and traditional cultural expressions.',
    jurisdiction: 'international',
    category: 'Traditional Knowledge',
    section: 'Traditional Knowledge & Biodiversity',
    organization: 'WIPO',
    documentType: 'webpage',
    sourceUrl: 'https://www.wipo.int/tk/en/',
    isOfficial: true,
    keywords: ['traditional knowledge', 'wipo', 'genetic resources', 'tce']
  },
  {
    id: 'intl-cbd',
    title: 'Convention on Biological Diversity (CBD)',
    description: 'International agreement for conservation of biological diversity, sustainable use, and fair benefit-sharing.',
    jurisdiction: 'international',
    category: 'Biodiversity & ABS',
    section: 'Traditional Knowledge & Biodiversity',
    organization: 'Secretariat of the Convention on Biological Diversity',
    documentType: 'webpage',
    year: '1992',
    sourceUrl: 'https://www.cbd.int/',
    isOfficial: true,
    keywords: ['cbd', 'biodiversity', 'convention', 'conservation']
  },
  {
    id: 'intl-nagoya',
    title: 'Nagoya Protocol on Access and Benefit-Sharing',
    description: 'International protocol on access to genetic resources and fair benefit-sharing arising from their utilization.',
    jurisdiction: 'international',
    category: 'Biodiversity & ABS',
    section: 'Traditional Knowledge & Biodiversity',
    organization: 'Secretariat of the Convention on Biological Diversity',
    documentType: 'webpage',
    year: '2010',
    sourceUrl: 'https://www.cbd.int/abs/',
    isOfficial: true,
    keywords: ['nagoya', 'protocol', 'abs', 'benefit sharing', 'genetic resources']
  },
]

// Category filters for each jurisdiction
const INDIA_CATEGORIES = [
  'All',
  'Acts & Rules',
  'Patents',
  'Trademarks',
  'Designs',
  'Copyright',
  'Geographical Indications',
  'Traditional Knowledge',
  'ABS & Biodiversity',
  'AYUSH & Formulations',
  'Government Databases',
  'Guidelines & Policies',
]

const INTERNATIONAL_CATEGORIES = [
  'All',
  'Treaties & Conventions',
  'Patents',
  'Trademarks',
  'Designs',
  'Copyright',
  'Traditional Knowledge',
  'Biodiversity & ABS',
  'International Systems',
  'Guidelines & Reports',
]

// Icon mapping based on category
const getResourceIcon = (category: string) => {
  if (category.includes('Act') || category.includes('Rules') || category.includes('Treaty')) return Scale
  if (category.includes('Traditional Knowledge') || category.includes('ABS') || category.includes('Biodiversity') || category.includes('AYUSH')) return Leaf
  if (category.includes('Database')) return Database
  if (category.includes('Guideline') || category.includes('Manual') || category.includes('Report')) return BookOpen
  return FileText
}

export default function SourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<'india' | 'international'>('india')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Filter resources based on search, jurisdiction, and category
  const filteredResources = useMemo(() => {
    let filtered = RESOURCES.filter(r => r.jurisdiction === selectedJurisdiction)

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(r => r.category === selectedCategory)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.organization.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        r.keywords?.some(k => k.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [searchQuery, selectedJurisdiction, selectedCategory])

  // Group resources by section
  const groupedResources = useMemo(() => {
    const groups: Record<string, Resource[]> = {}
    filteredResources.forEach(resource => {
      if (!groups[resource.section]) {
        groups[resource.section] = []
      }
      groups[resource.section].push(resource)
    })
    return groups
  }, [filteredResources])

  const categories = selectedJurisdiction === 'india' ? INDIA_CATEGORIES : INTERNATIONAL_CATEGORIES

  const openResource = useCallback((resource: Resource) => {
    window.open(resource.sourceUrl, '_blank', 'noopener,noreferrer')
  }, [])

  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-gradient-to-b from-background to-muted/20 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <Book className="mr-1.5 size-3" />
              Knowledge Library
            </span>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Resources
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                Explore the laws, guidelines, treaties, databases, and reference documents used by Sahayak to provide source-grounded IP research assistance.
              </p>
            </div>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search laws, treaties, databases, or documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-80"
                aria-label="Search resources"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Jurisdiction Tabs and Filters */}
      <div className="border-b border-border bg-gradient-to-r from-muted/20 to-muted/10 px-4 py-5 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Jurisdiction Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedJurisdiction('india')
                  setSelectedCategory('All')
                }}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  selectedJurisdiction === 'india'
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'border-border bg-background text-foreground hover:bg-muted hover:border-border/80'
                }`}
              >
                <MapPin className="size-4" />
                India
              </button>
              <button
                onClick={() => {
                  setSelectedJurisdiction('international')
                  setSelectedCategory('All')
                }}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  selectedJurisdiction === 'international'
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'border-border bg-background text-foreground hover:bg-muted hover:border-border/80'
                }`}
              >
                <Globe className="size-4" />
                International
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
              {categories.map((category) => {
                const count = category === 'All'
                  ? RESOURCES.filter(r => r.jurisdiction === selectedJurisdiction).length
                  : RESOURCES.filter(r => r.jurisdiction === selectedJurisdiction && r.category === category).length

                if (count === 0 && category !== 'All') return null

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
                      selectedCategory === category
                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm'
                        : 'border-border bg-background text-foreground hover:bg-muted/50 hover:border-border/60'
                    }`}
                  >
                    {category}
                    <span className="ml-1.5 text-[10px] opacity-60 sm:ml-2 sm:text-xs">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Resource List */}
      <div className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Empty State */}
          {filteredResources.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <Search className="size-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                No resources found
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another keyword or select a different category.
              </p>
            </div>
          )}

          {/* Resource Groups */}
          {Object.entries(groupedResources).map(([section, resources]) => (
            <div key={section} className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {section}
              </h2>
              <div className="space-y-3">
                {resources.map((resource) => {
                  const Icon = getResourceIcon(resource.category)
                  
                  return (
                    <div
                      key={resource.id}
                      className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                    >
                      {/* Icon */}
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                        <Icon className="size-5" />
                      </div>

                      {/* Content */}
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {resource.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{resource.category}</span>
                          <span>·</span>
                          <span>{resource.organization}</span>
                          {resource.year && (
                            <>
                              <span>·</span>
                              <span>{resource.year}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => openResource(resource)}
                        className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                        aria-label={`Open ${resource.title}`}
                      >
                        <span className="hidden sm:inline">Open resource</span>
                        <span className="sm:hidden">Open</span>
                        <ExternalLink className="size-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
