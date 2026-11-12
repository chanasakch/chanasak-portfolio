import subprocess,json
order=['parfum','jewelry','loom','loom2','din','hotel','rim','silk','silk2','coffee','coffee2','nava','nava2','end']
X=0.5
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
ds=[dur(f'clips/{c}.mp4') for c in order]
inp=sum([['-i',f'clips/{c}.mp4'] for c in order],[])
f=[]; prev='0:v'; acc=ds[0]
for i in range(1,len(order)):
    off=acc-X; out=f'v{i}'
    f.append(f'[{prev}][{i}:v]xfade=transition=fade:duration={X}:offset={off:.3f}[{out}]')
    prev=out; acc=acc+ds[i]-X
f.append(f'[{prev}]split=2[h0][m0];[h0]scale=2560:1600:flags=lanczos,fade=t=in:st=0:d=0.4,fade=t=out:st={acc-0.6:.3f}:d=0.6,format=yuv420p[hd];[m0]scale=1280:800:flags=lanczos,fade=t=in:st=0:d=0.4,fade=t=out:st={acc-0.6:.3f}:d=0.6,format=yuv420p[sd]')
cmd=['ffmpeg','-v','error','-y',*inp,'-filter_complex',';'.join(f),'-map','[hd]','-an','-c:v','libx264','-preset','slow','-crf','23','-profile:v','high','-movflags','+faststart','showreel-hd.mp4','-map','[sd]','-an','-c:v','libx264','-preset','slow','-crf','22','-movflags','+faststart','showreel.mp4']
subprocess.run(cmd,check=True); print('total',round(acc,1),'s')
