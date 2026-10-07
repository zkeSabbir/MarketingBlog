import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Home, Star, HelpCircle, Trophy, Settings, Heart, Book, Smile, Moon, Wind, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

const MENU = [
  { label: 'Feed', icon: Home, to: '/' },
  { label: 'Experts', icon: Star, to: '/vendors' },
  { label: 'Q&A', icon: HelpCircle, to: '/qa' },
  { label: 'Rankings', icon: Trophy, to: '/leaderboard' },
  { label: 'Services', icon: Settings, to: '/services' },
]

const TOPICS = [
  { label: 'Deep Sleep', icon: Moon, to: '/category/deep-sleep', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { label: 'Meditation', icon: Smile, to: '/category/meditation', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { label: 'Breathwork', icon: Wind, to: '/category/breathwork', color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/20' },
  { label: 'Mindfulness', icon: Leaf, to: '/category/mindfulness', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { label: 'Anxiety Relief', icon: Heart, to: '/category/anxiety-relief', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
]

export default function LeftSidebar() {
  return (
    <aside className="sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto pb-8 pr-4 custom-scrollbar font-sans hidden md:block">
      
      {/* Main Navigation */}
      <div className="mb-6">
        <nav className="space-y-0.5">
          {MENU.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all group',
                isActive 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn(
                "transition-transform",
                isActive ? "text-gray-900 dark:text-white" : "text-gray-500"
              )} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Themes & Topics */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Discover Topics</h3>
        <nav className="space-y-0.5">
          {TOPICS.map(topic => (
            <Link
              key={topic.label}
              to={topic.to}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors", topic.color)}>
                <topic.icon size={14} strokeWidth={2} />
              </div>
              {topic.label}
            </Link>
          ))}
        </nav>
      </div>
      
    </aside>
  )
}
