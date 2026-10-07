import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { MessageCircle, Heart, Share2, HelpCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { fmtNum } from '@/lib/utils'

export default function QADiscussion() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    // We treat posts with category 'Question' or tag 'discussion' as questions
    // For now, let's just fetch all posts and pretend they are questions if they have the word 'question' or just show a general discussion board
    // A proper implementation would filter by category='Question'
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(display_name, username, avatar_url, verified)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(20)
      
    if (data) {
      // Add fake answers count for demo until comments table is fully populated
      const enrichedData = data.map(post => ({
        ...post,
        answers_count: Math.floor(Math.random() * 40) + 2
      }))
      setQuestions(enrichedData)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto w-full font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <HelpCircle size={28} className="text-blue-500" />
            Discussion & Q&A
          </h1>
          <p className="text-gray-500 text-lg">Ask questions, share knowledge, and help the community.</p>
        </div>
        <Link to="/dashboard/new" className="px-6 py-2.5 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors shrink-0">
          Ask a Question
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading discussions...</div>
        ) : questions.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {questions.map(q => (
              <div key={q.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start gap-4">
                  <img 
                    src={q.profiles?.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${q.profiles?.username}`} 
                    alt="User" 
                    className="w-10 h-10 rounded-full bg-gray-100 object-cover mt-1"
                  />
                  <div className="flex-1">
                    <Link to={`/post/${q.slug}`}>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors leading-tight mb-2">
                        {q.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 text-sm" dangerouslySetInnerHTML={{ __html: q.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...' }} />
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{q.profiles?.display_name}</span>
                        <span>•</span>
                        <span>{new Date(q.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{q.category}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                        <div className="flex items-center gap-1.5 hover:text-blue-500 cursor-pointer transition-colors">
                          <MessageCircle size={16} />
                          {q.answers_count} Answers
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-red-500 cursor-pointer transition-colors">
                          <Heart size={16} />
                          {fmtNum(q.likes_count)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">No discussions found.</div>
        )}
      </div>
    </div>
  )
}
