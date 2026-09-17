'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Plus,
  Star,
  StarOff,
  Trash2,
  ChevronRight,
  MoreVertical,
  FileText,
  Leaf,
  Scale,
  Globe,
  Pill,
  File,
  Tag,
  X,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Category icons mapping
const CATEGORY_ICONS: Record<string, any> = {
  Patent: FileText,
  Trademark: Tag,
  'Traditional Knowledge': Leaf,
  ABS: Scale,
  GI: Globe,
  Formulation: Pill,
  General: FileText,
  Documents: File,
}

// Category colors for icons - using semantic design tokens for light/dark mode support
const CATEGORY_COLORS: Record<string, string> = {
  Patent: 'bg-primary/10 text-primary',
  Trademark: 'bg-primary/10 text-primary',
  'Traditional Knowledge': 'bg-primary/10 text-primary',
  ABS: 'bg-primary/10 text-primary',
  GI: 'bg-primary/10 text-primary',
  Formulation: 'bg-primary/10 text-primary',
  General: 'bg-muted text-muted-foreground',
  Documents: 'bg-muted text-muted-foreground',
}

interface Chat {
  id: string
  title: string
  preview: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
  messageCount: number
}

type SortOption = 'lastUpdated' | 'newestCreated' | 'oldestCreated' | 'az' | 'za'

const CATEGORIES = [
  'All Chats',
  'Patent',
  'Trademark',
  'Traditional Knowledge',
  'ABS',
  'GI',
  'Formulation',
  'General',
  'Documents',
]

const SORT_OPTIONS: Record<SortOption, string> = {
  lastUpdated: 'Last updated',
  newestCreated: 'Newest created',
  oldestCreated: 'Oldest created',
  az: 'A–Z',
  za: 'Z–A',
}

