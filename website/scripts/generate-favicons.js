const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

// Usage: node generate-favicons.js <input-png> <out-dir>
const [,, input, outDir] = process.argv;
if (!input || !outDir) {
  console.error('Usage: node generate-favicons.js <input-png> <out-dir>');
  process.exit(2);
}

const sizes = [16, 32, 48, 96, 192, 512];

(async () => {
  try {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const generated = [];
    for (const s of sizes) {
      const out = path.join(outDir, `favicon-${s}.png`);
      await sharp(input).resize(s, s).png().toFile(out);
      generated.push(out);
      console.log('Wrote', out);
    }

    // create favicon.ico from 16/32/48
    const icoOut = path.join(outDir, 'favicon.ico');
    const icoBuffer = await pngToIco(generated.filter(p => [16,32,48].some(sz => p.includes(`${sz}`))));
    fs.writeFileSync(icoOut, icoBuffer);
    console.log('Wrote', icoOut);

    // copy a 192 and 512 names for manifest convenience
    fs.copyFileSync(path.join(outDir, 'favicon-192.png'), path.join(outDir, 'android-chrome-192x192.png'));
    fs.copyFileSync(path.join(outDir, 'favicon-512.png'), path.join(outDir, 'android-chrome-512x512.png'));

    console.log('All favicons generated in', outDir);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
