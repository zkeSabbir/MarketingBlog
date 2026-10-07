import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { getLevel, fmtNum, formatDate } from '@/lib/utils'
import PostCard from '@/components/blog/PostCard'
import { Users, FileText, Star, Calendar, BadgeCheck, MessageSquare, Briefcase, ExternalLink, Mail } from 'lucide-react'

export default function VendorProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('posts')

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
    </div>
  )
  
  if (!profile) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <Users size={32} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
      <p className="text-gray-500 max-w-sm">The user you are looking for does not exist or has been removed.</p>
    </div>
  )

  const level = getLevel(profile.points || 0)
  const joinDate = formatDate(profile.created_at)

  const TABS = [
    { id: 'posts', label: 'Articles', count: posts.length },
    { id: 'answers', label: 'Answers', count: 0 },
    { id: 'services', label: 'Services', count: 0 },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans pb-20">
      
      {/* Cover Image & Avatar Section */}
      <div className="relative mb-24">
        <div className="h-48 md:h-64 w-full rounded-[2rem] bg-gradient-to-r from-teal-100 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/10 border border-teal-100/50 dark:border-teal-900/50 overflow-hidden shadow-sm">
          {profile.cover_url && (
            <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover mix-blend-overlay opacity-80" />
          )}
        </div>
        
        <div className="absolute -bottom-16 left-6 md:left-12 flex items-end gap-6 w-full pr-12">
          <div className="relative shrink-0">
            <img 
              src={profile.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${profile.username}&backgroundColor=ccfbf1`} 
              alt={profile.display_name} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-[1.5rem] border-4 border-white dark:border-gray-950 bg-white object-cover shadow-lg"
            />
            {profile.verified && (
              <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-900 p-1 rounded-full shadow-sm">
                <BadgeCheck className="text-blue-500" size={28} fill="currentColor" stroke="white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mr-6">
            <div className="mt-16 md:mt-0">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2 mb-1 tracking-tight">
                {profile.display_name}
              </h1>
              <p className="text-teal-600 dark:text-teal-400 font-semibold text-sm">@{profile.username}</p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 shadow-sm">
                <Mail size={16} /> Message
              </button>
              <button className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold transition-all shadow-sm">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        
        {/* Left Column: About & Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-200/60 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">About</h3>
            <p className="text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed mb-6 font-medium">
              {profile.bio || "Meditation practitioner and mindfulness advocate."}
            </p>
            
            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 font-medium text-sm">
                <Calendar size={18} className="text-gray-400" /> Joined {joinDate}
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 font-medium text-sm">
                <Users size={18} className="text-gray-400" /> {fmtNum(profile.followers_count || 0)} Followers
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 font-medium text-sm">
                <ExternalLink size={18} className="text-gray-400" /> avadeepmeditation.netlify.app
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-200/60 dark:border-gray-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Reputation</h3>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm text-2xl ${level.color}`}>
                {level.icon}
              </div>
              <div>
                <div className="text-lg font-black text-gray-900 dark:text-white">{level.label}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Level</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100/50 dark:border-teal-800/30">
                <Star size={16} className="text-teal-600 mb-2" />
                <div className="text-xl font-black text-gray-900 dark:text-white">{fmtNum(profile.points || 0)}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase mt-1">Points</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30">
                <Users size={16} className="text-blue-600 mb-2" />
                <div className="text-xl font-black text-gray-900 dark:text-white">{fmtNum(profile.total_views || 0)}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase mt-1">Total Views</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs & Content */}
        <div className="lg:col-span-2">
          
          <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-px">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab.id === 'posts' && <FileText size={16} />}
                {tab.id === 'answers' && <MessageSquare size={16} />}
                {tab.id === 'services' && <Briefcase size={16} />}
                {tab.label}
                <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div>
            {activeTab === 'posts' && (
              posts.length === 0 ? (
                <div className="p-16 text-center bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No articles yet</h3>
                  <p className="text-gray-500 text-sm">This author hasn't published any articles yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              )
            )}
            
            {activeTab !== 'posts' && (
              <div className="p-16 text-center bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
                <p className="text-gray-500 text-sm">This section is currently under construction.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}
