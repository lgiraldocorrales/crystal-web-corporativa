"""CI audit using Python stdlib: routes, assets, links, SEO and source injections."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote,urljoin
import json,re,sys,hashlib
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):super().__init__();self.urls=[];self.h1=0;self.canonical=False;self.title=False;self.description=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='h1':self.h1+=1
        if tag=='title':self.title=True
        if tag=='link' and a.get('rel')=='canonical':self.canonical=True
        if tag=='meta' and a.get('name')=='description':self.description=True
        for key in ['src','href']:
            if a.get(key):self.urls.append((tag,key,a[key]))
        if a.get('style'):
            self.urls.extend(('style','url',u) for u in re.findall(r'url\([\'\"]?([^\)\'\"]+)',a['style']))
routes=json.loads((ROOT/'src/data/routes.json').read_text());failures=[]
for route in routes:
    path=ROOT/'dist'/route['route'].lstrip('/')/'index.html'
    if not path.exists():failures.append([route['route'],'missing route']);continue
    html=path.read_text();page=Page();page.feed(html)
    if not page.title or not page.canonical or not page.description:failures.append([route['route'],'SEO missing'])
    if page.h1!=1:failures.append([route['route'],'h1 count',page.h1])
    if 'InsightJs' in html or 'tmDropbox' in html:failures.append([route['route'],'capture injection'])
    for tag,key,url in page.urls:
        if url.startswith(('#','data:','mailto:','tel:','javascript:','http:','https:','//')):continue
        parsed=urlparse(urljoin('https://crystal.test'+route['route']+'/',url));p=ROOT/'dist'/unquote(parsed.path).lstrip('/')
        if not p.is_file() and not (p/'index.html').is_file():failures.append([route['route'],tag,key,url])
report={'routes':len(routes),'failures':failures,'robots_exists':(ROOT/'dist/robots.txt').exists(),'sitemap_exists':(ROOT/'dist/sitemap.xml').exists()}
integrity=ROOT/'docs/image-integrity.json'
if integrity.exists():
    for known_bad in json.loads(integrity.read_text()):
        candidate=ROOT/'dist'/known_bad['path']
        if candidate.is_file():
            with candidate.open('rb') as asset: digest=hashlib.file_digest(asset,'sha256').hexdigest()
            if digest==known_bad.get('sha256'):failures.append([known_bad['path'],'corrupt original image; valid source replacement required'])
(ROOT/'docs/site-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if failures or not report['robots_exists'] or not report['sitemap_exists'] else 0)
