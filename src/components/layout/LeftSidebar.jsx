import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Home, Star, HelpCircle, Trophy, Settings, Heart, Baby, Book, Smile, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

const MENU = [
  { label: 'Home', icon: Home, to: '/' },
  { label: 'Experts', icon: Star, to: '/vendors' },
  { label: 'Q&A', icon: HelpCircle, to: '/qa' },
  { label: 'Rankings', icon: Trophy, to: '/leaderboard' },
  { label: 'Services', icon: Settings, to: '/services' },
]

const TOPICS = [
  { label: 'Deep Sleep', icon: '🌙', to: '/category/deep-sleep' },
  { label: 'Meditation', icon: '🧘', to: '/category/meditation' },
  { label: 'Anxiety Relief', icon: '🌿', to: '/category/anxiety-relief' },
  { label: 'Focus & Study', icon: '📚', to: '/category/focus-study' },
  { label: 'Breathwork', icon: '🌬️', to: '/category/breathwork' },
  { label: 'Mindfulness', icon: '🍃', to: '/category/mindfulness' },
  { label: 'Stress Relief', icon: '💆', to: '/category/stress-relief' },
  { label: 'Sleep Science', icon: '🔬', to: '/category/sleep-science' },
]

export default function LeftSidebar() {
  return (
    <aside className="sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto pb-8 pr-4 custom-scrollbar">
      
      {/* Main Menu */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <nav className="space-y-1">
          {MENU.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              <item.icon size={18} className={cn(item.label === 'Home' && 'text-rose-400')} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Themes & Topics */}
      <div className="px-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Themes & Topics</h3>
        <nav className="space-y-0.5">
          {TOPICS.map(topic => (
            <Link
              key={topic.label}
              to={topic.to}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-lg w-6 text-center">{topic.icon}</span>
              {topic.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
