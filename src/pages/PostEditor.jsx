import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Save, Image as ImageIcon, ArrowLeft, Loader2, Info, LayoutTemplate, Tag, Globe, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import TipTapEditor from '@/components/editor/TipTapEditor'
import { slugify } from '@/lib/utils'

const CATEGORIES = [
  'Deep Sleep', 'Meditation', 'Anxiety Relief', 'Focus & Study',
  'Breathwork', 'Mindfulness', 'Stress Relief', 'Sleep Science'
]

export default function PostEditor() {
  const { id } = useParams()
  const isEdit = !!id
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [status, setStatus] = useState('draft')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (isEdit) loadPost()
  }, [user, id])

  const loadPost = async () => {
    const { data, error: err } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('author_id', user.id)
      .single()
      
    if (err || !data) {
      navigate('/dashboard')
      return
    }
    
    setTitle(data.title)
    setContent(data.content || '')
    setCategory(data.category)
    setThumbnailUrl(data.thumbnail_url || '')
    setTagsInput((data.tags || []).join(', '))
    setStatus(data.status)
    setLoading(false)
  }

  const handleSave = async (publishStatus) => {
    if (!title.trim()) { setError('Please provide a catchy title for your article.'); return }
    if (!content.trim() || content === '<p></p>') { setError('Article content cannot be empty.'); return }
    
    setError('')
    setSaving(true)
    
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const slug = slugify(title) + '-' + Math.random().toString(36).substr(2, 5)
    
    const postData = {
      title: title.trim(),
      content,
      category,
      thumbnail_url: thumbnailUrl || null,
      tags,
      status: publishStatus,
      author_id: user.id
    }
    
    if (isEdit) {
      postData.updated_at = new Date().toISOString()
      const { error: err } = await supabase.from('posts').update(postData).eq('id', id)
      setSaving(false)
      if (err) setError(err.message)
      else navigate('/dashboard')
    } else {
      postData.slug = slug
      const { error: err } = await supabase.from('posts').insert([postData])
      setSaving(false)
      if (err) setError(err.message)
      else navigate('/dashboard')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-gray-950">
      <Loader2 size={32} className="animate-spin text-teal-600" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 font-sans pb-20">
      
      {/* Premium Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {isEdit ? 'Editing Article' : 'Drafting New Article'}
              </span>
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                {status === 'published' ? 'Published' : 'Unsaved Draft'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSave('draft')} 
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button 
              onClick={() => handleSave('published')} 
              disabled={saving}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-teal-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {isEdit && status === 'published' ? 'Update Live Article' : 'Publish Article'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-3 font-medium text-sm">
            <Info size={18} /> {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Editor Area */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800 overflow-hidden">
              <div className="p-8 md:p-12">
                <input 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Catchy Article Title..." 
                  className="w-full text-4xl md:text-5xl font-black bg-transparent outline-none pb-6 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 leading-tight"
                />
                <div className="prose-container mt-4">
                  <TipTapEditor value={content} onChange={setContent} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Settings */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            
            {/* SEO & Cover Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200/60 dark:border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <ImageIcon size={14} /> Cover Image
              </h3>
              
              <div className="space-y-4">
                {thumbnailUrl ? (
                  <div className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-200">
                    <img src={thumbnailUrl} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => setThumbnailUrl('')} className="text-white text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-xs font-medium">No cover image</span>
                  </div>
                )}
                
                <div>
                  <input 
                    value={thumbnailUrl}
                    onChange={e => setThumbnailUrl(e.target.value)}
                    placeholder="Paste image URL here..." 
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Meta Data Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200/60 dark:border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <LayoutTemplate size={14} /> Classification
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Primary Category</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm outline-none focus:border-teal-500 appearance-none font-medium text-gray-800 cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Tag size={14} /> Search Tags
                  </label>
                  <input 
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="sleep, meditation, guide" 
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm outline-none focus:border-teal-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-2">Comma separated keywords help users find your article faster.</p>
                </div>
              </div>
            </div>

            {/* Visibility Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200/60 dark:border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Visibility</h3>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900">
                <Globe size={18} className="text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-teal-900 dark:text-teal-400">Public Access</h4>
                  <p className="text-xs text-teal-700 dark:text-teal-500/80 mt-1 leading-relaxed">Once published, this article will be available to all readers and indexed for search engines.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
