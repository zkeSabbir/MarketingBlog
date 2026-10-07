import React, { useState, useEffect } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    fetch('/posts.json')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  if (posts.length === 0) return <div style={{textAlign:'center', padding:'50px', fontSize:'24px', fontWeight:'bold'}}>Loading thousands of posts...</div>;

  // Single Post View
  if (selectedPost) {
    return (
      <div className="container">
        <header>
          <div className="logo" onClick={() => setSelectedPost(null)} style={{cursor: 'pointer'}}>
            Deep<span>Sleep</span> MAG
          </div>
          <div className="ad-banner">728x90 AD PLACEHOLDER</div>
        </header>
        <div className="article-view">
          <span className="category" style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>{selectedPost.category}</span>
          <h1>{selectedPost.title}</h1>
          <div className="meta" style={{color: '#666', marginBottom: '20px'}}>
            By Admin • {new Date().toLocaleDateString()}
          </div>
          
          <div className="video-player-real" style={{width: '100%', height: '500px', backgroundColor: '#000', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '30px', backgroundImage: `url(https://picsum.photos/1200/600?random=${selectedPost.id})`, backgroundSize: 'cover', backgroundBlendMode: 'overlay'}}>
             <div style={{width: '80px', height: '80px', backgroundColor: 'red', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,0,0,0.4)'}}>
                <div style={{width: 0, height: 0, borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: '25px solid white', marginLeft: '5px'}}></div>
             </div>
             <h3 style={{marginTop: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>{selectedPost.video_title}</h3>
             <p style={{color: '#ddd', fontSize: '0.9rem'}}>Full Video on our Channel</p>
          </div>

          <div className="article-content" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
          <button onClick={() => setSelectedPost(null)} style={{marginTop: '40px', padding: '15px 30px', background: 'var(--text-dark)', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'}}>← BACK TO ALL ARTICLES</button>
        </div>
      </div>
    );
  }

  // Magazine Home View
  const heroPost = posts[0];
  const subHero1 = posts[1];
  const subHero2 = posts[2];
  
  // Exclude heroes from main list
  const remainingPosts = posts.slice(3);
  const visiblePosts = remainingPosts.slice(0, visibleCount);

  return (
    <div className="container">
      <div className="top-bar">
        <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <div className="socials">
          <span>Facebook</span>
          <span>Twitter</span>
          <span>Instagram</span>
          <span>YouTube</span>
        </div>
      </div>

      <header>
        <div className="logo">Deep<span>Sleep</span> MAG</div>
        <div className="ad-banner">728x90 AD PLACEHOLDER</div>
      </header>

      <nav>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Wellness</a></li>
          <li><a href="#">Productivity</a></li>
          <li><a href="#">Lifestyle</a></li>
          <li><a href="#">Relaxation</a></li>
          <li><a href="#">All {posts.length} Posts</a></li>
        </ul>
      </nav>

      <div className="trending-ticker">
        <span className="trending-badge">TRENDING</span>
        <span>{posts[10]?.title}</span>
      </div>

      <div className="hero-section">
        <div className="hero-main" onClick={() => setSelectedPost(heroPost)} style={{cursor: 'pointer', backgroundImage: `url(https://picsum.photos/800/600?random=${heroPost.id})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div className="hero-overlay">
            <span className="category">{heroPost.category}</span>
            <h2>{heroPost.title}</h2>
            <span style={{fontSize: '0.8rem'}}>By Admin • 2 hours ago</span>
          </div>
        </div>
        <div className="hero-sub">
          <div className="hero-item" onClick={() => setSelectedPost(subHero1)} style={{cursor: 'pointer', backgroundImage: `url(https://picsum.photos/400/300?random=${subHero1.id})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="hero-overlay">
              <span className="category">{subHero1.category}</span>
              <h2>{subHero1.title}</h2>
            </div>
          </div>
          <div className="hero-item" onClick={() => setSelectedPost(subHero2)} style={{cursor: 'pointer', backgroundImage: `url(https://picsum.photos/400/300?random=${subHero2.id})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="hero-overlay">
              <span className="category">{subHero2.category}</span>
              <h2>{subHero2.title}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="main-layout" style={{display: 'block'}}>
        <main style={{width: '100%'}}>
          <div className="section-title">
            <span>Latest Articles ({visiblePosts.length} of {posts.length})</span>
          </div>
          
          <div className="post-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'}}>
            {visiblePosts.map(post => (
              <div className="post-card" key={post.id} onClick={() => setSelectedPost(post)} style={{cursor: 'pointer'}}>
                <img src={`https://picsum.photos/400/250?random=${post.id}`} alt="" className="post-card-img" />
                <div className="category">{post.category}</div>
                <h3 style={{fontSize: '1.2rem'}}>{post.title}</h3>
                <div className="meta">By Admin • {new Date().toLocaleDateString()}</div>
                <p>{post.content.replace(/<[^>]+>/g, '').substring(0, 100)}...</p>
                
                <div style={{marginTop: '10px', fontSize: '0.8rem', color: 'red', fontWeight: 'bold'}}>
                  ▶ WATCH: {post.video_title.substring(0, 30)}...
                </div>
              </div>
            ))}
          </div>
          
          {visibleCount < remainingPosts.length && (
            <div style={{textAlign: 'center', margin: '40px 0'}}>
              <button 
                onClick={() => setVisibleCount(prev => prev + 24)}
                style={{
                  padding: '15px 40px', 
                  background: 'var(--primary-color)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '30px', 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}
              >
                LOAD MORE POSTS ↓
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
