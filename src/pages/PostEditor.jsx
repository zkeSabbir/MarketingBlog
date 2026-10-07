import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Save, Image as ImageIcon, ArrowLeft, Loader2, Info } from 'lucide-react'
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
    if (!title.trim()) { setError('Title is required'); return }
    if (!content.trim() || content === '<p></p>') { setError('Content is required'); return }
    
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
      // New post: points logic would typically go here or in a database trigger
      const { error: err } = await supabase.from('posts').insert([postData])
      setSaving(false)
      if (err) setError(err.message)
      else navigate('/dashboard')
    }
  }

  if (loading) return <div className="p-12 text-center">Loading editor...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Article' : 'New Article'}
        </h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave('draft')} 
            disabled={saving}
            className="px-5 py-2.5 rounded-xl font-semibold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave('published')} 
            disabled={saving}
            className="px-5 py-2.5 rounded-xl font-bold gradient-bg text-white shadow hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18} />}
            {isEdit && status === 'published' ? 'Update Post' : 'Publish (+10 pts)'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
          <Info size={18} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Article Title..." 
              className="w-full text-4xl font-extrabold bg-transparent outline-none border-b border-transparent focus:border-brand-200 pb-2 transition-colors placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          {/* Editor */}
          <div>
            <TipTapEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-4">Post Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:border-brand-400"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Thumbnail URL (Optional)</label>
                <div className="flex gap-2">
                  <input 
                    value={thumbnailUrl}
                    onChange={e => setThumbnailUrl(e.target.value)}
                    placeholder="https://..." 
                    className="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-brand-400"
                  />
                </div>
                {thumbnailUrl && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma separated)</label>
                <input 
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="sleep, meditation, guide" 
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-brand-400"
                />
              </div>
            </div>
          </div>
          
          <div className="p-5 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800">
            <h4 className="font-bold text-brand-800 dark:text-brand-300 text-sm flex items-center gap-2 mb-2">
              <Info size={16} /> Promo Video Note
            </h4>
            <p className="text-xs text-brand-700 dark:text-brand-400 leading-relaxed">
              The AVA Deep Meditation promotional video will be automatically injected into your article when published. You don't need to add it manually.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
