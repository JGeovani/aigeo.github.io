const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), '.git', 'rebase-merge');
try {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Removed', dir);
  } else {
    console.log('No rebase-merge directory');
  }
} catch (err) { console.error(err); process.exit(1); }
