import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 font-sans">
      {/* Left side banner (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="text-gray-300" size={24} />
            <span className="text-2xl font-bold tracking-tight">Deep Meditation</span>
          </Link>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-medium leading-tight mb-6">Find your inner peace and connect with a global community of mindful practitioners.</h2>
          <p className="text-gray-400 text-lg">Join Deep Meditation to share your insights, write articles, and grow your personal practice with experts worldwide.</p>
        </div>
        
        {/* Abstract background graphics */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[120px] mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[150px] mix-blend-overlay"></div>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px]"
        >
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <Sparkles className="text-gray-900 dark:text-white" size={24} />
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Deep Meditation</span>
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">{subtitle}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 p-0 rounded-none bg-transparent">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Input({ label, error, ...props }) {
  const [show, setShow] = useState(false)
  const isPass = props.type === 'password'
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={isPass && show ? 'text' : props.type}
          className={`w-full px-4 py-3 rounded-md border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base outline-none focus:border-gray-900 dark:focus:border-white focus:ring-1 focus:ring-gray-900 dark:focus:ring-white transition-all`}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
            {show ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1.5"><AlertCircle size={14}/> {error}</p>}
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
    <AuthLayout title="Log in to your account" subtitle="Welcome back! Please enter your details.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
        <div>
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          <div className="flex justify-end mt-2">
            <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Forgot password?</a>
          </div>
        </div>
        
        {error && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/30">
            <AlertCircle size={18} className="shrink-0 mt-0.5"/> {error}
          </div>
        )}
        
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-base hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800"/></div>
        <div className="relative text-center"><span className="bg-gray-50 dark:bg-gray-950 px-4 text-sm text-gray-500">or continue with</span></div>
      </div>

      <button onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>

      <p className="text-center text-sm text-gray-500 mt-8">
        Don't have an account? <Link to="/register" className="text-gray-900 dark:text-white font-semibold hover:underline">Sign up</Link>
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
    <AuthLayout title="Check your email" subtitle="We've sent a temporary login link.">
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-6 mt-4">
        <p className="text-base text-gray-600 dark:text-gray-400 mb-6 text-center">
          Please check your inbox at <span className="font-medium text-gray-900 dark:text-white">{email}</span> and click the link to activate your account.
        </p>
        <Link to="/login" className="block w-full py-3 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          Back to log in
        </Link>
      </div>
    </AuthLayout>
  )

  return (
    <AuthLayout title="Create an account" subtitle="Start your journey with Deep Meditation today.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required />
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password (min. 6 characters)" required />
        
        {error && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/30">
            <AlertCircle size={18} className="shrink-0 mt-0.5"/> {error}
          </div>
        )}
        
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-base hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800"/></div>
        <div className="relative text-center"><span className="bg-gray-50 dark:bg-gray-950 px-4 text-sm text-gray-500">or sign up with</span></div>
      </div>

      <button onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>

      <p className="text-center text-sm text-gray-500 mt-8">
        Already have an account? <Link to="/login" className="text-gray-900 dark:text-white font-semibold hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  )
}
