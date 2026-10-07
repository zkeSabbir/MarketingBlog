import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'

import Navbar from '@/components/layout/Navbar'
import LeftSidebar from '@/components/layout/LeftSidebar'
import RightSidebar from '@/components/layout/RightSidebar'

import Home from '@/pages/Home'
import Category from '@/pages/Category'
import SinglePost from '@/pages/SinglePost'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import PostEditor from '@/pages/PostEditor'
import VendorProfile from '@/pages/VendorProfile'
import QADiscussion from '@/pages/QADiscussion'

function ThreeColumnLayout({ children }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 pt-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
        <LeftSidebar />
      </div>
      <div className="lg:col-span-6 xl:col-span-7">
        {children}
      </div>
      <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
        <RightSidebar />
      </div>
    </div>
  )
}

import ErrorBoundary from '@/components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
          <div className="min-h-screen bg-[#f4f6f8] dark:bg-gray-950">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<ThreeColumnLayout><Home /></ThreeColumnLayout>} />
                <Route path="/category/:slug" element={<ThreeColumnLayout><Category /></ThreeColumnLayout>} />
                <Route path="/post/:slug" element={<ThreeColumnLayout><SinglePost /></ThreeColumnLayout>} />
                <Route path="/vendor/:username" element={<ThreeColumnLayout><VendorProfile /></ThreeColumnLayout>} />
                <Route path="/qa" element={<ThreeColumnLayout><QADiscussion /></ThreeColumnLayout>} />
                
                {/* Auth & Dashboard don't need 3 columns usually, but can be customized */}
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
                <Route path="/dashboard" element={<div className="pt-20"><Dashboard /></div>} />
                <Route path="/dashboard/new" element={<div className="pt-20"><PostEditor /></div>} />
                <Route path="/dashboard/edit/:id" element={<div className="pt-20"><PostEditor /></div>} />
                
                {/* Fallbacks */}
                <Route path="*" element={
                  <div className="text-center py-32">
                    <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
                    <p className="text-gray-500 mb-8">The page you are looking for doesn't exist.</p>
                    <a href="/" className="text-rose-500 hover:underline">Go Home</a>
                  </div>
                } />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
