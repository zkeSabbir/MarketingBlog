import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { getLevel, fmtNum } from '@/lib/utils'
import PostCard from '@/components/blog/PostCard'
import { Users, FileText, Star, Calendar } from 'lucide-react'

export default function VendorProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    setLoading(true)
    
    // Get profile
    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()
      
    if (prof) {
      setProfile(prof)
      
      // Get vendor's published posts
      const { data: vendorPosts } = await supabase
        .from('posts')
        .select('*, profiles(display_name, username, avatar_url)')
        .eq('author_id', prof.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        
      if (vendorPosts) setPosts(vendorPosts)
    }
    
    setLoading(false)
  }

  if (loading) return <div className="p-20 text-center text-gray-500">Loading profile...</div>
  if (!profile) return <div className="p-20 text-center text-2xl font-bold">Author not found</div>

  const level = getLevel(profile.points)
  const joinDate = new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Cover */}
      <div className="h-48 md:h-64 rounded-t-3xl bg-gradient-to-r from-brand-400 to-pink-500 relative mb-16">
        {profile.cover_url && <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover rounded-t-3xl opacity-80" />}
        
        {/* Avatar */}
        <div className="absolute -bottom-16 left-8 md:left-12 flex items-end gap-4">
          <img 
            src={profile.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${profile.username}`} 
            alt={profile.display_name} 
            className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-950 bg-white dark:bg-gray-900 object-cover shadow-xl"
          />
        </div>
      </div>

      <div className="px-4 md:px-12 mb-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              {profile.display_name}
              {profile.verified && <span className="text-xl" title="Verified Author">💎</span>}
            </h1>
            <p className="text-gray-500 font-medium">@{profile.username}</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-6 py-2 rounded-xl gradient-bg text-white font-bold shadow-md hover:opacity-90 transition-opacity">
              Follow Author
            </button>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mb-8 leading-relaxed">
          {profile.bio || "Mindfulness practitioner and writer on AVA Deep."}
        </p>

        <div className="flex flex-wrap gap-6 border-y border-gray-100 dark:border-gray-800 py-6">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${level.color}`}>
              {level.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{level.label}</div>
              <div className="text-xs text-gray-500">Level</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-50 text-brand-600 dark:bg-brand-900/30">
              <Star size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{fmtNum(profile.points)}</div>
              <div className="text-xs text-gray-500">Points</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-900/30">
              <Users size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{fmtNum(profile.followers_count)}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-pink-50 text-pink-600 dark:bg-pink-900/30">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{posts.length}</div>
              <div className="text-xs text-gray-500">Articles</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-600 dark:bg-gray-800">
              <Calendar size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{joinDate}</div>
              <div className="text-xs text-gray-500">Joined</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12">
        <h2 className="text-2xl font-extrabold mb-6">Articles by {profile.display_name}</h2>
        
        {posts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            This author hasn't published any articles yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
