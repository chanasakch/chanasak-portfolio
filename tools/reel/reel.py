import asyncio,sys,os,shutil
from playwright.async_api import async_playwright
A=["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]
FPS=30; DT=1000/FPS; B='http://localhost:3100'
ADV="""(dt)=>{const m=window.__vt||(window.__vt=new WeakMap());for(const a of document.getAnimations()){try{const v=(m.has(a)?m.get(a):0)+dt;m.set(a,v);a.pause();const end=a.effect&&a.effect.getComputedTiming().endTime;if(end!=null&&isFinite(end)&&v>=end){a.currentTime=end;a.finish();}else a.currentTime=v;}catch(e){}}}"""
LABEL="""([n,d])=>{document.getElementById('reel-label')?.remove();if(!n)return;const el=document.createElement('div');el.id='reel-label';el.style.cssText='position:fixed;left:32px;bottom:32px;z-index:2147483647;display:flex;gap:10px;align-items:baseline;padding:11px 18px;border-radius:999px;background:rgba(20,20,19,.72);color:#f3f3f0;font:500 15px "Hanken Grotesk Variable",system-ui,sans-serif;letter-spacing:-.01em;backdrop-filter:blur(10px);opacity:0;transform:translateY(8px);transition:opacity .6s ease,transform .6s ease';el.innerHTML='<b style="font-weight:650">'+n+'</b><span style="opacity:.6">'+d+'</span>';document.body.appendChild(el);requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.opacity='1';el.style.transform='none'}))}"""
HIDE='a.fixed[href="/"],nextjs-portal{display:none!important}'
class R:
    def __init__(s,pg,out): s.pg=pg; s.out=out; s.n=0; os.makedirs(out,exist_ok=True)
    async def cap(s,sec,each=None):
        for i in range(round(sec*FPS)):
            if each: await each(i)
            dt=round((s.n+1)*DT)-round(s.n*DT)
            await s.pg.clock.run_for(dt); await s.pg.evaluate(ADV,dt)
            await s.pg.screenshot(path=f'{s.out}/{s.n:05d}.jpg',type='jpeg',quality=95); s.n+=1
async def openp(b,path,label=None,wait=3000):
    pg=await b.new_page(viewport={'width':1440,'height':900},device_scale_factor=2)
    cdp=await pg.context.new_cdp_session(pg); await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate',{'playbackRate':0})
    await pg.clock.install(time=1_800_000_000_000); await pg.clock.pause_at(1_800_000_000_500)
    await pg.goto(B+path,wait_until='load'); await pg.add_style_tag(content=HIDE); await pg.wait_for_timeout(wait)
    await pg.evaluate(ADV,0); await cdp.send('Animation.setPlaybackRate',{'playbackRate':1})
    await pg.mouse.move(1500,1000)
    if label: await pg.evaluate(LABEL,label)
    return pg
async def lenis(pg,y,dur): await pg.evaluate(f"window.__lenis&&window.__lenis.scrollTo({y},{{duration:{dur},easing:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}})")
async def jump(pg,y):
    j=f"window.__lenis?window.__lenis.scrollTo({y},{{immediate:true,force:true}}):scrollTo(0,{y})"
    await pg.evaluate(j); await pg.clock.run_for(150); await pg.evaluate(j); await pg.clock.run_for(50)
async def center(pg,sel):
    bb=await pg.locator(sel).first.bounding_box(); return bb['x']+bb['width']/2, bb['y']+bb['height']/2
async def glide(pg,r,sel,sec=0.5):
    x,y=await center(pg,sel); p=await pg.evaluate('[0,0]')
    sx,sy=getattr(r,'mx',1300),getattr(r,'my',800); n=round(sec*FPS)
    async def mv(i):
        t=(i+1)/n; e=1-(1-t)**3; await pg.mouse.move(sx+(x-sx)*e, sy+(y-sy)*e)
    await r.cap(sec,mv); r.mx,r.my=x,y
async def click(pg,r,sel,sec=0.5):
    await glide(pg,r,sel,sec); await pg.mouse.down(); await pg.mouse.up()

async def s_profile(b,o):
    pg=await openp(b,'/'); r=R(pg,o); await r.cap(2.6); await lenis(pg,650,1.6); await r.cap(1.8)
async def s_parfum(b,o):
    pg=await openp(b,'/parfum',['HOM','Perfume house, bottle in real-time 3D'],5000); r=R(pg,o); await r.cap(1.8)
    y=await pg.evaluate("document.getElementById('craft').getBoundingClientRect().top+scrollY+600"); await lenis(pg,y,3.2); await r.cap(3.4)
async def s_jewelry(b,o):
    pg=await openp(b,'/jewelry',['PHLOI','Ring configurator'],5000); r=R(pg,o); await r.cap(2.8)
    await click(pg,r,'button:has-text("Ruby")'); await r.cap(0.8)
    await click(pg,r,'button:has-text("Look closer")'); await r.cap(1.6)
    await click(pg,r,'input[placeholder="A date or a name"]',0.5)
    async def typ(i):
        s="T + P 12.11.26"
        if i%3==0 and i//3<len(s): await pg.keyboard.type(s[i//3])
    await r.cap(1.6,typ); await r.cap(1.6)
async def s_loom(b,o):
    pg=await openp(b,'/furniture',['Loom & Tide','Furniture shop'],4000); r=R(pg,o); await r.cap(2.4)
async def s_loom2(b,o):
    pg=await openp(b,'/furniture/products/kanok-armchair',['Loom & Tide','Product page with photo zoom'],4000); r=R(pg,o); await r.cap(0.5)
    await click(pg,r,'button[aria-label="Enlarge photo 1"]',0.5); await r.cap(0.9)
    x,y=760,470; await glide(pg,r,'[role=dialog] img',0.3); await pg.mouse.down(); await pg.mouse.up()
    async def pan(i): await pg.mouse.move(700+i*6, 420+i*2)
    await r.cap(1.6,pan)
async def s_din(b,o):
    pg=await openp(b,'/ceramics',['DIN','Stoneware you drag through'],4000); await pg.clock.run_for(1700); await pg.evaluate(ADV,2000); r=R(pg,o); await r.cap(1.2)
    await pg.mouse.move(900,500); await pg.mouse.down()
    async def drag(i): await pg.mouse.move(900-i*14, 500-i*6)
    await r.cap(1.4,drag); await pg.mouse.up(); await r.cap(1.4)
async def s_hotel(b,o):
    pg=await openp(b,'/hotel',['Ruen Doi','Boutique hotel, one day by the hour'],4000); r=R(pg,o); await r.cap(1.2)
    H=await pg.evaluate('document.documentElement.scrollHeight'); await lenis(pg,int(H*0.62),3.6); await r.cap(3.8)
async def s_rim(b,o):
    pg=await openp(b,'/residence',['RIM NAM','Riverside residences'],4000); r=R(pg,o)
    y=await pg.evaluate("document.querySelector('svg[aria-label=\"Choose a floor\"]').getBoundingClientRect().top+scrollY-120"); await jump(pg,y); await r.cap(0.5)
    opts=pg.locator('g[role=option]'); n=await opts.count()
    for k in [int(n*0.8),int(n*0.55),int(n*0.3)]:
        bb=await opts.nth(k).bounding_box(); sx,sy=getattr(r,'mx',1300),getattr(r,'my',800)
        async def mv(i,bb=bb,sx=sx,sy=sy):
            t=(i+1)/12; e=1-(1-t)**3; await pg.mouse.move(sx+(bb['x']+bb['width']/2-sx)*e, sy+(bb['y']+bb['height']/2-sy)*e)
        await r.cap(0.4,mv); r.mx,r.my=bb['x']+bb['width']/2,bb['y']+bb['height']/2; await pg.mouse.down(); await pg.mouse.up(); await r.cap(0.6)
    await r.cap(0.8)
async def s_silk(b,o):
    pg=await openp(b,'/silk',['Mudmee House','Silk woven on screen, hung in 3D'],5000); r=R(pg,o); await r.cap(2.2)
async def s_silk2(b,o):
    pg=await openp(b,'/silk',['Mudmee House','Design your own piece'],5000)
    y=await pg.evaluate("document.getElementById('design').getBoundingClientRect().top+scrollY-80"); await jump(pg,y); r=R(pg,o); await r.cap(0.4)
    await click(pg,r,'button:has-text("Monsoon")',0.5); await r.cap(1.4)
    await click(pg,r,'button:has-text("Lai nam")',0.4); await r.cap(1.4)
    await click(pg,r,'button:has-text("draped")',0.4); await r.cap(1.8)
async def s_coffee(b,o):
    pg=await openp(b,'/coffee',['Sung Coffee','Coffee roaster'],4000); r=R(pg,o); await r.cap(2.2)
async def s_coffee2(b,o):
    pg=await openp(b,'/coffee',['Sung Coffee','Brew guide with a timer'],4000)
    y=await pg.evaluate("document.getElementById('brew').getBoundingClientRect().top+scrollY-80"); await jump(pg,y); r=R(pg,o); await r.cap(0.4)
    await click(pg,r,'button:has-text("Start the timer")',0.5)
    await r.cap(3.2)
async def s_nava(b,o):
    pg=await openp(b,'/charter',['NAVA','Boat charter planner'],4000); r=R(pg,o); await r.cap(1.8)
async def s_nava2(b,o):
    pg=await openp(b,'/charter',['NAVA','Pick islands, see the day and the price'],4000)
    y=await pg.evaluate("document.getElementById('plan').getBoundingClientRect().top+scrollY-90"); await jump(pg,y); r=R(pg,o); await r.cap(0.4)
    await click(pg,r,'button:has-text("Phi Phi")',0.5); await r.cap(1.3)
    await click(pg,r,'button:has-text("Limestone bay")',0.5); await r.cap(1.3)
    await click(pg,r,'button:has-text("Duean")',0.5); await r.cap(1.4)
async def s_end(b,o):
    pg=await openp(b,'/',None,3000)
    y=await pg.evaluate("document.getElementById('contact').getBoundingClientRect().top+scrollY-260"); await jump(pg,y); r=R(pg,o); await r.cap(3.2)

async def main():
    name=sys.argv[1]; out=f'frames/{name}'; shutil.rmtree(out,ignore_errors=True)
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=A)
        await globals()['s_'+name](b,out); await b.close()
    os.system(f'ffmpeg -v error -y -framerate {FPS} -i {out}/%05d.jpg -c:v libx264 -preset veryfast -crf 12 -pix_fmt yuv420p clips/{name}.mp4')
    print(name,'done',len(os.listdir(out)),'frames')
asyncio.run(main())
