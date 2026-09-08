import {
  ChartNoAxesCombined,
  House,
  Library,
  MessagesSquare,
  Sparkles,
  UserRoundCheck,
  type LucideIcon,
} from 'lucide-react'

export type NavKey = 'home' | 'ask' | 'chats' | 'analysis' | 'sources' | 'review'

export type NavItemConfig = {
  key: NavKey
  href: string
  icon: LucideIcon
  labelKey: string
}

export const navItems: NavItemConfig[] = [
  { key: 'home', href: '/', icon: House, labelKey: 'nav.home' },
  { key: 'ask', href: '/ask', icon: Sparkles, labelKey: 'nav.ask' },
  { key: 'chats', href: '/chats', icon: MessagesSquare, labelKey: 'nav.chats' },
  { key: 'analysis', href: '/analysis', icon: ChartNoAxesCombined, labelKey: 'nav.analysis' },
  { key: 'sources', href: '/sources', icon: Library, labelKey: 'nav.sources' },
  { key: 'review', href: '/review', icon: UserRoundCheck, labelKey: 'nav.review' },
]
