import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import SearchModal from '@/components/search/SearchModal'

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="h-full max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 w-48 shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-rose-400 text-2xl">🌸</span>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight">Deep Meditation</span>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <button 
              onClick={() => setSearchOpen(true)}
              className="w-full h-10 px-4 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <Search size={16} />
              <span className="text-sm font-medium">Search topics, videos, meditation...</span>
            </button>
          </div>

          {/* Right: Empty placeholder to balance layout */}
          <div className="flex items-center justify-end gap-3 w-auto md:w-48 shrink-0">
            <a 
              href="https://www.youtube.com/@AVADeepMeditation" 
              target="_blank" 
              rel="noreferrer"
              className="px-5 py-2 rounded-full bg-red-600 text-white text-sm font-bold shadow hover:bg-red-700 transition-colors"
            >
              Subscribe
            </a>
          </div>
          
        </div>
      </header>
    </>
  )
}
