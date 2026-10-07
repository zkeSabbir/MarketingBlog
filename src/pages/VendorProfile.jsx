import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { getLevel, fmtNum } from '@/lib/utils'
import PostCard from '@/components/blog/PostCard'
import { Users, FileText, Star, Calendar, BadgeCheck } from 'lucide-react'

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
        .select('*, profiles(display_name, username, avatar_url, verified)')
        .eq('author_id', prof.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        
      if (vendorPosts) setPosts(vendorPosts)
    }
    
    setLoading(false)
  }

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-gray-500 font-bold">Loading profile...</div>
  if (!profile) return <div className="min-h-[50vh] flex items-center justify-center text-2xl font-bold text-gray-900">Author not found</div>

  const level = getLevel(profile.points)
  const joinDate = new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      {/* Soft Pink Cover */}
      <div className="h-48 md:h-64 rounded-[32px] bg-pink-50 relative mb-20 shadow-sm border border-pink-100">
        {profile.cover_url && (
          <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover rounded-[32px] opacity-80" />
        )}
        
        {/* Avatar */}
        <div className="absolute -bottom-16 left-8 md:left-12">
          <img 
            src={profile.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${profile.username}&backgroundColor=fce7f3`} 
            alt={profile.display_name} 
            className="w-32 h-32 md:w-36 md:h-36 rounded-[28px] border-4 border-white dark:border-gray-950 bg-white object-cover shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
          />
        </div>
      </div>

      <div className="px-4 md:px-12 mb-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-1 tracking-tight">
              {profile.display_name}
              {profile.verified && <BadgeCheck className="text-blue-500" size={24} />}
            </h1>
            <p className="text-gray-500 font-bold text-sm mb-4">@{profile.username}</p>
            
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl text-base font-medium leading-relaxed">
              {profile.bio || "Mindfulness practitioner and writer on Deep Meditation."}
            </p>
          </div>
          
          <div className="flex shrink-0">
            <button className="px-6 py-2.5 rounded-full border-2 border-[#f472b6] text-[#f472b6] font-bold text-sm hover:bg-pink-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Stats Section - Soft, clean layout */}
        <div className="flex flex-wrap gap-4 py-6 mt-4">
          <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${level.color}`}>
              {level.icon}
            </div>
            <div>
              <div className="text-sm font-extrabold text-gray-900 dark:text-white">{level.label}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-pink-50 text-pink-500">
              <Star size={18} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-gray-900 dark:text-white">{fmtNum(profile.points)}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Points</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-500">
              <Users size={18} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-gray-900 dark:text-white">{fmtNum(profile.followers_count)}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Followers</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 text-green-500">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-gray-900 dark:text-white">{posts.length}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Articles</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-gray-900 px-5 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-50 text-purple-500">
              <Calendar size={18} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-gray-900 dark:text-white">{joinDate}</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12 mt-4">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b-2 border-gray-100 dark:border-gray-800 pb-4 inline-block">Articles</h2>
        
        {posts.length === 0 ? (
          <div className="p-16 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl">
            <p className="text-gray-500 font-bold">This author hasn't published any articles yet.</p>
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
