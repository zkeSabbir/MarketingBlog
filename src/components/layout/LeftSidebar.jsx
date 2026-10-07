import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Home, Star, HelpCircle, Trophy, Settings, Heart, Book, Smile, Moon, Wind, Leaf, Activity, Music, Sun, Zap, Navigation, Speaker, Coffee, ZapOff, Fingerprint, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

const MENU = [
  { label: 'Feed', icon: Home, to: '/' },
  { label: 'Experts', icon: Star, to: '/vendors' },
  { label: 'Q&A', icon: HelpCircle, to: '/qa' },
  { label: 'Rankings', icon: Trophy, to: '/leaderboard' },
  { label: 'Services', icon: Settings, to: '/services' },
]

const TOPICS = [
  { label: 'Deep Sleep', icon: Moon, to: '/category/deep-sleep', color: 'text-indigo-500' },
  { label: 'Meditation', icon: Smile, to: '/category/meditation', color: 'text-teal-500' },
  { label: 'Breathwork', icon: Wind, to: '/category/breathwork', color: 'text-sky-500' },
  { label: 'Mindfulness', icon: Leaf, to: '/category/mindfulness', color: 'text-emerald-500' },
  { label: 'Anxiety Relief', icon: Heart, to: '/category/anxiety-relief', color: 'text-rose-500' },
  { label: 'Focus & Study', icon: Book, to: '/category/focus-study', color: 'text-blue-500' },
  { label: 'Stress Relief', icon: Coffee, to: '/category/stress-relief', color: 'text-amber-500' },
  { label: 'Self Care', icon: Heart, to: '/category/self-care', color: 'text-pink-500' },
  { label: 'Yoga', icon: Activity, to: '/category/yoga', color: 'text-orange-500' },
  { label: 'Zen Living', icon: Home, to: '/category/zen-living', color: 'text-gray-500' },
  { label: 'Binaural Beats', icon: Speaker, to: '/category/binaural-beats', color: 'text-purple-500' },
  { label: 'Sound Healing', icon: Music, to: '/category/sound-healing', color: 'text-cyan-500' },
  { label: 'Productivity', icon: Zap, to: '/category/productivity', color: 'text-yellow-500' },
  { label: 'Mental Health', icon: Heart, to: '/category/mental-health', color: 'text-red-500' },
  { label: 'Relaxation', icon: Sun, to: '/category/relaxation', color: 'text-orange-400' },
  { label: 'Energy Healing', icon: ZapOff, to: '/category/energy-healing', color: 'text-indigo-400' },
  { label: 'Spiritual Growth', icon: Navigation, to: '/category/spiritual-growth', color: 'text-emerald-400' },
  { label: 'Manifestation', icon: Fingerprint, to: '/category/manifestation', color: 'text-fuchsia-500' },
  { label: 'Chakra Alignment', icon: Activity, to: '/category/chakra-alignment', color: 'text-rose-400' },
  { label: 'Lucid Dreaming', icon: Eye, to: '/category/lucid-dreaming', color: 'text-purple-400' },
]

export default function LeftSidebar() {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    // Fetch from blogs_index.json which contains all 17,955 posts
    fetch('/blogs_index.json')
      .then(res => res.json())
      .then(data => {
        const c = {}
        data.forEach(post => {
          if (!post.category) return
          const slug = post.category.toLowerCase().replace(/\s+/g, '-')
          c[slug] = (c[slug] || 0) + 1
        })
        setCounts(c)
      })
      .catch(err => console.error("Could not load counts", err))
  }, [])

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
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={cn(
                    "transition-transform",
                    isActive ? "text-gray-900 dark:text-white" : "text-gray-500"
                  )} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Themes & Topics */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">Discover Topics</h3>
        <nav className="space-y-0.5">
          {TOPICS.map(topic => {
            const slug = topic.to.split('/').pop()
            const count = counts[slug] || 0
            
            return (
              <Link
                key={topic.label}
                to={topic.to}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-[14px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors", topic.color)}>
                    <topic.icon size={14} strokeWidth={2} />
                  </div>
                  <span className="truncate max-w-[120px]">{topic.label}</span>
                </div>
                {count > 0 && (
                  <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full transition-colors">
                    {count.toLocaleString()}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
      
    </aside>
  )
}
