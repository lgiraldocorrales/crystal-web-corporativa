"""Translate the audited capture into native static Astro templates, without redesign.

Run from repository root. The source paths are explicit; never reads credentials.
Requires beautifulsoup4 for the one-time migration, not for runtime or CI.
"""
from pathlib import Path
from bs4 import BeautifulSoup, Tag, Comment
from urllib.parse import urlparse, urljoin
from PIL import Image
import json, re, hashlib, shutil

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT.parent / 'audit'
SOURCE = AUDIT / 'source/crystal_page_demo-main'
PAGES = ROOT / 'src/pages'
COMPONENTS = ROOT / 'src/components'
PUBLIC = ROOT / 'public'
for d in [PAGES, COMPONENTS, PUBLIC, ROOT/'src/data', ROOT/'src/styles', ROOT/'src/scripts', ROOT/'src/layouts']:
    d.mkdir(parents=True, exist_ok=True)
sources = {('/'+p.parent.relative_to(SOURCE).as_posix()).replace('/.','/'):p for p in SOURCE.rglob('index.html')}
recovered = AUDIT / 'recovered-pages'
sources.update({'/'+p.parent.relative_to(recovered).as_posix():p for p in recovered.rglob('index.html')})
routes = set(sources)
pairs = {'/':'/en','/marcas':'/Brands','/hilandProductos':'/SpinningProducts'}
for line in (SOURCE/'LANGUAGE-MAPPING.txt').read_text().splitlines():
    es,en = line.split(' <-> '); pairs[es]=en
for es_prefix,en_prefix in [('historiaC','OurHistory'),('PersonasEmpleados','PeopleEmployees'),('medioAmbiente','Environment'),('sostenibilidadReporte','SustainabilityReport')]:
    for route in routes:
        if route.startswith('/'+es_prefix+'/'):
            en='/'+en_prefix+'/'+route.split('/',2)[2]
            if en in routes:pairs[route]=en
reverse={en:es for es,en in pairs.items()}
for name in ['openEnd','speciality','ringSpun']:
    if '/_localized/en/'+name in routes:
        pairs['/'+name]='/_localized/en/'+name
        reverse['/_localized/en/'+name]='/'+name
asset_urls=set()
component_by_hash={}
records=[]
differences=[]

def static_url(url, base):
    if url.startswith(('data:','#','mailto:','tel:','javascript:')):return url
    absolute=urljoin('https://www.crystal.com.co'+base+'/',url)
    p=urlparse(absolute)
    if p.netloc in ['www.crystal.com.co','crystal.com.co'] and p.path.startswith('/static/'):
        asset_urls.add(absolute);return p.path
    if p.netloc in ['cdnjs.cloudflare.com','ajax.googleapis.com','unpkg.com','fonts.googleapis.com','cdn.jsdelivr.net','fonts.gstatic.com']:
        asset_urls.add(absolute)
        return '/assets/vendor/'+hashlib.sha256(absolute.encode()).hexdigest()[:16]+('.css' if p.netloc=='fonts.googleapis.com' else Path(p.path).suffix)
    return url

def normalize_href(url, route):
    if not url or url.startswith(('#','mailto:','tel:','javascript:')):return url
    absolute=urljoin('https://www.crystal.com.co'+route.rstrip('/')+'/',url)
    p=urlparse(absolute)
    if p.netloc not in ['crystal.com.co','www.crystal.com.co']:return url
    path=p.path
    if path.startswith('/static/'):return static_url(url,route)
    path=path.removesuffix('/index.html').rstrip('/') or '/'
    return path+('?' + p.query if p.query else '')+('#'+p.fragment if p.fragment else '')

def fragment(tag):
    text=str(tag)
    # Raw scripts and styles are preserved and must not be interpreted/scoped by Astro.
    text=re.sub(r'<script(?=[\s>])', '<script is:inline', text)
    text=re.sub(r'<style(?=[\s>])', '<style is:inline', text)
    return text

def shared(tag, name, imports):
    text=fragment(tag);key=hashlib.sha256(text.encode()).hexdigest()
    if key not in component_by_hash:
        component_by_hash[key]=name+key[:8]
        (COMPONENTS/(component_by_hash[key]+'.astro')).write_text('---\n/** Static source fragment. No client hydration: the original DOM/scripts provide behavior. */\ninterface Props {}\n// No frontmatter transformation: retain the audited original markup.\n---\n'+text+'\n')
    component=component_by_hash[key];imports.add(component)
    tag.replace_with(BeautifulSoup('<'+component+' />','html.parser'))
    return component

