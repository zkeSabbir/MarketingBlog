import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PostCard from '@/components/blog/PostCard'

export default function Category() {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(10)
  const [categoryName, setCategoryName] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        // Use blogs_index.json which has all posts (no content field - much faster)
        const res = await fetch('/blogs_index.json')
        let data = await res.json()
        
        // Filter by slug
        data = data.filter(post => 
          post.category && post.category.toLowerCase().replace(/\s+/g, '-') === slug
        )
        
        if (data.length > 0) {
          setCategoryName(data[0].category)
        } else {
          setCategoryName(slug.replace(/-/g, ' '))
        }
        
        // Sort by newest
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        
        setPosts(data)
        setVisibleCount(12)
      } catch (e) {
        console.error("Failed to load blogs", e)
      }
      setLoading(false)
    }
    
    fetchBlogs()
  }, [slug])

  return (
    <div className="max-w-2xl mx-auto w-full font-sans pb-20">
      
      {/* Feed Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white capitalize">
          {categoryName}
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} available in this topic
        </p>
      </div>

      <div className="w-full h-px bg-gray-200 dark:bg-gray-800 mb-6"></div>

      {/* Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        ) : posts.length > 0 ? (
          <>
            {posts.slice(0, visibleCount).map(post => <PostCard key={post.id} post={post} />)}
            {visibleCount < posts.length && (
              <div className="pt-4 pb-8 flex justify-center">
                <button 
                  onClick={() => setVisibleCount(v => v + 10)}
                  className="px-8 py-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold transition-colors shadow-sm"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">No posts yet</h3>
            <p className="text-sm">We are still writing content for {categoryName}.</p>
          </div>
        )}
      </div>
    </div>
  )
}
