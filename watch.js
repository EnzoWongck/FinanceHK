const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const REPO = 'C:/Users/user/Documents/GitHub/FinanceHK';
const FILE = path.join(REPO, 'index.html');

console.log('👀 Watching index.html for changes...');
console.log('   Press Ctrl+C to stop.\n');

let debounce = null;

fs.watch(FILE, () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] Change detected — committing and pushing...`);
    try {
      execSync(`git -C "${REPO}" add index.html`);
      execSync(`git -C "${REPO}" commit -m "update ${time}"`);
      execSync(`git -C "${REPO}" push`);
      console.log(`[${time}] ✅ Pushed to GitHub!\n`);
    } catch (e) {
      const msg = e.stderr?.toString() || e.message;
      if (msg.includes('nothing to commit')) {
        console.log(`[${time}] No changes to commit.\n`);
      } else {
        console.error(`[${time}] ❌ Error:`, msg, '\n');
      }
    }
  }, 1000); // wait 1s after last change before committing
});
