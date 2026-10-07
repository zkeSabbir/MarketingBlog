import urllib.request
import re
import json

url = "https://www.youtube.com/@AVADeepMeditation/videos"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # Find ytInitialData
    match = re.search(r'var ytInitialData = (\{.*?\});</script>', html)
    if match:
        data = json.loads(match.group(1))
        # Simple extraction via string search to avoid complex json traversal
        videos = []
        import re
        # Find all watch endpoints
        video_matches = re.finditer(r'"videoId":"([^"]+)".*?"title":\{"runs":\[\{"text":"([^"]+)"', html)
        seen = set()
        for m in video_matches:
            vid = m.group(1)
            title = m.group(2)
            if vid not in seen:
                seen.add(vid)
                videos.append({"id": vid, "title": title})
        
        with open("d:\\Youtube Upload\\MarketingBlog\\frontend\\youtube_videos.json", "w", encoding='utf-8') as f:
            json.dump(videos, f, indent=4)
        print(f"Extracted {len(videos)} videos")
    else:
        print("Could not find ytInitialData")
except Exception as e:
    print(f"Error: {e}")
