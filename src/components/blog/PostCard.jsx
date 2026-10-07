import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreHorizontal, CheckCircle2 } from 'lucide-react'
import { cn, truncate, fmtNum, formatDate } from '@/lib/utils'

export default function PostCard({ post }) {
  const {
    slug, title, content = '', thumbnail_url,
    profiles, likes_count = 0, views = 0, views_count = 0,
    category, created_at
  } = post

  const authorName = profiles?.display_name || 'Anonymous'
  const authorUsername = profiles?.username || 'user'
  const authorAvatar = profiles?.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${authorUsername}`
  
  // Extract text from HTML content for the snippet
  const extractText = (html) => {
    const span = document.createElement('span')
    span.innerHTML = html
    return span.textContent || span.innerText || ''
  }
  const snippet = truncate(extractText(content), 200)
  
  const totalViews = views || views_count || 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm"
    >
      {/* Header: Author Info (Quora style) */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2.5">
          <Link to={`/vendor/${authorUsername}`} className="shrink-0 mt-0.5">
            <img 
              src={authorAvatar} 
              alt={authorName} 
              className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-800 hover:opacity-90 transition-opacity" 
            />
          </Link>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link to={`/vendor/${authorUsername}`} className="font-bold text-[15px] text-gray-900 dark:text-gray-100 hover:underline">
                {authorName}
              </Link>
              {profiles?.verified && <CheckCircle2 size={14} className="text-blue-500 fill-blue-500/20" />}
              <span className="text-gray-500 text-sm hidden sm:inline">•</span>
              <span className="text-blue-600 dark:text-blue-400 text-[13px] hover:underline cursor-pointer font-medium">Follow</span>
            </div>
            <div className="text-[13px] text-gray-500 mt-0.5 flex items-center gap-1.5">
              <span>Practitioner in {category}</span>
              <span>•</span>
              <span>{formatDate(created_at)}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Body: Title and Content */}
      <div className="mb-3">
        <Link to={`/post/${slug}`} className="block group">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug mb-1.5 group-hover:underline">
            {title}
          </h2>
          {snippet && (
            <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed font-serif">
              {snippet}... <span className="text-blue-600 font-sans text-[14px] hover:underline">Read more</span>
            </p>
          )}
        </Link>
      </div>

      {/* Optional Thumbnail */}
      {thumbnail_url && (
        <Link to={`/post/${slug}`} className="block mb-4 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
          <img 
            src={thumbnail_url} 
            alt={title} 
            className="w-full h-auto max-h-[400px] object-cover hover:opacity-95 transition-opacity"
          />
        </Link>
      )}

      {/* Action Bar (Quora Style Pill Buttons) */}
      <div className="flex items-center justify-between mt-2 pt-1">
        <div className="flex items-center gap-2">
          
          {/* Upvote / Downvote Pill */}
          <div className="flex items-center bg-gray-100/80 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
            <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-full text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors">
              <ArrowBigUp size={20} strokeWidth={1.5} />
              <span>{fmtNum(likes_count || 0)}</span>
            </button>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
            <button className="px-2.5 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-full text-gray-600 dark:text-gray-300 transition-colors">
              <ArrowBigDown size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Comments (Visual only) */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors cursor-default" onClick={e => e.preventDefault()}>
            <MessageSquare size={18} strokeWidth={1.5} />
            <span>{(post.id * 13) % 150 + 5}</span>
          </button>

          {/* Share */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(window.location.origin + '/post/' + slug);
              alert('Link copied to clipboard!');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-300 transition-colors hidden sm:flex"
          >
            <Share2 size={18} strokeWidth={1.5} />
            <span>Share</span>
          </button>
        </div>

        <div className="text-[13px] font-medium text-gray-500 px-2">
          {fmtNum(totalViews)} views
        </div>
      </div>
    </motion.article>
  )
}
