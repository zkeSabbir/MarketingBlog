import React, { useState, useEffect } from 'react';

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetch('/posts.json')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  if (posts.length === 0) return <div>Loading...</div>;

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
          <div className="video-player" style={{backgroundImage: `url(https://picsum.photos/1200/600?random=${selectedPost.id})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div style={{background: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '50%', cursor: 'pointer'}}>
              ▶ PLAY {selectedPost.video_title}
            </div>
          </div>
          <div className="article-content" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
          <button onClick={() => setSelectedPost(null)} style={{marginTop: '40px', padding: '10px 20px', background: 'var(--text-dark)', color: 'white', border: 'none', cursor: 'pointer'}}>← Back to Home</button>
        </div>
      </div>
    );
  }

  // Magazine Home View
  const heroPost = posts[0];
  const subHero1 = posts[1];
  const subHero2 = posts[2];
  const mainPosts = posts.slice(3, 11);
  const sidebarPosts = posts.slice(11, 16);

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
          <li><a href="#">Videos</a></li>
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

      <div className="main-layout">
        <main>
          <div className="section-title">
            <span>Latest Articles</span>
            <span style={{fontSize: '0.8rem', color: '#666', fontWeight: 'normal'}}>View All</span>
          </div>
          
          <div className="post-grid">
            {mainPosts.map(post => (
              <div className="post-card" key={post.id} onClick={() => setSelectedPost(post)} style={{cursor: 'pointer'}}>
                <img src={`https://picsum.photos/400/250?random=${post.id}`} alt="" className="post-card-img" />
                <div className="category">{post.category}</div>
                <h3>{post.title}</h3>
                <div className="meta">By Admin • {new Date().toLocaleDateString()}</div>
                <p>{post.content.replace(/<[^>]+>/g, '').substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </main>

        <aside>
          <div className="sidebar-widget">
            <div className="section-title"><span>Stay Connected</span></div>
            <div className="social-counter">
              <div className="social-box fb">125K <span>Fans</span></div>
              <div className="social-box tw">82K <span>Followers</span></div>
              <div className="social-box ig">64K <span>Followers</span></div>
              <div className="social-box yt">1.2M <span>Subscribers</span></div>
            </div>
          </div>

          <div className="sidebar-widget">
            <div className="section-title"><span>Don't Miss</span></div>
            {sidebarPosts.map(post => (
              <div className="list-post" key={post.id} onClick={() => setSelectedPost(post)} style={{cursor: 'pointer'}}>
                <img src={`https://picsum.photos/100/100?random=${post.id}`} className="list-post-img" alt="" />
                <div className="list-post-info">
                  <div style={{color: 'var(--primary-color)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase'}}>{post.category}</div>
                  <h4>{post.title.substring(0, 50)}...</h4>
                  <div style={{fontSize: '0.7rem', color: '#888'}}>Just now</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-widget">
            <div style={{background: '#f8f8f8', border: '1px solid #eaeaea', padding: '20px', textAlign: 'center'}}>
              <h3 style={{marginBottom: '10px'}}>Subscribe to Newsletter</h3>
              <p style={{fontSize: '0.8rem', color: '#666', marginBottom: '15px'}}>Get the latest news and updates directly in your inbox.</p>
              <input type="email" placeholder="Email Address" style={{width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc'}} />
              <button style={{width: '100%', padding: '10px', background: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer'}}>SUBSCRIBE</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
