import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-[calc(100vh-64px)] pt-10 pb-16 flex items-center justify-center relative bg-[#f4f6f8] dark:bg-gray-950 px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-white dark:bg-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{subtitle}</p>
          </div>
          <div>
            {children}
          </div>
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
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={isPass && show ? 'text' : props.type}
          className={`w-full px-4 py-3.5 rounded-2xl border ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'} text-gray-900 dark:text-white text-sm font-medium outline-none focus:border-pink-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-pink-50 dark:focus:ring-pink-900/20 transition-all`}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {show ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-500 mt-2 flex items-center gap-1"><AlertCircle size={14}/> {error}</p>}
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
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue your journey.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Password</label>
            <a href="#" className="text-xs font-bold text-pink-500 hover:text-pink-600 transition-colors">Forgot?</a>
          </div>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        
        {error && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            <AlertCircle size={18} className="shrink-0 mt-0.5"/> {error}
          </div>
        )}
        
        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-full bg-[#f472b6] text-white font-bold text-sm shadow-[0_8px_20px_rgb(244,114,182,0.3)] hover:bg-[#ec4899] hover:shadow-[0_8px_25px_rgb(244,114,182,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 mt-2">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-800"/></div>
        <div className="relative text-center"><span className="bg-white dark:bg-gray-900 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Or continue with</span></div>
      </div>

      <button onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full border-2 border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-200 transition-all">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>

      <p className="text-center text-sm font-medium text-gray-500 mt-8">
        Don't have an account? <Link to="/register" className="text-[#f472b6] font-bold hover:underline">Sign up</Link>
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
    <AuthLayout title="Check your email" subtitle="We've sent a confirmation link.">
      <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-900/30 rounded-3xl p-6 mt-4 text-center">
        <div className="text-4xl mb-4">📧</div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          Please check your inbox at <br/><span className="font-bold text-gray-900 dark:text-white">{email}</span><br/> and click the link to activate your account.
        </p>
        <Link to="/login" className="block w-full py-4 rounded-full bg-[#f472b6] text-white text-center font-bold hover:bg-[#ec4899] transition-colors shadow-md">
          Back to log in
        </Link>
      </div>
    </AuthLayout>
  )

  return (
    <AuthLayout title="Create Account" subtitle="Join the Deep Meditation community.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required />
        <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required />
        
        {error && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            <AlertCircle size={18} className="shrink-0 mt-0.5"/> {error}
          </div>
        )}
        
        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-full bg-[#f472b6] text-white font-bold text-sm shadow-[0_8px_20px_rgb(244,114,182,0.3)] hover:bg-[#ec4899] hover:shadow-[0_8px_25px_rgb(244,114,182,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 mt-4">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-800"/></div>
        <div className="relative text-center"><span className="bg-white dark:bg-gray-900 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Or sign up with</span></div>
      </div>

      <button onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full border-2 border-gray-100 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-200 transition-all">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>

      <p className="text-center text-sm font-medium text-gray-500 mt-8">
        Already have an account? <Link to="/login" className="text-[#f472b6] font-bold hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  )
}
