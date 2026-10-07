import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import PostCard from '@/components/blog/PostCard'
import { HelpCircle, FileText, Image as ImageIcon } from 'lucide-react'

export default function Home() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('new') // 'new', 'popular', 'discussed'

  useEffect(() => {
    loadPosts(tab)
  }, [tab])

  const loadPosts = async (currentTab) => {
    setLoading(true)
    // Order by views if available, else fallback safely (depends on schema version)
    let query = supabase
      .from('posts')
      .select('*, profiles(display_name, username, avatar_url, verified)')
      .eq('status', 'published')
      
    if (currentTab === 'new') {
      query = query.order('created_at', { ascending: false })
    } else if (currentTab === 'popular') {
      // Fallback handle for both old 'views' and new 'views_count'
      query = query.order('views', { ascending: false })
    } else {
      query = query.order('likes_count', { ascending: false })
    }

    const { data } = await query.limit(10)
    if (data) setPosts(data)
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto w-full font-sans pb-20">
      
      {/* Quora-style Create Box */}
      {user && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6 overflow-hidden">
          <div className="p-4 flex gap-3">
            <img 
              src={profile?.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${user.email}`} 
              alt="User" 
              className="w-10 h-10 rounded-full border border-gray-200 object-cover shrink-0"
            />
            <button 
              onClick={() => navigate('/dashboard/new')}
              className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-left px-4 rounded-full text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors"
            >
              What do you want to ask or share with the community?
            </button>
          </div>
          
          <div className="flex items-center px-4 py-2 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => navigate('/qa')} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors">
              <HelpCircle size={18} className="text-blue-500" /> Ask
            </button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <button onClick={() => navigate('/dashboard/new')} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors">
              <FileText size={18} className="text-teal-500" /> Article
            </button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <button onClick={() => navigate('/dashboard/new')} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors">
              <ImageIcon size={18} className="text-amber-500" /> Media
            </button>
          </div>
        </div>
      )}

      {/* Quora-style Tabs */}
      <div className="flex items-center gap-1 mb-4">
        <button 
          onClick={() => setTab('new')}
          className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${tab === 'new' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        >
          Recent
        </button>
        <button 
          onClick={() => setTab('popular')}
          className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${tab === 'popular' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        >
          Popular
        </button>
        <button 
          onClick={() => setTab('discussed')}
          className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${tab === 'discussed' ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
        >
          Discussed
        </button>
      </div>

      <div className="w-full h-px bg-gray-200 dark:bg-gray-800 mb-6"></div>

      {/* Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">No posts yet</h3>
            <p className="text-sm">Be the first to share something with the community.</p>
          </div>
        )}
      </div>
    </div>
  )
}