// Utility for relative timestamps
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
  
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Mock data - replace with real API call
const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    title: 'Can I patent an Ayurvedic formulation with herbal extracts?',
    preview: 'Traditional knowledge may be relevant to patentability. Based on the ingredients and intended use described...',
    category: 'Patent',
    tags: ['Patent', 'Traditional Knowledge', 'India'],
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    isFavorite: true,
    messageCount: 3
  },
  {
    id: '2',
    title: 'Traditional Knowledge Digital Library documentation',
    preview: 'The Traditional Knowledge Digital Library (TKDL) is a digital repository of traditional knowledge...',
    category: 'Traditional Knowledge',
    tags: ['Traditional Knowledge', 'Documentation'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isFavorite: false,
    messageCount: 5
  },
  {
    id: '3',
    title: 'ABS compliance for herbal product export',
    preview: 'Access and Benefit Sharing (ABS) regulations require prior informed consent for commercial use...',
    category: 'ABS',
    tags: ['ABS', 'International', 'Export'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isFavorite: false,
    messageCount: 2
  },
]

export default function ChatsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Chats')
  const [sortBy, setSortBy] = useState<SortOption>('lastUpdated')
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; chatId: string | null }>({ open: false, chatId: null })
  const [categoryMenu, setCategoryMenu] = useState<{ open: boolean; chatId: string | null }>({ open: false, chatId: null })
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // Filter and sort chats
  const filteredChats = useCallback(() => {
    let filtered = [...chats]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(chat =>
        chat.title.toLowerCase().includes(query) ||
        chat.preview.toLowerCase().includes(query) ||
        chat.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply category filter
    if (selectedCategory !== 'All Chats') {
      filtered = filtered.filter(chat => chat.category === selectedCategory)
    }

    // Apply sorting
    switch (sortBy) {
      case 'lastUpdated':
        filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        break
      case 'newestCreated':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'oldestCreated':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case 'az':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'za':
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return filtered
  }, [chats, searchQuery, selectedCategory, sortBy])

  const displayedChats = filteredChats()

  // Toggle favorite
  const toggleFavorite = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, isFavorite: !chat.isFavorite } : chat
    ))
  }, [])

  // Open delete dialog
  const openDeleteDialog = useCallback((chatId: string) => {
    setDeleteDialog({ open: true, chatId })
  }, [])

  // Confirm delete
  const confirmDelete = useCallback(() => {
    if (deleteDialog.chatId) {
      setChats(prev => prev.filter(chat => chat.id !== deleteDialog.chatId))
      setDeleteDialog({ open: false, chatId: null })
    }
  }, [deleteDialog.chatId])

  // Open chat
  const openChat = useCallback((chatId: string) => {
    router.push(`/ask/${chatId}`)
  }, [router])

  // Change category
  const changeCategory = useCallback((chatId: string, newCategory: string) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, category: newCategory } : chat
    ))
    setCategoryMenu({ open: false, chatId: null })
  }, [])

  // Get category count
  const getCategoryCount = useCallback((category: string) => {
    if (category === 'All Chats') return chats.length
    return chats.filter(chat => chat.category === category).length
  }, [chats])

  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-col bg-background">
      {/* Page Header */}
      <div className="border-b border-border bg-background/95 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                My Chats
              </h1>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Your research conversations with Sahayak. Revisit, continue, or organize them for future reference.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search your chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 md:w-80"
                  aria-label="Search chats"
                />
              </div>
              
              {/* New Chat Button */}
              <Button
                onClick={() => router.push('/ask')}
                className="gap-2"
              >
                <Plus className="size-4" />
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="border-b border-border bg-muted/30 px-4 py-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {CATEGORIES.map((category) => {
                const count = getCategoryCount(category)
                if (count === 0 && category !== 'All Chats') return null
                
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    {category}
                    {count > 0 && (
                      <span className="ml-2 text-xs opacity-60">
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Sorting Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted"
                aria-label="Sort chats"
              >
                <span>{SORT_OPTIONS[sortBy]}</span>
                <ChevronDown className="size-4" />
              </button>
              
              {showSortDropdown && (
                <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-border bg-popover p-1 shadow-lg">
                  {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSortBy(value as SortOption)
                        setShowSortDropdown(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted ${
                        sortBy === value ? 'bg-muted text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <span>{label}</span>
                      {sortBy === value && (
                        <div className="size-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Empty State - No Chats */}
          {chats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <FileText className="size-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                No research chats yet
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Start a conversation with Sahayak to build your research history.
              </p>
              <Button
                onClick={() => router.push('/ask')}
                className="mt-6"
              >
                Start new research
              </Button>
            </div>
          )}

          {/* Empty State - No Search Results */}
          {chats.length > 0 && displayedChats.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <Search className="size-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                No chats found
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different search term or category.
              </p>
            </div>
          )}

          {/* Chat List */}
          {displayedChats.length > 0 && (
            <div className="space-y-3">
              {displayedChats.map((chat) => {
                const CategoryIcon = CATEGORY_ICONS[chat.category] || FileText
                const categoryColor = CATEGORY_COLORS[chat.category] || CATEGORY_COLORS.General
                
                return (
                  <div
                    key={chat.id}
                    className="group rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 md:p-5"
                  >
                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${categoryColor}`}>
                        <CategoryIcon className="size-5" />
                      </div>

                      {/* Chat Content */}
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        {/* Title and Actions */}
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-semibold text-foreground md:text-lg">
                            {chat.title}
                          </h3>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => toggleFavorite(chat.id)}
                              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label={chat.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                              title={chat.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              {chat.isFavorite ? (
                                <Star className="size-4 fill-amber-400 text-amber-400" />
                              ) : (
                                <StarOff className="size-4" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => setCategoryMenu({ open: true, chatId: chat.id })}
                              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label="Change category"
                            >
                              <MoreVertical className="size-4" />
                            </button>
                            
                            <button
                              onClick={() => openDeleteDialog(chat.id)}
                              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              aria-label="Delete chat"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>

                        {/* Preview */}
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {chat.preview}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {chat.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Timestamp and Open */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(chat.updatedAt)}
                          </span>
                          
                          <button
                            onClick={() => openChat(chat.id)}
                            className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                            aria-label={`Open chat: ${chat.title}`}
                          >
                            Open chat
                            <ChevronRight className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination Footer */}
          {displayedChats.length > 0 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Showing 1–{displayedChats.length} of {chats.length} chats
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground">
              Delete this research chat?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This conversation will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, chatId: null })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Change Menu */}
      {categoryMenu.open && categoryMenu.chatId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground">
              Change category
            </h3>
            <div className="mt-4 space-y-2">
              {CATEGORIES.filter(cat => cat !== 'All Chats').map((category) => (
                <button
                  key={category}
                  onClick={() => changeCategory(categoryMenu.chatId!, category)}
                  className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-left transition-colors hover:bg-muted"
                >
                  <span className="text-sm font-medium text-foreground">
                    {category}
                  </span>
                  {category === chats.find(c => c.id === categoryMenu.chatId)?.category && (
                    <div className="size-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setCategoryMenu({ open: false, chatId: null })}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
