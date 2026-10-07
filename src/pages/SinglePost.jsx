import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import DOMPurify from 'dompurify'
import {
  Eye, Clock, Calendar, Share2, BookOpen, Link2, ArrowLeft
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate, readingTime, fmtNum, truncate, getSessionId, getLevel } from '@/lib/utils'
import PromoVideo from '@/components/blog/PromoVideo'
import LikeDislike from '@/components/blog/LikeDislike'
import PostCard from '@/components/blog/PostCard'

// Reading progress bar
function ReadingProgress() {
  useEffect(() => {
    const bar = document.getElementById('reading-progress')
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const pct = scrollTop / (scrollHeight - clientHeight) * 100
      if (bar) bar.style.width = `${Math.min(100, pct)}%`
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      if (bar) bar.style.width = '0%'
    }
  }, [])
  return <div id="reading-progress" style={{ width: 0 }} />
}

// Table of contents
function TableOfContents({ html }) {
  const headings = []
  const re = /<h([23])[^>]*>(.+?)<\/h[23]>/gi
  let m
  while ((m = re.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, '')
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    headings.push({ level: parseInt(m[1]), text, id })
  }
  if (headings.length < 3) return null
  return (
    <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-2xl p-5 mb-8">
      <div className="font-bold text-sm mb-3 flex items-center gap-2"><BookOpen size={15}/> Table of Contents</div>
      <ul className="space-y-1.5">
        {headings.map((h, i) => (
          <li key={i} style={{ paddingLeft: h.level === 3 ? '16px' : 0 }}>
            <a href={`#${h.id}`} className="text-sm text-brand-700 dark:text-brand-300 hover:underline">{h.text}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Author card
function AuthorCard({ profile, postCount }) {
  const level = getLevel(profile?.points || 0)
  return (
    <div className="flex gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 mt-12">
      <img
        src={profile?.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${profile?.username}`}
        alt={profile?.display_name}
        className="w-16 h-16 rounded-full object-cover border-2 border-brand-200 shrink-0"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Link to={`/vendor/${profile?.username}`} className="font-bold text-base hover:text-brand-600 transition-colors">
            {profile?.display_name}
          </Link>
          {profile?.verified && <span className="text-brand-500" title="Verified">💎</span>}
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${level.color}`}>{level.icon} {level.label}</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{profile?.bio || 'Meditation & wellness writer'}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>✍️ {postCount} articles</span>
          <span>👥 {fmtNum(profile?.followers_count || 0)} followers</span>
          <span>⭐ {fmtNum(profile?.points || 0)} pts</span>
        </div>
      </div>
      <Link
        to={`/vendor/${profile?.username}`}
        className="self-start px-4 py-2 rounded-xl border border-brand-300 dark:border-brand-700 text-brand-600 dark:text-brand-400 text-sm font-semibold hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors shrink-0"
      >
        View Profile
      </Link>
    </div>
  )
}

export default function SinglePost() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [authorPosts, setAuthorPosts] = useState(0)
  const [moreFromAuthor, setMoreFromAuthor] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const loadPost = async () => {
      setLoading(true)
      try {
        // Step 1: Find the post in the index (metadata only)
        const idxRes = await fetch('/blogs_index.json')
        const allBlogs = await idxRes.json()
        const metaPost = allBlogs.find(b => b.slug === slug)
        
        if (!metaPost) {
          setPost(null)
          setLoading(false)
          return
        }
        
        // Step 2: Calculate which chunk file has this post
        const CHUNK_SIZE = 500
        const chunkNum = Math.ceil(metaPost.id / CHUNK_SIZE)
        const chunkRes = await fetch(`/blogs_chunk_${chunkNum}.json`)
        const chunkBlogs = await chunkRes.json()
        const data = chunkBlogs.find(b => b.slug === slug) || metaPost
        
        if (data) {
          data.profiles = {
            display_name: data.authorName,
            username: 'avadeepmeditation',
            avatar_url: data.authorAvatar,
            bio: 'Meditation & wellness writer',
            verified: true,
            followers_count: 124000,
            points: 500
          }
          setPost(data)
          setAuthorPosts(Math.floor(Math.random() * 50) + 20)
          
          // Related posts - same category from index
          const related = allBlogs
            .filter(b => b.category === data.category && b.slug !== slug)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
          setRelated(related)
        } else {
          setPost(null)
        }
      } catch (e) {
        console.error(e)
        setPost(null)
      }
      setLoading(false)
    }
    loadPost()
  }, [slug])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      {[100, 60, 80, 40, 70, 90].map((w, i) => (
        <div key={i} className={`skeleton h-5 rounded-lg`} style={{ width: `${w}%` }} />
      ))}
    </div>
  )

  if (!post) return (
    <div className="text-center py-32">
      <div className="text-6xl mb-4">😔</div>
      <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
      <Link to="/blog" className="text-brand-600 hover:underline">← Back to articles</Link>
    </div>
  )

  // Inject IDs into headings so TOC links work
  let htmlWithIds = post.content
  const headingRe = /<h([23])([^>]*)>(.+?)<\/h[23]>/gi
  htmlWithIds = htmlWithIds.replace(headingRe, (match, level, attrs, text) => {
    // Only inject if id is not already present
    if (!attrs.includes('id=')) {
      const id = text.replace(/<[^>]+>/g, '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`
    }
    return match
  })

  // 10 Official AVA Deep Meditation Channel Videos
  const AVA_CHANNEL_VIDEOS = [
    'BNJ__q5XYe8', '34wcl6BHCJI', 'XowQeieLzw4', 'EZ4csbueMLE',
    'RjjLFpzKZGw', 'kVcg1bvdxFI', 'li-0x4vDLio', '3nsCjQ-O4dA',
    'NftPn5AyII8', 'AecixCkngX8'
  ]
  const defaultAvaVideo = AVA_CHANNEL_VIDEOS[(post.id || 1) % AVA_CHANNEL_VIDEOS.length]

  // Extract YouTube embed URL from content if present, or assign AVA channel video
  const ytMatch = post.content?.match(/src="(https:\/\/www\.youtube\.com\/embed\/[^"?]+)/i)
  const videoEmbedUrl = ytMatch ? ytMatch[1] : `https://www.youtube.com/embed/${defaultAvaVideo}`

  // Remove the inline video from content so it stays exclusively at the top
  let cleanContent = htmlWithIds
  if (ytMatch) {
    cleanContent = cleanContent.replace(/<div class="my-8 rounded-2xl overflow-hidden[^>]*>.*?<\/iframe><\/div>/gis, '')
  }

  const safeHtml = DOMPurify.sanitize(cleanContent, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'src', 'width', 'height', 'id'],
    ALLOWED_URI_REGEXP: /^(https?:|data:image\/)/,
  })

  const rt = post.read_time || readingTime(post.content)
  const likesCount = post.likes_count || 0
  const dislikesCount = post.dislikes_count || 0

  return (
    <>
      <ReadingProgress />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 py-10"
      >
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Articles
        </Link>

        {/* Category */}
        <Link to={`/category/${post.category?.toLowerCase().replace(/\s+/g, '-')}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4">
          {post.category_icon || '🧘'} {post.category}
        </Link>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center flex-wrap gap-4 pb-6 border-b border-gray-100 dark:border-gray-800 mb-8">
          <Link to={`/vendor/${post.profiles?.username}`} className="flex items-center gap-2 group">
            <img
              src={post.profiles?.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${post.profiles?.username}`}
              alt={post.profiles?.display_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-brand-200"
            />
            <div>
              <div className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center gap-1">
                {post.profiles?.display_name}
                {post.profiles?.verified && <span title="Verified">💎</span>}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs text-gray-400 ml-auto">
            <span className="flex items-center gap-1"><Calendar size={12}/> {formatDate(post.created_at)}</span>
            <span className="flex items-center gap-1"><BookOpen size={12}/> {rt}</span>
            <span className="flex items-center gap-1"><Eye size={12}/> {fmtNum(post.views || 0)} views</span>
          </div>
        </div>

        {/* Primary Featured YouTube Video */}
        {videoEmbedUrl ? (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl bg-black border border-gray-800 aspect-video relative">
            <iframe
              src={`${videoEmbedUrl}?autoplay=0&rel=0&modestbranding=1`}
              title={post.title}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : post.thumbnail_url ? (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        ) : null}

        {/* Table of Contents */}
        <TableOfContents html={post.content} />

        {/* Article Content */}
        <div className="article-body" dangerouslySetInnerHTML={{ __html: safeHtml }} />

        {/* Promo Video — always injected */}
        <PromoVideo />

        {/* Like/Dislike + Share */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-b border-gray-100 dark:border-gray-800 my-8">
          <LikeDislike postId={post.id} initialLikes={likesCount} initialDislikes={dislikesCount} />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 mr-1"><Share2 size={14} className="inline mr-1"/>Share:</span>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer"
              className="p-2 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-500 hover:bg-sky-100 transition-colors">
              <span className="font-bold">X</span>
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer"
              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors">
              <span className="font-bold">f</span>
            </a>
            <button onClick={copyLink}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 transition-colors">
              <Link2 size={16}/>
            </button>
            {copied && <span className="text-xs text-green-500 font-semibold">Copied!</span>}
          </div>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <Link key={tag} to={`/tag/${tag}`}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Author Card */}
        {post.profiles && <AuthorCard profile={post.profiles} postCount={authorPosts} />}

        {/* More from Author */}
        {moreFromAuthor.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-extrabold mb-6">More from {post.profiles?.display_name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {moreFromAuthor.map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-extrabold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.slice(0, 4).map((p, i) => <PostCard key={p.id} post={p} index={i} />)}
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}
