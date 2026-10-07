import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

// Tailwind class merger
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format date
export function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function timeAgo(dateStr) {
  if (!dateStr) return ''
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

// Reading time (words / 200 wpm)
export function readingTime(content = '') {
  const text = content.replace(/<[^>]*>/g, '').trim()
  const words = text.split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

// Slug generator
export function slugify(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Truncate text
export function truncate(text = '', maxLen = 150) {
  const plain = text.replace(/<[^>]*>/g, '').trim()
  if (plain.length <= maxLen) return plain
  return plain.slice(0, maxLen).trimEnd() + '…'
}

// Points → Level
export function getLevel(points = 0) {
  if (points >= 500) return { label: 'Master', color: 'badge-master', icon: '🏆' }
  if (points >= 200) return { label: 'Pro', color: 'badge-pro', icon: '⭐' }
  if (points >= 50)  return { label: 'Contributor', color: 'badge-contributor', icon: '✨' }
  return { label: 'Beginner', color: 'badge-beginner', icon: '🌱' }
}

// DiceBear avatar URL
export function dicebearUrl(seed, style = 'avataaars') {
  return `https://api.dicebear.com/8.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=128`
}

// Debounce
export function debounce(fn, delay = 250) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// Highlight search match
export function highlight(text = '', query = '') {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${escaped})`, 'gi')
  return text.replace(re, '<mark class="search-highlight">$1</mark>')
}

// Format number (1200 → 1.2K)
export function fmtNum(n = 0) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

// Unique session ID for anonymous view tracking
export function getSessionId() {
  const key = 'ava_session_id'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}
