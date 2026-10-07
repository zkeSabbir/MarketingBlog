import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('Seeding data...')
  
  // 1. Create a dummy author
  const email = `test+${Date.now()}@gmail.com`
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: 'password123',
    options: {
      data: {
        display_name: 'Василиса Высоцкая',
        username: `vasilisa_${Date.now()}`
      }
    }
  })

  if (authError) {
    console.error('Error creating user:', authError)
    return
  }
  
  console.log('Created user:', authData.user.email)
  const userId = authData.user.id

  // 2. Wait a bit for the trigger to create the profile
  await new Promise(r => setTimeout(r, 2000))

  // Update profile to be verified
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ verified: true, avatar_url: '' })
    .eq('id', userId)
    
  if (profileError) {
    console.error('Error updating profile:', profileError)
  } else {
    console.log('Updated profile for verification.')
  }

  // 3. Insert Post 1
  const post1 = {
    author_id: userId,
    slug: 'creative-writing-showcase-breastfeeding',
    title: 'Creative writing showcase: A Complete Guide to Breastfeeding and Personal Growth',
    content: '<p>Welcome to our deep dive on Creative writing showcase. When exploring the fascinating world of breastfeeding, it becomes clear that taking the right approach can completely change your perspective.</p>',
    category: 'Breastfeeding',
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80',
    likes_count: 1166,
    views: 11100,
    tags: ['Breastfeeding', 'Personal Growth']
  }

  // 4. Insert Post 2
  const post2 = {
    author_id: userId,
    slug: 'video-documentary-miscellaneous-personal-growth',
    title: 'Video documentary: A Complete Guide to Miscellaneous and Personal Growth',
    content: '<p>Welcome to our deep dive on Video documentary. When exploring the fascinating world of miscellaneous, it becomes clear that taking the right approach can completely change your perspective.</p>',
    category: 'Miscellaneous',
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80',
    likes_count: 500,
    views: 8900,
    tags: ['Miscellaneous', 'Personal Growth']
  }

  const { error: insertError } = await supabase
    .from('posts')
    .insert([post1, post2])

  if (insertError) {
    console.error('Error inserting posts:', insertError)
  } else {
    console.log('Successfully inserted posts!')
  }
}

seed()
