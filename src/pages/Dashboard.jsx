import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Settings, BarChart2, FileText, CheckCircle, Clock } from 'lucide-react'
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
    
    // Load user's posts
    const { data: myPosts } = await supabase
      .from('posts')
      .select('id, title, slug, status, created_at, views, likes_count')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
      
    if (myPosts) {
      setPosts(myPosts)
      
      // Calculate stats
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
    if (!confirm('Are you sure you want to delete this post?')) return
    
    await supabase.from('posts').delete().eq('id', id)
    setPosts(posts.filter(p => p.id !== id))
    
    // Could also adjust points down, but maybe too complex for simple delete
  }

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>

  const level = getLevel(profile?.points || 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Vendor Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, {profile?.display_name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/settings" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <Settings size={16} /> Settings
          </Link>
          <Link to="/dashboard/new" className="px-4 py-2 rounded-xl gradient-bg text-white font-bold shadow hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus size={16} /> New Post
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your Level</div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${level.color}`}>{level.icon} {level.label}</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold gradient-text">{fmtNum(profile?.points || 0)}</div>
            <div className="text-xs text-gray-400 mt-1">Total Points</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Views</div>
            <BarChart2 size={20} className="text-blue-500" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{fmtNum(stats.views)}</div>
            <div className="text-xs text-gray-400 mt-1">Across all posts</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Likes Received</div>
            <span className="text-xl">👍</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{fmtNum(stats.likes)}</div>
            <div className="text-xs text-gray-400 mt-1">+2 pts per like</div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Posts</div>
            <FileText size={20} className="text-brand-500" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats.posts}</div>
            <div className="text-xs text-gray-400 mt-1">+10 pts per publish</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="font-bold text-lg">Your Articles</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-4xl mb-4">✍️</div>
            <p className="mb-4 text-sm">You haven't written any articles yet.</p>
            <Link to="/dashboard/new" className="inline-block px-4 py-2 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 font-semibold rounded-lg text-sm">
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Views</th>
                  <th className="px-6 py-4 font-semibold">Likes</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/post/${post.slug}`} className="font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-600 transition-colors block max-w-sm truncate">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {post.status === 'published' ? (
                        <span className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md text-xs font-medium w-fit">
                          <CheckCircle size={12} /> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md text-xs font-medium w-fit">
                          <Clock size={12} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4 font-medium">{fmtNum(post.views)}</td>
                    <td className="px-6 py-4 font-medium">{fmtNum(post.likes_count)}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link to={`/dashboard/edit/${post.id}`} className="font-semibold text-brand-600 hover:underline">Edit</Link>
                      <button onClick={() => handleDelete(post.id)} className="font-semibold text-red-500 hover:underline">Delete</button>
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
