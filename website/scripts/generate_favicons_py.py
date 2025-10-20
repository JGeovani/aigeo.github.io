from PIL import Image
import os
import sys

# Usage: python generate_favicons_py.py <input_png> <out_dir>
if len(sys.argv) < 3:
    print('Usage: python generate_favicons_py.py <input_png> <out_dir>')
    sys.exit(2)

input_png = sys.argv[1]
out_dir = sys.argv[2]

sizes = [16, 32, 48, 96, 192, 512]

os.makedirs(out_dir, exist_ok=True)

img = Image.open(input_png).convert('RGBA')

for s in sizes:
    out_path = os.path.join(out_dir, f'favicon-{s}.png')
    resized = img.resize((s, s), Image.LANCZOS)
    resized.save(out_path, format='PNG')
    print('Wrote', out_path)

# Save ICO (will include several sizes)
ico_path = os.path.join(out_dir, 'favicon.ico')
icon_sizes = [(16,16), (32,32), (48,48)]
img.save(ico_path, format='ICO', sizes=icon_sizes)
print('Wrote', ico_path)

# Copy 192 and 512 names for manifest
import shutil
shutil.copyfile(os.path.join(out_dir, 'favicon-192.png'), os.path.join(out_dir, 'android-chrome-192x192.png'))
shutil.copyfile(os.path.join(out_dir, 'favicon-512.png'), os.path.join(out_dir, 'android-chrome-512x512.png'))
print('Copied manifest-sized icons')
