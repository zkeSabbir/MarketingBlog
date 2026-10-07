import React, { useState, useEffect, useCallback } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { cn, fmtNum } from '@/lib/utils'

export default function LikeDislike({ postId, initialLikes = 0, initialDislikes = 0 }) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [myVote, setMyVote] = useState(null) // 'like' | 'dislike' | null
  const [loading, setLoading] = useState(false)

  // Fetch current user vote
  useEffect(() => {
    if (!user || !postId) return
    supabase
      .from('post_votes')
      .select('vote_type')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => setMyVote(data?.vote_type || null))
  }, [user, postId])

  const vote = useCallback(async (type) => {
    if (!user) {
      alert('Please sign in to vote.')
      return
    }
    if (loading) return
    setLoading(true)

    const prev = myVote

    // Optimistic UI
    if (prev === type) {
      // Toggle off
      setMyVote(null)
      if (type === 'like') setLikes(l => l - 1)
      else setDislikes(d => d - 1)
    } else {
      if (prev === 'like') setLikes(l => l - 1)
      if (prev === 'dislike') setDislikes(d => d - 1)
      setMyVote(type)
      if (type === 'like') setLikes(l => l + 1)
      else setDislikes(d => d + 1)
    }

    // Upsert vote
    if (prev === type) {
      await supabase.from('post_votes').delete()
        .eq('post_id', postId).eq('user_id', user.id)
    } else {
      await supabase.from('post_votes').upsert({
        post_id: postId,
        user_id: user.id,
        vote_type: type,
      }, { onConflict: 'post_id,user_id' })
    }

    setLoading(false)
  }, [user, postId, myVote, loading])

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => vote('like')}
        disabled={loading}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all',
          myVote === 'like'
            ? 'bg-green-500 text-white shadow-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600'
        )}
      >
        <ThumbsUp size={16} className={myVote === 'like' ? 'fill-white' : ''} />
        <span>{fmtNum(likes)}</span>
      </button>

      <button
        onClick={() => vote('dislike')}
        disabled={loading}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all',
          myVote === 'dislike'
            ? 'bg-red-500 text-white shadow-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
        )}
      >
        <ThumbsDown size={16} className={myVote === 'dislike' ? 'fill-white' : ''} />
        <span>{fmtNum(dislikes)}</span>
      </button>
    </div>
  )
}
