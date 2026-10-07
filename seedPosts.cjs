const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const authorId = '87e34112-7d56-4784-b072-17813136280b';

const ideas = [
  {
    title: "1. Scene report: The State of Deep Sleep Meditation",
    category: "Deep Sleep",
    tags: ["sleep", "trends", "meditation"],
    content: `
      <p>Give the state of the union on your niche topic: What’s new and changing, who is making moves, and what’s on the horizon for enthusiasts of deep sleep meditation.</p>
      <h2>The Shift in Sleep Science</h2>
      <p>We are seeing a massive shift in how people approach sleep. It is no longer just about resting; it is about active recovery.</p>
      <div style="margin: 2rem 0;">
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/5qap5aO4i9A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p>As seen in our latest channel update, incorporating sound frequencies like binaural beats has revolutionized how quickly we can enter REM sleep. Stay tuned as we explore these trends further.</p>
    `
  },
  {
    title: "2. Interesting intersections: Mindfulness and Productivity",
    category: "Mindfulness",
    tags: ["productivity", "focus", "work"],
    content: `
      <p>How does mindfulness intersect with productivity? We explore how slowing down can actually help you speed up at work.</p>
      <h2>The Productivity Paradox</h2>
      <p>Taking 10 minutes to meditate can save you 2 hours of distracted work.</p>
      <div style="margin: 2rem 0;">
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/inpok4MKVLM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p>Watch our video above to learn the exact breathing techniques to use before a big meeting. It completely shifts your nervous system from fight-or-flight to rest-and-digest.</p>
    `
  },
  {
    title: "3. Product review roundup: Best Meditation Cushions of 2026",
    category: "Meditation",
    tags: ["gear", "reviews", "cushions"],
    content: `
      <p>A roundup of the top meditation products and detailed reviews for each one.</p>
      <h2>Posture is Everything</h2>
      <p>Finding the right cushion can make or break your meditation habit. Here are our top 3 picks for this year.</p>
      <div style="margin: 2rem 0;">
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/ZToicYcHIOU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p>Whether you prefer buckwheat hulls or memory foam, make sure your hips are elevated above your knees. Check the video for our full breakdown.</p>
    `
  },
  {
    title: "4. Behind-the-scenes: How We Record Our Sleep Sounds",
    category: "Sleep Science",
    tags: ["bts", "audio", "nature"],
    content: `
      <p>Take your audience behind the scenes of our creative process through a video tour.</p>
      <h2>Capturing the Rain</h2>
      <p>Ever wondered how we get those perfectly crisp thunderstorm sounds? It involves a lot of waiting and very expensive microphones.</p>
      <div style="margin: 2rem 0;">
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/FjHGZj2IjBk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p>In this BTS vlog, you can see our audio engineers out in the field. It's a wet job, but someone has to do it for the perfect sleep ambiance!</p>
    `
  },
  {
    title: "5. Expert interview series: Dr. Walker on Anxiety",
    category: "Anxiety Relief",
    tags: ["expert", "interview", "science"],
    content: `
      <p>Interview industry experts in your niche and share their insights, tips, and advice.</p>
      <h2>Understanding the Amygdala</h2>
      <p>We sat down with leading neuroscientist Dr. Walker to discuss why our brains spiral into anxiety loops.</p>
      <div style="margin: 2rem 0;">
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/8TuRYVN8zc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p>His insights on using cold exposure and breathwork to manually override panic attacks are truly groundbreaking.</p>
    `
  },
  {
    title: "6. Beginner's guide: 5 Minutes to Mindfulness",
    category: "Mindfulness",
    tags: ["beginners", "guide", "basics"],
    content: `
      <p>Write a comprehensive beginner's guide to a specific topic or skill in your niche.</p>
      <h2>Start Small</h2>
      <p>You don't need to sit on a mountain for an hour. You just need 5 minutes.</p>
      <div style="margin: 2rem 0;">
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/U9YKY7fdwyg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p>Follow along with our guided beginner session above. Just focus on the breath. If your mind wanders, gently bring it back. That is the whole practice.</p>
    `
  },
  {
    title: "12. How-to video tutorial: Box Breathing Technique",
    category: "Breathwork",
    tags: ["tutorial", "breathing", "stress"],
    content: `
      <p>Create a step-by-step video tutorial demonstrating how to perform a specific task.</p>
      <h2>Inhale 4, Hold 4, Exhale 4, Hold 4</h2>
      <p>Used by Navy SEALs to stay calm under pressure, box breathing is the ultimate stress hack.</p>
      <div style="margin: 2rem 0;">
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/tEmt1Znux58" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p>Breathe with the visualizer in our video. Notice how your heart rate drops almost immediately.</p>
    `
  },
  {
    title: "14. Myth busting: You Don't Have to Clear Your Mind",
    category: "Meditation",
    tags: ["myths", "truth", "practice"],
    content: `
      <p>Debunk common myths or misconceptions in your niche and provide evidence-based explanations.</p>
      <h2>The Empty Mind Fallacy</h2>
      <p>The biggest reason people quit meditation is because they think they failed when a thought pops up.</p>
      <div style="margin: 2rem 0;">
        <iframe width="100%" height="400" src="https://www.youtube.com/embed/syx3a1_LeFo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <p>The brain is a thought-generating machine. You cannot stop it. The goal is simply to observe the thoughts without getting swept away by them.</p>
    `
  }
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim() + '-' + Math.random().toString(36).substr(2, 5);
}

async function seed() {
  console.log('Seeding posts...');
  for (const idea of ideas) {
    const postData = {
      title: idea.title,
      content: idea.content,
      category: idea.category,
      tags: idea.tags,
      slug: slugify(idea.title),
      status: 'published',
      author_id: authorId,
      views: Math.floor(Math.random() * 500) + 50,
      likes_count: Math.floor(Math.random() * 50) + 5
    };
    
    const { error } = await supabase.from('posts').insert(postData);
    if (error) console.error('Error inserting:', idea.title, error.message);
    else console.log('Inserted:', idea.title);
  }
  console.log('Done!');
}

seed();
