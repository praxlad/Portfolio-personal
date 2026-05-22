const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DATA_PATH = path.join(__dirname, 'data.md');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const BUILD_PATH = path.join(__dirname, 'build.js');

console.log('====================================================');
console.log('👀 Dynamic Creator Portfolio: Local File Watcher');
console.log('====================================================');
console.log('Watching for changes in:');
console.log(`  - data.md`);
console.log(`  - template.html`);
console.log('\n⚡ Any edits will automatically compile and update index.html in real-time!');
console.log('Press Ctrl+C to stop watching.\n');

let isCompiling = false;

function runBuild() {
    if (isCompiling) return;
    isCompiling = true;
    
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ⚡ File change detected! Compiling...`);
    
    exec(`node "${BUILD_PATH}"`, (error, stdout, stderr) => {
        isCompiling = false;
        
        if (error) {
            console.error(`\x1b[31m[${timestamp}] ❌ Build failed: ${error.message}\x1b[0m`);
            return;
        }
        if (stderr) {
            console.warn(`\x1b[33m[${timestamp}] ⚠️ Build warning: ${stderr}\x1b[0m`);
            return;
        }
        
        // Success output
        console.log(`\x1b[32m[${timestamp}] ✅ Build succeeded! index.html updated successfully.\x1b[0m\n`);
    });
}

// Watch data.md using watchFile for maximum compatibility across OS filesystems
fs.watchFile(DATA_PATH, { interval: 300 }, (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs) {
        runBuild();
    }
});

// Watch template.html
fs.watchFile(TEMPLATE_PATH, { interval: 300 }, (curr, prev) => {
    if (curr.mtimeMs !== prev.mtimeMs) {
        runBuild();
    }
});

// Initial compilation on start
runBuild();
