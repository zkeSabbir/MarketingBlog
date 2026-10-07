import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { TrendingUp, Users, Info, ShieldCheck } from 'lucide-react'

export default function RightSidebar() {
  const [popularExperts, setPopularExperts] = useState([])
  const [popularQuestions, setPopularQuestions] = useState([])

  useEffect(() => {
    async function load() {
      const { data: exp } = await supabase
        .from('posts')
        .select('id, title, slug, views, profiles(display_name, avatar_url, verified)')
        .eq('status', 'published')
        .order('likes_count', { ascending: false })
        .limit(3)
      
      const { data: ques } = await supabase
        .from('posts')
        .select('id, title, slug, views, profiles(display_name, avatar_url)')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(3)

      if (exp) setPopularExperts(exp)
      if (ques) setPopularQuestions(ques)
    }
    load()
  }, [])

  return (
    <aside className="sticky top-[88px] space-y-4">
      
      {/* About Community (Reddit Style) */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="h-10 bg-blue-500 dark:bg-blue-600"></div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 -mt-4 mb-3">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center p-1">
              <div className="w-full h-full bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-xl">🧘</div>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white pt-4 text-base">Deep Meditation</h2>
          </div>
          <p className="text-[13px] text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            A community dedicated to exploring mindfulness, deep sleep, anxiety relief, and the science of inner peace.
          </p>
          <div className="flex items-center gap-6 text-sm mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <div className="font-bold text-gray-900 dark:text-white">124k</div>
              <div className="text-gray-500 text-xs">Members</div>
            </div>
            <div>
              <div className="font-bold text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 541
              </div>
              <div className="text-gray-500 text-xs">Online</div>
            </div>
          </div>
          <a 
            href="https://www.youtube.com/@AVADeepMeditation" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center w-full py-1.5 rounded-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-sm transition-colors mb-2"
          >
            Join on YouTube
          </a>
        </div>
      </div>

      {/* Rules (Reddit Style) */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
          <ShieldCheck size={16} /> Community Rules
        </h3>
        <ol className="space-y-3 text-[13px] text-gray-600 dark:text-gray-400 list-decimal pl-4 font-medium">
          <li className="pl-1">Be respectful and compassionate.</li>
          <li className="pl-1">No medical advice. Consult a professional.</li>
          <li className="pl-1">High-quality posts only. No spam.</li>
          <li className="pl-1">Self-promotion is limited to weekends.</li>
        </ol>
      </div>

      {/* Trending (Quora / Reddit Style) */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500" /> Trending Topics
        </h3>
        <div className="space-y-4">
          {popularExperts.map((post, idx) => (
            <div key={post.id} className="group">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5">
                <span className="text-gray-400">0{idx + 1}</span> • {post.profiles?.display_name} 
                {post.profiles?.verified && <span className="text-blue-500">✔</span>}
              </div>
              <Link to={`/post/${post.slug}`} className="text-[14px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 line-clamp-2 leading-snug transition-colors">
                {post.title}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-gray-400">
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Careers</a>
        <a href="#" className="hover:underline">Terms</a>
        <a href="#" className="hover:underline">Privacy</a>
        <a href="#" className="hover:underline">Acceptable Use</a>
        <div className="w-full mt-1">AVA Deep Meditation © 2024</div>
      </div>

    </aside>
  )
}
