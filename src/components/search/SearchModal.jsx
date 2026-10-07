import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { debounce, highlight, truncate } from '@/lib/utils'

const MAX_RECENT = 5

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ava_recent_searches') || '[]') }
    catch { return [] }
  })
  const [popular, setPopular] = useState([])
  const inputRef = useRef(null)

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [open])

  // Load popular posts
  useEffect(() => {
    if (!open) return
    supabase
      .from('posts')
      .select('id, title, slug, category')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(5)
      .then(({ data }) => setPopular(data || []))
  }, [open])

  // Debounced search
  const search = useCallback(
    debounce(async (q) => {
      if (q.trim().length < 2) { setResults([]); return }
      setLoading(true)
      const { data } = await supabase
        .from('posts')
        .select('id, title, slug, category, thumbnail_url, profiles(display_name, username)')
        .eq('status', 'published')
        .or(`title.ilike.%${q}%,category.ilike.%${q}%,tags.cs.{${q}}`)
        .limit(8)
      setResults(data || [])
      setLoading(false)
    }, 250),
    []
  )

  useEffect(() => { search(query) }, [query, search])

  const saveRecent = (term) => {
    if (!term.trim()) return
    const updated = [term, ...recent.filter(r => r !== term)].slice(0, MAX_RECENT)
    setRecent(updated)
    localStorage.setItem('ava_recent_searches', JSON.stringify(updated))
  }

  const handleSelect = (title) => {
    saveRecent(query || title)
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) saveRecent(query.trim())
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl glass-heavy rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search articles, categories, authors…"
                className="flex-1 bg-transparent text-base outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
              />
              {loading && (
                <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
              )}
              {query && (
                <button type="button" onClick={() => setQuery('')} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X size={16} className="text-gray-400" />
                </button>
              )}
              <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 text-xs border border-gray-200 dark:border-gray-700 px-2">Esc</button>
            </form>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {/* Search Results */}
              {results.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">Results</div>
                  {results.map(post => (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug}`}
                      onClick={() => handleSelect(post.title)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-brand-200 to-brand-400 shrink-0 flex items-center justify-center">
                        {post.thumbnail_url
                          ? <img src={post.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          : <span className="text-lg">📄</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate"
                          dangerouslySetInnerHTML={{ __html: highlight(post.title, query) }}
                        />
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded text-[10px] font-semibold">{post.category}</span>
                          <span>{post.profiles?.display_name}</span>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              )}

              {/* No results */}
              {query.length >= 2 && !loading && results.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🔍</div>
                  <div className="text-sm font-medium text-gray-500">No results for "{query}"</div>
                  <div className="text-xs text-gray-400 mt-1">Try different keywords</div>
                </div>
              )}

              {/* Default state */}
              {!query && (
                <div className="space-y-4 py-2">
                  {recent.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between px-3 py-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1"><Clock size={12}/> Recent</span>
                        <button onClick={() => { setRecent([]); localStorage.removeItem('ava_recent_searches') }} className="text-xs text-gray-400 hover:text-red-500">Clear</button>
                      </div>
                      {recent.map(r => (
                        <button key={r} onClick={() => setQuery(r)} className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 text-left">
                          <Clock size={14} className="text-gray-300 shrink-0" /> {r}
                        </button>
                      ))}
                    </div>
                  )}

                  {popular.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                        <TrendingUp size={12}/> Popular Articles
                      </div>
                      {popular.map(post => (
                        <Link key={post.id} to={`/post/${post.slug}`} onClick={() => { saveRecent(post.title); onClose() }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <TrendingUp size={14} className="text-brand-400 shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{post.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
