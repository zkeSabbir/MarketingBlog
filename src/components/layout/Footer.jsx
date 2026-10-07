import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

const CHANNEL = 'https://www.youtube.com/@AVADeepMeditation'

const FOOTER_LINKS = {
  Topics: [
    { label: 'Deep Sleep', to: '/category/deep-sleep' },
    { label: 'Meditation', to: '/category/meditation' },
    { label: 'Anxiety Relief', to: '/category/anxiety-relief' },
    { label: 'Focus & Study', to: '/category/focus-study' },
    { label: 'Breathwork', to: '/category/breathwork' },
  ],
  Platform: [
    { label: 'All Articles', to: '/blog' },
    { label: 'Authors', to: '/vendors' },
    { label: 'Leaderboard', to: '/leaderboard' },
    { label: 'Write for Us', to: '/register' },
    { label: 'Dashboard', to: '/dashboard' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Use', to: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🧘‍♀️</span>
              <span className="font-extrabold text-xl gradient-text">AVA Deep Meditation</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-sm">
              Your go-to platform for sleep science, mindfulness, meditation guides, and wellness content.
              Written by experts, loved by thousands.
            </p>
            <div className="flex items-center gap-3">
              <a href={CHANNEL} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow">
                <span>▶️</span> YouTube Channel
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} AVA Deep Meditation. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> for mindfulness practitioners worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
