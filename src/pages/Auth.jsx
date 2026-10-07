import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    let res
    if (isLogin) {
      res = await signIn(email, password)
    } else {
      if (!name.trim()) {
        setError('Name is required')
        setLoading(false)
        return
      }
      res = await signUp(email, password, name)
    }
    
    setLoading(false)
    if (res.error) setError(res.error.message)
    else navigate('/')
  }

  const handleGoogle = async () => {
    setError('')
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-[90vh] flex bg-[#fafafa] dark:bg-gray-950 font-sans">
      
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative z-10">
        
        <div className="w-full max-w-md mx-auto">
          {/* Logo / Branding */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-black text-xl">D</div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Deep Meditation</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base mb-8">
            {isLogin 
              ? 'Enter your details below to access your workspace.' 
              : 'Join thousands of practitioners sharing their knowledge.'}
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-bold py-3.5 rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 group disabled:opacity-70 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
          </div>

          <button 
            onClick={handleGoogle}
            type="button"
            className="mt-8 w-full bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all flex justify-center items-center gap-3"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <p className="mt-10 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      {/* Right Visual Side (Only visible on large screens) */}
      <div className="hidden lg:flex w-1/2 bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-teal-500 to-emerald-700 relative overflow-hidden shadow-2xl flex items-center justify-center">
          {/* Abstract background shapes */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-black/10 blur-3xl"></div>
          
          <div className="relative z-10 max-w-lg text-center px-10 text-white">
            <h2 className="text-4xl font-black mb-6 leading-tight">Master your mind, shape your reality.</h2>
            <p className="text-teal-50 text-lg font-medium leading-relaxed">Join the world's most premium community of meditation practitioners and mindfulness experts.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
