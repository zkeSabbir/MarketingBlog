import json

with open('public/blogs_index.json', 'r', encoding='utf-8') as f:
    blogs = json.load(f)

print(f'Total blogs to add to sitemap: {len(blogs)}')

xml_header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
xml_footer = '</urlset>\n'

entries = [
    '  <url>\n    <loc>https://deepmeditationblog.netlify.app/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>'
]

# Write up to 10,000 URLs
for b in blogs[:10000]:
    slug = b.get('slug')
    created = b.get('created_at', '2024-01-01T00:00:00Z')[:10]
    entries.append(f'  <url>\n    <loc>https://deepmeditationblog.netlify.app/post/{slug}</loc>\n    <lastmod>{created}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>')

with open('public/sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(xml_header + '\n'.join(entries) + '\n' + xml_footer)

print('Generated public/sitemap.xml successfully!')
