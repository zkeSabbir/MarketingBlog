import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import PostCard from '@/components/blog/PostCard'
import { HelpCircle, FileText, Image as ImageIcon } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('new') // 'new', 'popular', 'discussed'

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const res = await fetch('/blogs.json')
        let data = await res.json()
        
        // Sorting logic based on tab
        if (tab === 'new') {
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        } else if (tab === 'popular') {
          data.sort((a, b) => b.views - a.views)
        } else {
          data.sort((a, b) => b.likes_count - a.likes_count)
        }
        
        setPosts(data)
      } catch (e) {
        console.error("Failed to load blogs", e)
      }
      setLoading(false)
    }
    
    fetchBlogs()
  }, [tab])

  return (
    <div className="max-w-2xl mx-auto w-full font-sans pb-20">
      
      {/* Feed Title */}
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Latest Articles</h1>

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
