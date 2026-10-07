import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { getLevel, fmtNum } from '@/lib/utils'
import PostCard from '@/components/blog/PostCard'
import { Users, FileText, Star, Calendar, MapPin, Link as LinkIcon, BadgeCheck } from 'lucide-react'

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Loading profile...</div>
  if (!profile) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-900">Author not found</div>

  const level = getLevel(profile.points)
  const joinDate = new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 font-sans">
      {/* Premium Cover */}
      <div className="h-64 md:h-80 rounded-2xl bg-gray-900 relative mb-20 overflow-hidden shadow-sm">
        {profile.cover_url ? (
          <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950"></div>
        )}
        
        {/* Avatar */}
        <div className="absolute -bottom-16 left-8 md:left-12">
          <img 
            src={profile.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${profile.username}&backgroundColor=f3f4f6`} 
            alt={profile.display_name} 
            className="w-36 h-36 rounded-full border-4 border-white dark:border-gray-950 bg-white object-cover shadow-lg"
          />
        </div>
      </div>

      <div className="px-4 md:px-12 mb-16">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight mb-1">
              {profile.display_name}
              {profile.verified && <BadgeCheck className="text-blue-500" size={28} />}
            </h1>
            <p className="text-gray-500 text-lg font-medium mb-4">@{profile.username}</p>
            
            <p className="text-gray-700 dark:text-gray-300 max-w-3xl text-lg leading-relaxed">
              {profile.bio || "Mindfulness practitioner and certified wellness expert on Deep Meditation."}
            </p>
          </div>
          
          <div className="flex shrink-0">
            <button className="px-8 py-3 rounded-md bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-sm">
              Follow Author
            </button>
          </div>
        </div>

        {/* Stats Section - Clean & Professional */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-y border-gray-200 dark:border-gray-800 py-8 mt-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400"><Star size={16} /></span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Points</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{fmtNum(profile.points)}</div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400"><Users size={16} /></span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Followers</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{fmtNum(profile.followers_count)}</div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400"><FileText size={16} /></span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Articles</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{posts.length}</div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400"><Calendar size={16} /></span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Joined</span>
            </div>
            <div className="text-xl font-medium text-gray-900 dark:text-white mt-1">{joinDate}</div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400"><BadgeCheck size={16} /></span>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</span>
            </div>
            <div className="text-xl font-medium text-gray-900 dark:text-white mt-1">{level.label}</div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">Published Works</h2>
        
        {posts.length === 0 ? (
          <div className="p-16 text-center border border-gray-200 dark:border-gray-800 rounded-lg">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No publications yet</h3>
            <p className="text-gray-500">This author hasn't published any articles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
