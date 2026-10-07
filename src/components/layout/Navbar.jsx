import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Bell, MessageSquare, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import SearchModal from '@/components/search/SearchModal'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
          
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

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 w-auto md:w-64 shrink-0">
            <Link 
              to="/dashboard/new" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-rose-400 text-white text-sm font-bold shadow-sm hover:bg-rose-500 transition-colors"
            >
              <Plus size={16} /> New Post
            </Link>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2"
                >
                  <img 
                    src={profile?.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${user.email}`} 
                    alt="User" 
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                  <ChevronDown size={14} className="text-gray-500" />
                </button>
                
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropOpen(false)}>Dashboard</Link>
                    <Link to={`/vendor/${profile?.username}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropOpen(false)}>My Profile</Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={() => {signOut(); setDropOpen(false)}} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-5 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold shadow hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
          
        </div>
      </header>
    </>
  )
}
