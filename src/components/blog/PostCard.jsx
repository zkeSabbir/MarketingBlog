import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Heart, Share2, MessageCircle, Flame, Smile } from 'lucide-react'
import { cn, truncate, fmtNum } from '@/lib/utils'

export default function PostCard({ post }) {
  const {
    slug, title, content = '', thumbnail_url,
    profiles, likes_count = 0, views = 0,
    category
  } = post

  const authorName = profiles?.display_name || 'Anonymous'
  const authorUsername = profiles?.username || 'user'
  const authorAvatar = profiles?.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${authorUsername}`
  const snippet = truncate(content, 180)

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header: Author info */}
      <div className="flex justify-between items-center mb-4">
        <Link to={`/vendor/${authorUsername}`} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 border border-rose-200">
            {authorAvatar.includes('dicebear') ? (
              <span className="font-bold text-rose-500 uppercase">{authorName.charAt(0)}</span>
            ) : (
              <img src={authorAvatar} alt={authorName} className="w-full h-full rounded-full object-cover" />
            )}
          </div>
          <div>
            <div className="text-sm font-extrabold text-gray-900 dark:text-gray-100 group-hover:text-rose-500 transition-colors flex items-center gap-1">
              {authorName} <span className="text-blue-500 text-xs">💎</span>
            </div>
            <div className="text-xs text-gray-400">
              Today • {category}
            </div>
          </div>
        </Link>
        <button className="px-4 py-1.5 rounded-full border border-rose-400 text-rose-500 text-xs font-bold hover:bg-rose-50 transition-colors">
          Subscribe
        </button>
      </div>

      {/* Body */}
      <div className="mb-4">
        <Link to={`/post/${slug}`}>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-2 hover:text-rose-500 transition-colors">
            {title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
            Welcome to our deep dive on {title}. When exploring the fascinating world of mindfulness, it becomes clear that taking the right approach... <span className="text-rose-500 font-medium">Read more</span>
          </p>
        </Link>
      </div>

      {/* Thumbnail */}
      <Link to={`/post/${slug}`} className="block mb-4 overflow-hidden rounded-2xl bg-gray-100">
        {thumbnail_url ? (
          <img 
            src={thumbnail_url} 
            alt={title} 
            className="w-full h-auto max-h-96 object-cover hover:opacity-95 transition-opacity"
          />
        ) : (
          <div className="w-full h-48 bg-rose-50 flex items-center justify-center">
            <span className="text-4xl">📄</span>
          </div>
        )}
      </Link>

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1.5 rounded-full">
            <Heart size={14} className="fill-rose-500" /> {fmtNum(likes_count || 1166)}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-500">
            <Flame size={14} className="fill-orange-500" /> {fmtNum(388)}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500">
            <Smile size={14} className="fill-yellow-500" /> {fmtNum(116)}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
          <span className="flex items-center gap-1 hover:text-gray-600 cursor-pointer"><Share2 size={14} /> 49</span>
          <span className="flex items-center gap-1 hover:text-gray-600 cursor-pointer"><MessageCircle size={14} /> 72</span>
          <span className="flex items-center gap-1"><Eye size={14} /> {fmtNum(views || 11100)}</span>
        </div>
      </div>
    </motion.article>
  )
}
