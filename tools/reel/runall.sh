cd "$(dirname "$0")"
for s in parfum jewelry loom loom2 din hotel rim silk silk2 coffee coffee2 nava nava2 end; do
  for try in 1 2; do timeout 900 python3 reel.py $s > log_$s.txt 2>&1 && break; done
  tail -1 log_$s.txt
done
python3 assemble.py && ls -la showreel*.mp4
