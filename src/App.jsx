import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetch('/posts.json')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  if (posts.length === 0) return <div className="loading-screen">Loading AVADeepMeditation Platform...</div>;

  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="logo-section" onClick={() => setSelectedPost(null)}>
          <span className="logo-icon">🌸</span>
          <span className="logo-text">AVA Deep</span>
        </div>
        <div className="search-section">
          <input type="text" placeholder="Search topics, videos, meditation..." className="search-bar" />
        </div>
        <div className="auth-section">
          <button className="btn-new-post">⊕ New Post</button>
          <button className="btn-login">Login</button>
        </div>
      </header>

      <div className="main-layout">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <div className="sidebar-menu">
            <div className="menu-item active">🏠 Home</div>
            <div className="menu-item">⭐ Experts</div>
            <div className="menu-item">💬 Q&A</div>
            <div className="menu-item">📈 Rankings</div>
            <div className="menu-item">🛠 Services</div>
          </div>

          <div className="sidebar-topics">
            <h3>Themes & Topics</h3>
            {/* Get unique categories from posts */}
            {[...new Set(posts.map(p => p.category_ru))].slice(0, 15).map((cat, idx) => (
              <div className="topic-item" key={idx}>
                <span className="topic-icon">{posts.find(p => p.category_ru === cat).category_icon}</span>
                {cat}
              </div>
            ))}
          </div>
        </aside>

        {/* Center Feed */}
        <main className="center-feed">
          {!selectedPost && (
            <div className="feed-filters">
              <span className="filter-chip active">New</span>
              <span className="filter-chip">Popular</span>
              <span className="filter-chip">Discussed</span>
            </div>
          )}

          {selectedPost ? (
            <div className="post-card single-view">
              <button onClick={() => setSelectedPost(null)} className="back-btn">← Back to Feed</button>
              <div className="post-header">
                <div className="author-info">
                  <div className="author-avatar">{selectedPost.author.charAt(0)}</div>
                  <div className="author-meta">
                    <strong>{selectedPost.author} 💎</strong>
                    <span>{selectedPost.date} • {selectedPost.category_en}</span>
                  </div>
                </div>
              </div>
              <h1 className="post-title" style={{fontSize: '24px', margin: '15px 0'}}>{selectedPost.title}</h1>
              <div className="post-content" dangerouslySetInnerHTML={{__html: selectedPost.content}} />
            </div>
          ) : (
            <>
              {visiblePosts.map(post => (
                <div className="post-card" key={post.id} onClick={() => setSelectedPost(post)}>
                  <div className="post-header">
                    <div className="author-info">
                      <div className="author-avatar">{post.author.charAt(0)}</div>
                      <div className="author-meta">
                        <strong>{post.author} 💎</strong>
                        <span>{post.date} • {post.category_en}</span>
                      </div>
                    </div>
                    <button className="btn-subscribe">Subscribe</button>
                  </div>
                  
                  <h2 className="post-title">{post.title}</h2>
                  
                  <div className="post-snippet">
                    {post.content.replace(/<[^>]+>/g, '').substring(0, 200)}...
                    <span className="read-more">Read more</span>
                  </div>

                  {post.has_image && (
                    <div className="post-image" style={{backgroundImage: `url(https://picsum.photos/800/400?random=${post.id})`}}></div>
                  )}

                  <div className="post-footer">
                    <div className="engagement-stats">
                      <span className="stat-item likes">❤️ {post.likes}</span>
                      <span className="stat-item">🔥 {Math.floor(post.likes / 3)}</span>
                      <span className="stat-item">😲 {Math.floor(post.likes / 10)}</span>
                    </div>
                    <div className="interaction-stats">
                      <span>💬 {post.comments}</span>
                      <span>🔖 {Math.floor(post.comments * 1.5)}</span>
                      <span>👁️ {(post.views / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="load-more-container">
                <button className="btn-load-more" onClick={() => setVisibleCount(prev => prev + 10)}>
                  Load More Articles ↓
                </button>
              </div>
            </>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="widget highlight-widget">
            <h4>AVADeepMeditation</h4>
            <p>Subscribe to our YouTube channel for daily deep sleep and meditation sounds.</p>
            <a href="https://www.youtube.com/@AVADeepMeditation" target="_blank" className="btn-widget-link">Visit Channel</a>
          </div>

          <div className="widget">
            <h4>Popular from Experts</h4>
            <div className="widget-item">
              <strong>Алиса Васильева 💎</strong>
              <p>The ultimate guide to finding your inner peace...</p>
              <span>👁️ 456</span>
            </div>
            <div className="widget-item">
              <strong>Ирина Гордеева 💎</strong>
              <p>How to use Keyboard Shortcuts to boost your productivity...</p>
              <span>👁️ 456</span>
            </div>
          </div>

          <div className="widget">
            <h4>Popular Questions</h4>
            <div className="widget-item">
              <strong>Алиса Васильева</strong>
              <p>What is the best time to meditate?</p>
              <span>💬 24</span>
            </div>
            <div className="widget-item">
              <strong>Евгения Петрова</strong>
              <p>How does deep sleep affect muscle recovery?</p>
              <span>💬 349</span>
            </div>
            <button className="btn-ask">❓ Ask a Question</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
