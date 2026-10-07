import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Settings, BarChart3, FileText, CheckCircle2, Clock, MoreVertical, Edit3, Trash2, Eye, Heart, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate, fmtNum, getLevel } from '@/lib/utils'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState({ views: 0, likes: 0, posts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)
    
    // Fallback to views_count if views is null/missing in some rows
    const { data: myPosts } = await supabase
      .from('posts')
      .select('id, title, slug, status, created_at, views, likes_count')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      
    if (myPosts) {
      setPosts(myPosts)
      
      const totalViews = myPosts.reduce((sum, p) => sum + (p.views || 0), 0)
      const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes_count || 0), 0)
      
      setStats({
        views: totalViews,
        likes: totalLikes,
        posts: myPosts.length
      })
    }
    
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) return
    await supabase.from('posts').delete().eq('id', id)
    setPosts(posts.filter(p => p.id !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
    </div>
  )

  const level = getLevel(profile?.points || 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Creator Studio</h1>
          <p className="text-gray-500 text-base">Manage your content, view analytics, and grow your audience.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/settings" className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm">
            <Settings size={18} /> Settings
          </Link>
          <Link to="/dashboard/new" className="px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-all flex items-center gap-2 shadow-sm shadow-teal-500/20">
            <Plus size={18} /> Create Article
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Points Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrophyIcon size={64} className="text-amber-500" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${level.color}`}>{level.label}</span>
          </div>
          <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{fmtNum(profile?.points || 0)}</div>
          <div className="text-sm font-medium text-gray-500 mt-2">Total Reputation Points</div>
        </div>
        
        {/* Views Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Eye size={64} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600"><BarChart3 size={18} /></div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Views</span>
          </div>
          <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{fmtNum(stats.views)}</div>
          <div className="text-sm font-medium text-green-500 mt-2 flex items-center gap-1"><TrendingUp size={14}/> +12% this week</div>
        </div>
        
        {/* Likes Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Heart size={64} className="text-rose-500" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600"><Heart size={18} /></div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Likes Received</span>
          </div>
          <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{fmtNum(stats.likes)}</div>
          <div className="text-sm font-medium text-gray-500 mt-2">+2 pts per like</div>
        </div>
        
        {/* Posts Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={64} className="text-teal-500" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-teal-600"><FileText size={18} /></div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Published</span>
          </div>
          <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{stats.posts}</div>
          <div className="text-sm font-medium text-gray-500 mt-2">Articles & Resources</div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">Content Library</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No articles published yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Share your knowledge with the world. Create your first article to start building your audience.</p>
            <Link to="/dashboard/new" className="inline-flex px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
              Create First Article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Article</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Performance</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link to={`/post/${post.slug}`} className="font-semibold text-gray-900 dark:text-gray-100 hover:text-teal-600 transition-colors block max-w-md truncate text-base">
                        {post.title}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-md">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      {post.status === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 px-2.5 py-1 rounded-md text-xs font-semibold">
                          <CheckCircle2 size={14} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 px-2.5 py-1 rounded-md text-xs font-semibold">
                          <Clock size={14} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-4 text-gray-500">
                        <span className="flex items-center gap-1.5" title="Views"><Eye size={16}/> {fmtNum(post.views || 0)}</span>
                        <span className="flex items-center gap-1.5" title="Likes"><Heart size={16}/> {fmtNum(post.likes_count)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/dashboard/edit/${post.id}`} className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="Edit">
                          <Edit3 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function TrophyIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
}