for route,path in sorted(sources.items()):
    # Browsers treat stray closing BR tags as line breaks; retain that legacy behavior.
    raw=re.sub(r'</br\s*>','<br>',path.read_text(),flags=re.I)
    soup=BeautifulSoup(raw,'html.parser')
    for comment in list(soup.find_all(string=lambda value:isinstance(value,Comment))):comment.extract()
    if not soup.html or not soup.body:raise ValueError('Incomplete source: '+route)
    lang='en' if route in reverse else 'es'
    alternate=reverse.get(route) if lang=='en' else pairs.get(route)
    imports=set()
    # Remove capture-only endpoint monitoring; it is not Crystal functionality.
    for script in list(soup.find_all('script')):
        content=script.get_text()
        if 'tmDropbox' in content or 'InsightJs' in content or script.get('id')=='crystal-reviewed-language-switch':script.decompose();continue
        if 'var form= document.getElementById' in content and 'submitformData' in content:
            script.clear();script['src']='/assets/contact.js';continue
        if content:
            content=re.sub(r"console\.log\([^\n]*\)\s*;?",'',content)
            content=content.replace("$('.slider').slider('prev');", "M.Slider.getInstance(document.querySelector('.slider'))?.prev();").replace("$('.slider').slider('next');", "M.Slider.getInstance(document.querySelector('.slider'))?.next();")
            content=content.replace("$('.modal-trigger').leanModal", "$('.modal').modal")
            content=content.replace('AOS.init();', "AOS.init({ disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches });")
            # Keep timing for ordinary visitors; stop automatic carousel for reduced motion.
            content=content.replace('carousel(); // Inicia', "showDivs(0); if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) carousel(); // Inicia")
            content=re.sub(r"(['\"])(/static/[^'\"]+)\1",lambda m:json.dumps(static_url(m[2],route)),content)
            script.string=content
    for token in list(soup.select('input[name="csrfmiddlewaretoken"]')):token.decompose()
    # Language switching becomes local static navigation instead of Django POST.
    for button in soup.select('button[name="language"]'):
        target=route if button.get('value')==lang else (alternate or ('/en' if button.get('value')=='en' else '/'))
        button['type']='button';button['onclick']='document.cookie='+json.dumps('django_language='+button.get('value','es')+';path=/;SameSite=Lax')+';window.location.href='+json.dumps(target)
        for attr in list(button.attrs):
            if attr not in ['name','value','class','title','style','type','onclick','onmouseover','onmouseout']:del button[attr]
    for f in soup.find_all('form'):
        if f.find('button',attrs={'name':'language'}):f['action']='#';f['method']='get'
    for tag in soup.find_all(True):
        target=tag.get('data-demo-unmapped')
        if target and tag.name=='a' and normalize_href(target,route).split('#')[0] in routes:
            tag['href']=normalize_href(target,route)
        for attr in list(tag.attrs):
            if attr.startswith('data-demo-'):del tag[attr]
        if tag.get('src'):tag['src']=static_url(tag['src'],route)
        if tag.get('srcset'):
            tag['srcset']=', '.join(' '.join([static_url(candidate.strip().split()[0],route),*candidate.strip().split()[1:]]) for candidate in tag['srcset'].split(',') if candidate.strip())
        if tag.get('href'):tag['href']=normalize_href(tag['href'],route)
        if tag.name=='link' and tag.get('href','').startswith(('https://cdnjs.','https://fonts.googleapis.','https://unpkg.')):tag['href']=static_url(tag['href'],route)
        if tag.get('style'):tag['style']=re.sub(r'url\([\'\"]?([^\)\'\"]+)\)?',lambda m:'url('+json.dumps(static_url(m[1],route))+')',tag['style'])
        if tag.name=='img' and tag.get('src','').startswith('/static/') and 'responsive-img' in tag.get('class',[]):
            asset=PUBLIC/tag['src'].lstrip('/')
            try:
                with Image.open(asset) as image:
                    if not tag.has_attr('width') and not tag.has_attr('height'):
                        tag['width']=str(image.width);tag['height']=str(image.height)
            except (OSError,ValueError):pass
    for style in soup.find_all('style'):
        style.string=re.sub(r'url\([\'\"]?([^\)\'\"]+)\)?',lambda m:'url('+json.dumps(static_url(m[1],route))+')',style.get_text())
    for f in soup.select('#form'):
        f['action']='/api/contact'
        for field in f.find_all(['input','textarea','select']):
            if field.get('id'):field['name']=field['id']
        f.append(BeautifulSoup('<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-10000px" /><div id="contact-status" role="status" aria-live="polite"></div>','html.parser'))
    # External classic scripts retain their original blocking order and global scope.
    # They are source JavaScript, not client-hydrated framework components.
    scripts_dir=PUBLIC/'assets/scripts';scripts_dir.mkdir(parents=True,exist_ok=True)
    for script in soup.find_all('script'):
        if script.get('src') or script.get('type')=='application/ld+json':continue
        code=str(script.string or '')
        if not code.strip():script.decompose();continue
        name=hashlib.sha256(code.encode()).hexdigest()[:16]+'.js'
        (scripts_dir/name).write_text(code)
        script.clear();script['src']='/assets/scripts/'+name
    title=soup.title.get_text(strip=True) if soup.title else 'Crystal S.A.S'
    if soup.title:soup.title.decompose()
    # Keep visual heading typography while adding the missing semantic primary heading.
    h1=soup.find_all('h1')
    if not h1:
        heading=soup.body.find(['h2','h3','h4','h5'])
        if heading:
            old=heading.name;heading.name='h1';heading['class']=heading.get('class',[])+['source-'+old]
        else:
            heading=soup.new_tag('h1',attrs={'class':'sr-only'});heading.string=title;soup.body.insert(0,heading)
    elif len(h1)>1:
        for heading in h1[1:]:heading.name='h2';heading['class']=heading.get('class',[])+['source-h1']
    primary=soup.body.find('h1')
    if primary:primary['id']='main-content';primary['tabindex']='-1'
    paras=[p.get_text(' ',strip=True) for p in soup.body.find_all('p') if len(p.get_text(' ',strip=True))>50]
    description=paras[0][:160] if paras else ''
    records.append({'route':route,'publicRoute':route.replace('/_localized/en',''),'language':lang,'alternate':alternate,'title':title,'description':description,'source':'zip' if path.is_relative_to(SOURCE) else 'production-recovery'})
    # The two header blocks and two footer blocks remain separate, matching their original hierarchy.
    wrapper=soup.body.find('div',recursive=False)
    row=wrapper.find('div',recursive=False) if wrapper else None
    if row and 'row' in row.get('class',[]):
        divs=row.find_all('div',recursive=False)
        for i,tag in enumerate(divs[:2]):shared(tag,('DesktopHeader' if i==0 else 'MobileHeader')+lang.title(),imports)
        for tag in list(row.find_all('div',recursive=False)):
            classes=tag.get('class',[])
            if 'footer-desktop' in classes or 'footer-mobile' in classes:shared(tag,('DesktopFooter' if 'footer-desktop' in classes else 'MobileFooter')+lang.title(),imports)
    head=''.join(fragment(t) if isinstance(t,Tag) else str(t) for t in soup.head.contents)
    body=''.join(fragment(t) if isinstance(t,Tag) else str(t) for t in soup.body.contents)
    # BeautifulSoup lowercases temporary component placeholders; restore Astro import names.
    for component in imports:body=re.sub(r'<'+component.lower()+r'\s*></'+component.lower()+'>', '<'+component+' />',body)
    imports_text="import OriginalLayout from '../layouts/OriginalLayout.astro';\n"+''.join("import "+c+" from '../components/"+c+".astro';\n" for c in sorted(imports))
    name='Home' if route=='/' else re.sub(r'[^A-Za-z0-9]','_',route.lstrip('/'))
    # A single dynamic static route dispatcher imports native page components.
    (COMPONENTS/('Page_'+name+'.astro')).write_text('---\n'+imports_text+'/** Static page. No client hydration is required. */\ninterface Props {}\n// Content comes from the audited HTML; SEO and locale are resolved centrally.\n---\n<OriginalLayout route='+json.dumps(route)+'>\n<Fragment slot="head">'+head+'</Fragment>\n'+body+'\n</OriginalLayout>\n')
    records[-1]['component']='Page_'+name

