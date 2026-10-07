import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Get env from .env file (you'll need to run this with dotenv or manually pass it)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

// User ID for "AVA Deep Meditation" profile (you must create this user first)
const AUTHOR_ID = 'YOUR_AVA_DEEP_USER_UUID'

async function migrate() {
  if (AUTHOR_ID === 'YOUR_AVA_DEEP_USER_UUID') {
    console.error('ERROR: You must set the AUTHOR_ID in migrate_data.js to your actual user UUID from Supabase.')
    return
  }

  console.log('Loading posts.json...')
  const dataPath = path.join(process.cwd(), 'public', 'posts.json')
  const postsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  
  console.log(`Found ${postsData.length} posts. Migrating to Supabase...`)

  let success = 0
  let failed = 0

  for (const post of postsData) {
    const { id, title, content, category, category_en, views, likes, read_time, date } = post

    // Generate a unique slug
    const slugBase = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
    const slug = `${slugBase}-${id}`

    const { error } = await supabase.from('posts').insert([
      {
        author_id: AUTHOR_ID,
        title,
        slug,
        content,
        category: category_en || category,
        status: 'published',
        views: views || 0,
        likes_count: likes || 0,
        read_time: read_time ? `${read_time} min read` : '5 min read',
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString() // Randomize date a bit for the feed
      }
    ])

    if (error) {
      console.error(`Failed to migrate post ${id}:`, error.message)
      failed++
    } else {
      success++
      if (success % 50 === 0) console.log(`Migrated ${success} posts...`)
    }
  }

  console.log(`Migration complete! Success: ${success}, Failed: ${failed}`)
}

migrate().catch(console.error)
