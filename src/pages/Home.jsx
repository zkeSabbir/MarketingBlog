import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import PostCard from '@/components/blog/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('new') // 'new', 'popular', 'discussed'

  useEffect(() => {
    loadPosts(tab)
  }, [tab])

  const loadPosts = async (currentTab) => {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select('*, profiles(display_name, username, avatar_url, verified)')
      .eq('status', 'published')
      
    if (currentTab === 'new') {
      query = query.order('created_at', { ascending: false })
    } else if (currentTab === 'popular') {
      query = query.order('views', { ascending: false })
    } else {
      query = query.order('likes_count', { ascending: false })
    }

    const { data } = await query.limit(10)
    if (data) setPosts(data)
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800 mb-6 px-2">
        <button 
          onClick={() => setTab('new')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${tab === 'new' ? 'border-green-400 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          New
        </button>
        <button 
          onClick={() => setTab('popular')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${tab === 'popular' ? 'border-green-400 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Popular
        </button>
        <button 
          onClick={() => setTab('discussed')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${tab === 'discussed' ? 'border-green-400 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Discussed
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-12 text-center text-gray-400 font-medium">Loading feed...</div>
        ) : posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="p-12 text-center text-gray-400 font-medium">No posts found.</div>
        )}
      </div>
    </div>
  )
}
