import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-300/20 dark:bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-300/20 dark:bg-pink-600/10 rounded-full blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">🧘‍♀️</span>
            <span className="text-xl font-extrabold gradient-text">AVA Deep</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{subtitle}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

function Input({ label, error, ...props }) {
  const [show, setShow] = useState(false)
  const isPass = props.type === 'password'
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={isPass && show ? 'text' : props.type}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-brand-400 dark:focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/30 transition-all"
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
            {show ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11}/> {error}</p>}
    </div>
  )
}

export function Login() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) setError(err.message)
    else navigate('/dashboard')
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your AVA Deep account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required />
        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={15}/> {error}
          </div>
        )}
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl gradient-bg text-white font-bold text-sm shadow hover:opacity-90 transition-opacity disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-800"/></div>
        <div className="relative text-center"><span className="bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">or</span></div>
      </div>

      <button onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <span className="font-bold text-lg">G</span> Continue with Google
      </button>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don't have an account? <Link to="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Create one free</Link>
      </p>
    </AuthLayout>
  )
}

export function Register() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error: err } = await signUp(email, password, name)
    setLoading(false)
    if (err) setError(err.message)
    else setDone(true)
  }

  if (done) return (
    <AuthLayout title="Check Your Email ✉️" subtitle="We sent you a confirmation link">
      <div className="text-center py-4">
        <div className="text-5xl mb-4">📧</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click the link in your email to activate your account. Then <Link to="/login" className="text-brand-600 hover:underline">sign in</Link>.
        </p>
      </div>
    </AuthLayout>
  )

  return (
    <AuthLayout title="Join AVA Deep" subtitle="Create your free author account and start earning points">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Display Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
        <Input label="Password (min 6 characters)" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required />
        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={15}/> {error}
          </div>
        )}
        <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-3 text-xs text-brand-700 dark:text-brand-300 space-y-1">
          <div>🎁 100 welcome points on signup</div>
          <div>✍️ +10 points per published post</div>
          <div>👍 +2 points per like received</div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl gradient-bg text-white font-bold text-sm shadow hover:opacity-90 transition-opacity disabled:opacity-60">
          {loading ? 'Creating account…' : 'Create Free Account'}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-800"/></div>
        <div className="relative text-center"><span className="bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">or</span></div>
      </div>

      <button onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <span className="font-bold text-lg">G</span> Continue with Google
      </button>

      <p className="text-xs text-gray-400 text-center mt-4">
        By signing up you agree to our <Link to="/terms" className="text-brand-600 hover:underline">Terms of Use</Link> and <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>.
      </p>

      <p className="text-center text-sm text-gray-400 mt-4">
        Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