(ROOT/'src/data/routes.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
(ROOT/'src/data/asset-manifest.json').write_text(json.dumps(sorted(asset_urls),indent=2)+'\n')
dispatch='---\n'+''.join('import '+r['component']+" from '../components/"+r['component']+".astro';\n" for r in records)+"import routes from '../data/routes.json';\n/** Static route parameters emitted at build time. */\ninterface Props {}\nconst components = {"+','.join(r['component'] for r in records)+"};\nexport function getStaticPaths() { return routes.map(r => ({params:{slug:r.route === '/' ? undefined : r.route.slice(1)},props:{component:r.component}})); }\n// Resolve one native Astro page component; no HTML strings or hydration.\nconst Page = components[Astro.props.component as keyof typeof components];\n---\n<Page />\n"
(PAGES/'[...slug].astro').write_text(dispatch.replace('interface Props {}','interface Props {\n /** Name of the native page component generated for this route. */\n component: string;\n}'))
active='\n'.join(p.read_text() for p in COMPONENTS.glob('Page_*.astro'))
for p in COMPONENTS.glob('*.astro'):
    if p.name.startswith(('DesktopHeader','MobileHeader','DesktopFooter','MobileFooter')) and p.name not in active:p.unlink()
script_refs='\n'.join(p.read_text() for p in COMPONENTS.glob('*.astro'))
for p in (PUBLIC/'assets/scripts').glob('*.js'):
    if '/assets/scripts/'+p.name not in script_refs:p.unlink()
print('Native Astro pages:',len(records),'shared fragments:',len(component_by_hash),'asset URLs:',len(asset_urls))
