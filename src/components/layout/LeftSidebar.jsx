import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, ChevronDown, Folder, Hammer, Receipt, Settings, Edit3, LayoutTemplate, Star, MessageSquare, Trophy, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

const MENU = [
  { label: 'Feed & Projects', icon: Folder, to: '/' },
  { label: 'Experts & Services', icon: Hammer, to: '/vendors' },
  { label: 'Discussions', icon: MessageSquare, to: '/qa' },
  { label: 'Rankings & Usage', icon: Receipt, to: '/leaderboard' },
  { label: 'Site Settings', icon: Settings, to: '/settings' },
  { label: 'Visual editor dashboard', icon: Edit3, to: '/editor' },
]

export default function LeftSidebar() {
  return (
    <aside className="sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto pb-8 pr-6 custom-scrollbar font-sans">
      
      {/* Netlify-style Search Bar */}
      <div className="relative mb-4 group cursor-text">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-500" />
        </div>
        <input 
          type="text" 
          placeholder="Search topics, posts..." 
          className="w-full bg-gray-100 hover:bg-gray-200/80 focus:bg-white dark:bg-gray-900 border border-transparent focus:border-teal-500 rounded-lg py-2 pl-9 pr-12 text-sm text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-500"
        />
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <span className="text-[11px] font-medium text-gray-500 bg-white/50 px-1.5 py-0.5 rounded border border-gray-200">CtrlK</span>
        </div>
      </div>

      {/* Netlify-style Team/User Picker */}
      <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#20c997] text-white flex items-center justify-center text-xs font-bold">
            S
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Sabbir Hossen</span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded">
          <ChevronDown size={14} className="text-gray-500" />
        </div>
      </div>

      {/* Main Navigation (Netlify Flat Style) */}
      <nav className="space-y-0.5 mb-8">
        {MENU.map(item => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors',
              isActive 
                ? 'bg-[#f0f9f8] dark:bg-teal-900/20 text-[#00a29c] font-semibold' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <item.icon size={18} className={cn(
              "shrink-0",
              // isActive ? 'text-[#00a29c]' : 'text-gray-500' // Uncomment if you want colored icons
            )} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Themes & Topics (Matches the Netlify flat style) */}
      <div className="px-3">
        <h3 className="text-xs font-semibold text-gray-500 mb-3">Topics</h3>
        <nav className="space-y-0.5">
          <Link to="/category/deep-sleep" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            <Moon size={18} className="text-gray-500" /> Deep Sleep
          </Link>
          <Link to="/category/meditation" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            <LayoutTemplate size={18} className="text-gray-500" /> Meditation
          </Link>
          <Link to="/category/mindfulness" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium text-gray-600 hover:bg-gray-100 transition-colors">
            <Heart size={18} className="text-gray-500" /> Mindfulness
          </Link>
        </nav>
      </div>
      
    </aside>
  )
}

function Moon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
}
