import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('Signing up AVA Deep user...')
  let authorId = null;

  // Sign up
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email: 'avadeep@example.com',
    password: 'password123',
    options: { data: { display_name: 'Василиса Высоцкая', username: 'avadeep' } }
  })

  if (authErr && authErr.message.includes('User already registered')) {
    // try sign in
    const { data: signData } = await supabase.auth.signInWithPassword({
      email: 'avadeep@example.com',
      password: 'password123'
    })
    authorId = signData?.user?.id
  } else if (authData?.user) {
    authorId = authData.user.id
  }

  if (!authorId) {
    console.log('Could not get user ID. Trying to fetch first profile...')
    const { data: profs } = await supabase.from('profiles').select('id').limit(1)
    if (profs && profs.length > 0) authorId = profs[0].id
  }

  if (!authorId) {
    console.error('No author ID found to migrate posts to.')
    return
  }

  console.log(`Using Author ID: ${authorId}`)
  
  const dataPath = path.join(process.cwd(), 'public', 'posts.json')
  const postsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  
  console.log(`Found ${postsData.length} posts. Migrating...`)
  let success = 0
  let failed = 0

  for (let i = 0; i < Math.min(postsData.length, 50); i++) {
    const post = postsData[i]
    const { id, title, content, category, category_en, views, likes, read_time, image } = post

    const slugBase = (title || 'post').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
    const slug = `${slugBase}-${id || Math.random().toString(36).substring(7)}`

    const { error } = await supabase.from('posts').upsert({
      author_id: authorId,
      title: title || 'Untitled',
      slug,
      content: content || '',
      category: category_en || category || 'General',
      status: 'published',
      views: views || Math.floor(Math.random() * 10000),
      likes_count: likes || Math.floor(Math.random() * 1000),
      thumbnail_url: image || null,
      read_time: read_time ? `${read_time} min read` : '5 min read',
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }, { onConflict: 'slug' })

    if (error) failed++
    else success++
  }

  console.log(`Migration complete! Success: ${success}, Failed: ${failed}`)
}

run().catch(console.error)
