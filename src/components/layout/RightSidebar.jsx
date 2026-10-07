import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function RightSidebar() {
  const [popularExperts, setPopularExperts] = useState([])
  const [popularQuestions, setPopularQuestions] = useState([])

  useEffect(() => {
    async function load() {
      // Fetch popular experts posts
      const { data: exp } = await supabase
        .from('posts')
        .select('id, title, slug, views, profiles(display_name, avatar_url, verified)')
        .eq('status', 'published')
        .order('likes_count', { ascending: false })
        .limit(2)
      
      // Fetch popular questions/posts
      const { data: ques } = await supabase
        .from('posts')
        .select('id, title, slug, views, profiles(display_name, avatar_url)')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(2)

      if (exp) setPopularExperts(exp)
      if (ques) setPopularQuestions(ques)
    }
    load()
  }, [])

  return (
    <aside className="sticky top-[88px] space-y-6">
      
      {/* Promo Box */}
      <div className="bg-rose-100 dark:bg-rose-900/30 rounded-2xl p-5">
        <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 text-base">AVADeepMeditation</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          Subscribe to our YouTube channel for daily deep sleep and meditation sounds.
        </p>
        <a 
          href="https://www.youtube.com/@AVADeepMeditation" 
          target="_blank" 
          rel="noreferrer"
          className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors"
        >
          Visit Channel
        </a>
      </div>

      {/* Popular from Experts */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="font-extrabold text-gray-900 dark:text-white mb-4 text-sm">Popular from Experts</h3>
        <div className="space-y-4">
          {popularExperts.map(post => (
            <div key={post.id}>
              <div className="text-xs font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-1">
                {post.profiles?.display_name} {post.profiles?.verified && <span className="text-rose-400">💎</span>}
              </div>
              <Link to={`/post/${post.slug}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 line-clamp-2 leading-snug transition-colors">
                {post.title}
              </Link>
              <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                👁️ {post.views}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Questions */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="font-extrabold text-gray-900 dark:text-white mb-4 text-sm">Popular Questions</h3>
        <div className="space-y-4">
          {popularQuestions.map(post => (
            <div key={post.id}>
              <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                {post.profiles?.display_name}
              </div>
              <Link to={`/post/${post.slug}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 line-clamp-2 leading-snug transition-colors">
                {post.title}
              </Link>
              <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                👁️ {post.views}
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 rounded-xl bg-green-400/90 text-white font-bold text-sm hover:bg-green-500 transition-colors">
          ? Ask a Question
        </button>
      </div>

    </aside>
  )
}
