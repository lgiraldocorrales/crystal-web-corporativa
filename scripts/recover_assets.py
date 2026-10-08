"""Recover exact source bytes locally; recursively resolve CSS fonts/backgrounds."""
from pathlib import Path
from urllib.parse import urlparse, urljoin, quote, unquote
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
import json, re, hashlib, shutil
ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
AUDIT=ROOT.parent/'audit'
def local_path(url):
    p=urlparse(url)
    if p.netloc in ['crystal.com.co','www.crystal.com.co']:return p.path
    return '/assets/vendor/'+hashlib.sha256(url.encode()).hexdigest()[:16]+('.css' if p.netloc=='fonts.googleapis.com' else Path(p.path).suffix)
def recover(url):
    local=local_path(url);dest=PUBLIC/unquote(local).lstrip('/')
    cache=AUDIT/'recovered-assets'/unquote(urlparse(url).path).lstrip('/')
    try:
        if not dest.exists():
            dest.parent.mkdir(parents=True,exist_ok=True)
            if urlparse(url).netloc in ['crystal.com.co','www.crystal.com.co'] and cache.exists():shutil.copyfile(cache,dest)
            else:
                parsed=urlparse(url);safe=parsed._replace(path=quote(unquote(parsed.path),safe='/'),netloc='www.crystal.com.co' if parsed.netloc=='crystal.com.co' else parsed.netloc).geturl()
                with urlopen(Request(safe,headers={'User-Agent':'Mozilla/5.0'}),timeout=25) as r:
                    data=r.read()
                    if 'text/html' in r.headers.get('Content-Type',''):raise ValueError('Asset returned HTML')
                    dest.write_bytes(data)
        dependencies=[]
        if dest.suffix=='.css' or 'fonts.googleapis.com' in url:
            text=dest.read_text()
            def rewrite(m):
                src=m[1].strip(' \"\'')
                if src.startswith(('data:','/assets/vendor/')):return m[0]
                dep=urljoin(url,src);dependencies.append(dep)
                return 'url('+json.dumps(local_path(dep))+')'
            text=re.sub(r'url\(([^)]+)\)',rewrite,text);dest.write_text(text)
        return {'url':url,'local':local,'bytes':dest.stat().st_size,'dependencies':dependencies}
    except Exception as e:return {'url':url,'local':local,'error':str(e)}
urls=set(json.loads((ROOT/'src/data/asset-manifest.json').read_text()))
seen=set();results=[]
while urls-seen:
    batch=sorted(urls-seen);seen.update(batch)
    with ThreadPoolExecutor(max_workers=8) as pool:res=list(pool.map(recover,batch))
    results.extend(res)
    for r in res:urls.update(r.get('dependencies',[]))
    print('Processed',len(results),'failed',sum('error' in r for r in results),flush=True)
(ROOT/'docs/asset-recovery.json').write_text(json.dumps(results,indent=2))
print('Bytes:',sum(r.get('bytes',0) for r in results))
print(json.dumps([r for r in results if 'error' in r],indent=2))
